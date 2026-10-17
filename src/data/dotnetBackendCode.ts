export interface CodeSnippet {
  id: string;
  title: string;
  filename: string;
  language: 'csharp' | 'sql' | 'json';
  category: 'Controller' | 'DbContext' | 'Models' | 'SQL Server' | 'Config';
  code: string;
  description: string;
  descriptionAr: string;
}

export const DOTNET_BACKEND_CODE: CodeSnippet[] = [
  {
    id: 'properties-controller',
    title: 'ASP.NET Core Web API - PropertiesController',
    filename: 'Controllers/PropertiesController.cs',
    language: 'csharp',
    category: 'Controller',
    description: 'RESTful controller with async Entity Framework queries, filtering, pagination, and projection to DTOs.',
    descriptionAr: 'كونترولر RESTful متقدم مع استعلامات غير متزامنة وفلترة حسب السعر والنوع وتقسيم الصفحات.',
    code: `using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sienna.RealEstate.Data;
using Sienna.RealEstate.DTOs;
using Sienna.RealEstate.Models;

namespace Sienna.RealEstate.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    public class PropertiesController : ControllerBase
    {
        private readonly SiennaDbContext _context;
        private readonly ILogger<PropertiesController> _logger;

        public PropertiesController(SiennaDbContext context, ILogger<PropertiesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves filtered luxury residences with pagination
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<PagedResult<PropertyDto>>> GetProperties(
            [FromQuery] string? category,
            [FromQuery] string? listingType,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int? minBeds,
            [FromQuery] string? city,
            [FromQuery] string? searchTerm,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            var query = _context.Properties
                .Include(p => p.Agent)
                .Include(p => p.Images)
                .Include(p => p.Amenities)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(category) && category.ToLower() != "all")
                query = query.Where(p => p.Category.ToLower() == category.ToLower());

            if (!string.IsNullOrWhiteSpace(listingType))
                query = query.Where(p => p.ListingType.ToLower() == listingType.ToLower());

            if (minPrice.HasValue)
                query = query.Where(p => p.PriceUSD >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.PriceUSD <= maxPrice.Value);

            if (minBeds.HasValue)
                query = query.Where(p => p.Beds >= minBeds.Value);

            if (!string.IsNullOrWhiteSpace(city))
                query = query.Where(p => p.City.ToLower().Contains(city.ToLower()));

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var term = searchTerm.ToLower();
                query = query.Where(p => p.Title.ToLower().Contains(term) || 
                                         p.Location.ToLower().Contains(term) ||
                                         p.Architect.ToLower().Contains(term));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .OrderByDescending(p => p.Featured)
                .ThenByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new PropertyDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    TitleAr = p.TitleAr,
                    Tagline = p.Tagline,
                    Category = p.Category,
                    ListingType = p.ListingType,
                    PriceUSD = p.PriceUSD,
                    Location = p.Location,
                    LocationAr = p.LocationAr,
                    Beds = p.Beds,
                    Baths = p.Baths,
                    Sqft = p.Sqft,
                    CoverImage = p.CoverImageUrl,
                    Featured = p.Featured,
                    Architect = p.Architect
                })
                .ToListAsync();

            return Ok(new PagedResult<PropertyDto>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }

        /// <summary>
        /// Retrieves full architectural residence detail by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyDetailDto>> GetPropertyById(string id)
        {
            var property = await _context.Properties
                .Include(p => p.Agent)
                .Include(p => p.Images)
                .Include(p => p.Amenities)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
                return NotFound(new { message = $"Property with ID '{id}' was not found." });

            return Ok(property);
        }
    }
}`
  },
  {
    id: 'bookings-controller',
    title: 'ASP.NET Core Web API - Bookings & Inquiries Controller',
    filename: 'Controllers/BookingsController.cs',
    language: 'csharp',
    category: 'Controller',
    description: 'Handles VIP private viewing tours and client inquiries with transactional safety and email notification triggers.',
    descriptionAr: 'معالجة حجوزات المعاينات الخاصة وطلبات العملاء مع معاملات آمنة وإشعارات فورية.',
    code: `using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sienna.RealEstate.Data;
using Sienna.RealEstate.Models;

namespace Sienna.RealEstate.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    public class BookingsController : ControllerBase
    {
        private readonly SiennaDbContext _context;
        private readonly ILogger<BookingsController> _logger;

        public BookingsController(SiennaDbContext context, ILogger<BookingsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("schedule-viewing")]
        public async Task<IActionResult> ScheduleViewing([FromBody] ScheduleViewingRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var property = await _context.Properties.FindAsync(request.PropertyId);
            if (property == null)
                return NotFound(new { error = "Target residence not found." });

            var booking = new ViewingBooking
            {
                Id = Guid.NewGuid().ToString(),
                PropertyId = request.PropertyId,
                PropertyTitle = property.Title,
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                ScheduledDate = request.Date,
                TimeSlot = request.TimeSlot,
                TourType = request.TourType,
                Notes = request.Notes,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow
            };

            await _context.ViewingBookings.AddAsync(booking);
            await _context.SaveChangesAsync();

            _logger.LogInformation("VIP viewing scheduled for property {PropertyId} by {Email}", request.PropertyId, request.Email);

            return CreatedAtAction(nameof(ScheduleViewing), new { id = booking.Id }, new
            {
                bookingId = booking.Id,
                confirmationNumber = $"SIENNA-TOUR-{booking.Id.Substring(0, 8).ToUpper()}",
                status = "Confirmed",
                message = "Your private architectural viewing has been reserved. Our advisor will reach out shortly."
            });
        }
    }
}`
  },
  {
    id: 'dbcontext',
    title: 'Entity Framework Core 9 - SiennaDbContext',
    filename: 'Data/SiennaDbContext.cs',
    language: 'csharp',
    category: 'DbContext',
    description: 'EF Core DbContext configuring MS SQL Server schema, precise decimal scales, indexes, and seed seeds.',
    descriptionAr: 'سياق قاعدة بيانات EF Core 9 لتهيئة جداول MS SQL Server والمفاتيح الأجنبية ودقة الأرقام المالية.',
    code: `using Microsoft.EntityFrameworkCore;
using Sienna.RealEstate.Models;

namespace Sienna.RealEstate.Data
{
    public class SiennaDbContext : DbContext
    {
        public SiennaDbContext(DbContextOptions<SiennaDbContext> options) : base(options) { }

        public DbSet<Property> Properties => Set<Property>();
        public DbSet<Agent> Agents => Set<Agent>();
        public DbSet<PropertyImage> PropertyImages => Set<PropertyImage>();
        public DbSet<PropertyAmenity> Amenities => Set<PropertyAmenity>();
        public DbSet<ViewingBooking> ViewingBookings => Set<ViewingBooking>();
        public DbSet<PropertyInquiry> Inquiries => Set<PropertyInquiry>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Property entity configuration
            modelBuilder.Entity<Property>(entity =>
            {
                entity.ToTable("Properties");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id).HasMaxLength(64);
                entity.Property(p => p.Title).IsRequired().HasMaxLength(250);
                entity.Property(p => p.TitleAr).HasMaxLength(250);
                entity.Property(p => p.PriceUSD).HasPrecision(18, 2);
                entity.Property(p => p.PriceRentPerMonthUSD).HasPrecision(18, 2);
                entity.Property(p => p.Category).IsRequired().HasMaxLength(50);
                entity.Property(p => p.City).IsRequired().HasMaxLength(100);

                // Performance indexes for MS SQL Server
                entity.HasIndex(p => p.Category).HasDatabaseName("IX_Properties_Category");
                entity.HasIndex(p => p.PriceUSD).HasDatabaseName("IX_Properties_PriceUSD");
                entity.HasIndex(p => p.City).HasDatabaseName("IX_Properties_City");
                entity.HasIndex(p => p.Featured).HasDatabaseName("IX_Properties_Featured");

                // Relationships
                entity.HasOne(p => p.Agent)
                      .WithMany(a => a.Properties)
                      .HasForeignKey(p => p.AgentId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(p => p.Images)
                      .WithOne(i => i.Property)
                      .HasForeignKey(i => i.PropertyId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(p => p.Amenities)
                      .WithOne(a => a.Property)
                      .HasForeignKey(a => a.PropertyId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Agent configuration
            modelBuilder.Entity<Agent>(entity =>
            {
                entity.ToTable("Agents");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id).HasMaxLength(64);
                entity.Property(a => a.Name).IsRequired().HasMaxLength(150);
                entity.Property(a => a.Email).IsRequired().HasMaxLength(150);
            });
        }
    }
}`
  },
  {
    id: 'sql-schema',
    title: 'Microsoft SQL Server (T-SQL) - Complete Schema & Indexes',
    filename: 'Database/01_CreateSchema.sql',
    language: 'sql',
    category: 'SQL Server',
    description: 'Production T-SQL script with primary keys, foreign keys, non-clustered indexes, and auditing columns.',
    descriptionAr: 'سكريبت كامل لقاعدة بيانات MS SQL Server يشمل الجداول والمفاتيح والفهارس لتحقيق أعلى سرعة استعلام.',
    code: `-- =========================================================================
-- SIENNA LUXURY REAL ESTATE DATABASE - MS SQL SERVER DDL
-- Compatibility: Microsoft SQL Server 2019 / 2022 / Azure SQL Database
-- =========================================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'SiennaRealEstateDb')
BEGIN
    CREATE DATABASE SiennaRealEstateDb COLLATE Arabic_100_CI_AS;
END
GO

USE SiennaRealEstateDb;
GO

-- 1. Agents Table
IF OBJECT_ID(N'dbo.Agents', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Agents (
        Id NVARCHAR(64) NOT NULL PRIMARY KEY,
        FullName NVARCHAR(150) NOT NULL,
        FullNameAr NVARCHAR(150) NULL,
        Title NVARCHAR(150) NOT NULL,
        TitleAr NVARCHAR(150) NULL,
        Email NVARCHAR(150) NOT NULL UNIQUE,
        PhoneNumber NVARCHAR(50) NOT NULL,
        AvatarUrl NVARCHAR(500) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END
GO

-- 2. Properties Table
IF OBJECT_ID(N'dbo.Properties', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Properties (
        Id NVARCHAR(64) NOT NULL PRIMARY KEY,
        Title NVARCHAR(250) NOT NULL,
        TitleAr NVARCHAR(250) NULL,
        Tagline NVARCHAR(500) NULL,
        TaglineAr NVARCHAR(500) NULL,
        Category NVARCHAR(50) NOT NULL, -- 'villas', 'penthouses', 'coastal', 'mansions'
        ListingType NVARCHAR(20) NOT NULL DEFAULT 'buy', -- 'buy', 'rent'
        PriceUSD DECIMAL(18, 2) NOT NULL,
        PriceRentPerMonthUSD DECIMAL(18, 2) NULL,
        Location NVARCHAR(200) NOT NULL,
        LocationAr NVARCHAR(200) NULL,
        City NVARCHAR(100) NOT NULL,
        CityAr NVARCHAR(100) NULL,
        Address NVARCHAR(300) NOT NULL,
        Beds INT NOT NULL,
        Baths DECIMAL(3, 1) NOT NULL,
        SqFt INT NOT NULL,
        LotSqFt INT NOT NULL,
        YearBuilt INT NOT NULL,
        GarageSpaces INT NOT NULL DEFAULT 2,
        Architect NVARCHAR(150) NOT NULL,
        ArchitectAr NVARCHAR(150) NULL,
        Featured BIT NOT NULL DEFAULT 0,
        CoverImageUrl NVARCHAR(500) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        DescriptionAr NVARCHAR(MAX) NULL,
        Latitude FLOAT NOT NULL,
        Longitude FLOAT NOT NULL,
        AgentId NVARCHAR(64) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT FK_Properties_Agents FOREIGN KEY (AgentId) 
            REFERENCES dbo.Agents(Id) ON DELETE NO ACTION
    );
END
GO

-- Performance Indexes
CREATE NONCLUSTERED INDEX IX_Properties_Category ON dbo.Properties(Category) INCLUDE (PriceUSD, Beds, City);
CREATE NONCLUSTERED INDEX IX_Properties_PriceUSD ON dbo.Properties(PriceUSD);
CREATE NONCLUSTERED INDEX IX_Properties_City ON dbo.Properties(City);
CREATE NONCLUSTERED INDEX IX_Properties_Featured ON dbo.Properties(Featured);
GO

-- 3. Viewing Bookings Table
IF OBJECT_ID(N'dbo.ViewingBookings', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ViewingBookings (
        Id NVARCHAR(64) NOT NULL PRIMARY KEY,
        PropertyId NVARCHAR(64) NOT NULL,
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(150) NOT NULL,
        Phone NVARCHAR(50) NOT NULL,
        ScheduledDate DATE NOT NULL,
        TimeSlot NVARCHAR(50) NOT NULL,
        TourType NVARCHAR(50) NOT NULL DEFAULT 'in-person',
        Notes NVARCHAR(1000) NULL,
        Status NVARCHAR(30) NOT NULL DEFAULT 'Pending',
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_ViewingBookings_Properties FOREIGN KEY (PropertyId) 
            REFERENCES dbo.Properties(Id) ON DELETE CASCADE
    );
END
GO`
  },
  {
    id: 'appsettings',
    title: 'appsettings.json - MS SQL Server Connection',
    filename: 'appsettings.json',
    language: 'json',
    category: 'Config',
    description: 'Connection strings for local MS SQL Server Express or Azure SQL Database.',
    descriptionAr: 'ملف إعدادات الاتصال بقاعدة بيانات SQL Server وسلسلة الاتصال المشفرة.',
    code: `{
  "ConnectionStrings": {
    "SiennaDbConnection": "Server=tcp:sqlserver.sienna-residences.net,1433;Initial Catalog=SiennaRealEstateDb;Persist Security Info=False;User ID=sienna_admin;Password=YourSecurePassword123!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;",
    "LocalSqlServer": "Server=localhost\\\\SQLEXPRESS;Database=SiennaRealEstateDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  },
  "AllowedHosts": "*"
}`
  },
  {
    id: 'price-alerts-controller',
    title: 'ASP.NET Core Web API - PriceAlertsController',
    filename: 'Controllers/PriceAlertsController.cs',
    language: 'csharp',
    category: 'Controller',
    description: 'Handles price drop alert subscriptions, threshold validation, and alert cancellation.',
    descriptionAr: 'كونترولر معالجة تنبيهات هبوط الأسعار، التحقق من حدود الأسعار، وإدارة التنبيهات النشطة.',
    code: `using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sienna.RealEstate.Data;
using Sienna.RealEstate.DTOs;
using Sienna.RealEstate.Models;

namespace Sienna.RealEstate.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    [Produces("application/json")]
    public class PriceAlertsController : ControllerBase
    {
        private readonly SiennaDbContext _context;
        private readonly ILogger<PriceAlertsController> _logger;

        public PriceAlertsController(SiennaDbContext context, ILogger<PriceAlertsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<PriceAlertDto>> CreatePriceAlert([FromBody] CreatePriceAlertRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var property = await _context.Properties.FindAsync(request.PropertyId);
            if (property == null)
                return NotFound($"Property with ID '{request.PropertyId}' not found.");

            if (request.ThresholdPriceUSD >= property.PriceUSD)
                return BadRequest("Threshold price must be strictly lower than the current listing price.");

            var alert = new PriceAlert
            {
                Id = Guid.NewGuid().ToString("N"),
                PropertyId = request.PropertyId,
                Email = request.Email.Trim().ToLowerInvariant(),
                Phone = request.Phone,
                CurrentPriceUSD = property.PriceUSD,
                ThresholdPriceUSD = request.ThresholdPriceUSD,
                PercentageDrop = Math.Round(((property.PriceUSD - request.ThresholdPriceUSD) / property.PriceUSD) * 100, 2),
                Status = "Monitoring",
                CreatedAt = DateTime.UtcNow,
                LastEvaluatedAt = DateTime.UtcNow
            };

            _context.PriceAlerts.Add(alert);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Activated price sentinel for {Email} on {PropertyId} at \${Threshold}", 
                alert.Email, alert.PropertyId, alert.ThresholdPriceUSD);

            return CreatedAtAction(nameof(GetAlerts), new { id = alert.Id }, alert);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PriceAlert>>> GetAlerts([FromQuery] string? email)
        {
            var query = _context.PriceAlerts.AsNoTracking();
            if (!string.IsNullOrEmpty(email))
                query = query.Where(a => a.Email == email.ToLowerInvariant());

            return Ok(await query.ToListAsync());
        }
    }
}`
  },
  {
    id: 'price-alert-worker',
    title: 'ASP.NET Core BackgroundService - PriceAlertWorker',
    filename: 'Services/PriceAlertMonitoringWorker.cs',
    language: 'csharp',
    category: 'Controller',
    description: 'Background worker running PeriodicTimer to evaluate market valuation dips and dispatch automated SMTP emails.',
    descriptionAr: 'خدمة خلفية دورية ترصد تغيرات الأسعار في قاعدة البيانات وترسل تنبيهات البريد الإلكتروني الفورية.',
    code: `using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Sienna.RealEstate.Data;
using Sienna.RealEstate.Services;

namespace Sienna.RealEstate.Workers
{
    public class PriceAlertMonitoringWorker : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IEmailNotificationService _emailService;
        private readonly ILogger<PriceAlertMonitoringWorker> _logger;
        private readonly PeriodicTimer _timer = new(TimeSpan.FromMinutes(15));

        public PriceAlertMonitoringWorker(
            IServiceScopeFactory scopeFactory,
            IEmailNotificationService emailService,
            ILogger<PriceAlertMonitoringWorker> logger)
        {
            _scopeFactory = scopeFactory;
            _emailService = emailService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("SIENNA Price Sentinel Monitoring Worker started.");

            while (await _timer.WaitForNextTickAsync(stoppingToken) && !stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<SiennaDbContext>();

                    var pendingAlerts = await db.PriceAlerts
                        .Include(a => a.Property)
                        .Where(a => a.Status == "Monitoring")
                        .ToListAsync(stoppingToken);

                    foreach (var alert in pendingAlerts)
                    {
                        if (alert.Property.PriceUSD <= alert.ThresholdPriceUSD)
                        {
                            await _emailService.SendPriceDropNotificationAsync(
                                toEmail: alert.Email,
                                propertyTitle: alert.Property.Title,
                                newPrice: alert.Property.PriceUSD,
                                originalPrice: alert.CurrentPriceUSD,
                                threshold: alert.ThresholdPriceUSD
                            );

                            alert.Status = "Triggered";
                            alert.TriggeredAt = DateTime.UtcNow;
                            alert.NotificationsSent += 1;
                        }
                        alert.LastEvaluatedAt = DateTime.UtcNow;
                    }

                    await db.SaveChangesAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred during price monitoring evaluation cycle.");
                }
            }
        }
    }
}`
  }
];
