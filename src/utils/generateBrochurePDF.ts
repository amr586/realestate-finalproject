import { jsPDF } from 'jspdf';
import { Property, CurrencyCode } from '../types';

interface GenerateBrochureOptions {
  property: Property;
  currency: CurrencyCode;
  currentLang: 'en' | 'ar';
}

// Convert image URL to Data URL via canvas
async function getImageDataUrl(url: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width || 800;
          canvas.height = img.naturalHeight || img.height || 600;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(dataUrl);
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = url;
    } catch {
      resolve(null);
    }
  });
}

function formatPrice(amountUSD: number, currency: string): string {
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    EGP: 48.5,
    GBP: 0.79,
    AED: 3.67,
  };
  const rate = rates[currency] || 1;
  const converted = Math.round(amountUSD * rate);
  return `${currency} ${converted.toLocaleString()}`;
}

export async function generatePropertyBrochurePDF({
  property,
  currency,
  currentLang,
}: GenerateBrochureOptions): Promise<void> {
  // A4 dimensions in mm: 210 x 297
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const isAr = currentLang === 'ar';
  const primaryColor = [30, 27, 24]; // #1E1B18
  const goldColor = [194, 142, 92]; // #C28E5C
  const deepGold = [139, 94, 60]; // #8B5E3C
  const creamBg = [251, 249, 245]; // #FBF9F5
  const grayText = [115, 107, 99]; // #736B63
  const lightBorder = [229, 224, 216]; // #E5E0D8

  // Page 1: Cover & Architectural Presentation
  // Header bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SIENNA ESTATES', 16, 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.text('PRIVATE ARCHITECTURAL PORTFOLIO | DOSSIER & PROSPECTUS', 16, 20);

  doc.setFontSize(8);
  doc.setTextColor(200, 195, 185);
  doc.text(`CONFIDENTIAL · REF #${property.id.toUpperCase()}`, 194, 14, { align: 'right' });
  doc.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), 194, 20, { align: 'right' });

  // Main Image or Architectural Canvas Frame
  let yPos = 32;
  const imageWidth = 178;
  const imageHeight = 85;

  const photoDataUrl = await getImageDataUrl(property.coverImage);
  if (photoDataUrl) {
    try {
      doc.addImage(photoDataUrl, 'JPEG', 16, yPos, imageWidth, imageHeight);
    } catch {
      drawPhotoPlaceholder(doc, 16, yPos, imageWidth, imageHeight, property.title);
    }
  } else {
    drawPhotoPlaceholder(doc, 16, yPos, imageWidth, imageHeight, property.title);
  }

  // Image Frame border
  doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setLineWidth(0.5);
  doc.rect(16, yPos, imageWidth, imageHeight);

  yPos += imageHeight + 8;

  // Title and Price Banner
  doc.setFillColor(creamBg[0], creamBg[1], creamBg[2]);
  doc.roundedRect(16, yPos, 178, 24, 2, 2, 'F');
  doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
  doc.roundedRect(16, yPos, 178, 24, 2, 2, 'S');

  doc.setTextColor(deepGold[0], deepGold[1], deepGold[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(property.category.toUpperCase() + ' · ' + property.location.toUpperCase(), 22, yPos + 8);

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  // Clean property title for PDF encoding
  const sanitizedTitle = property.title.replace(/[^\x00-\x7F]/g, '').trim() || property.title;
  doc.text(sanitizedTitle, 22, yPos + 18);

  // Price box
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(deepGold[0], deepGold[1], deepGold[2]);
  const formattedPrice = formatPrice(property.priceUSD, currency);
  doc.text(formattedPrice, 188, yPos + 12, { align: 'right' });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text('OFF-MARKET PRIVATE TREATY', 188, yPos + 18, { align: 'right' });

  yPos += 30;

  // Key Architectural Specifications Grid
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('KEY ARCHITECTURAL SPECIFICATIONS', 16, yPos);

  yPos += 5;

  const specs = [
    { label: 'BEDROOMS', value: `${property.beds} Suites` },
    { label: 'BATHROOMS', value: `${property.baths} Bathrooms` },
    { label: 'INTERIOR AREA', value: `${property.sqft.toLocaleString()} sq.ft` },
    { label: 'PLOT SIZE', value: `${property.lotSqft.toLocaleString()} sq.ft` },
    { label: 'YEAR BUILT', value: `${property.yearBuilt}` },
    { label: 'GARAGE', value: `${property.garageSpaces} Vehicles` },
  ];

  const colWidth = 178 / 6;
  specs.forEach((spec, i) => {
    const x = 16 + i * colWidth;
    doc.setFillColor(250, 248, 245);
    doc.roundedRect(x, yPos, colWidth - 2, 16, 1.5, 1.5, 'F');
    doc.setDrawColor(lightBorder[0], lightBorder[1], lightBorder[2]);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, yPos, colWidth - 2, 16, 1.5, 1.5, 'S');

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(grayText[0], grayText[1], grayText[2]);
    doc.text(spec.label, x + (colWidth - 2) / 2, yPos + 6, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(spec.value, x + (colWidth - 2) / 2, yPos + 12, { align: 'center' });
  });

  yPos += 22;

  // Description & Architectural Narrative
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ESTATE OVERVIEW & ARCHITECTURAL PHILOSOPHY', 16, yPos);

  yPos += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 56, 52);

  const cleanDescription = (property.description || '').replace(/[^\x00-\x7F]/g, ' ').trim();
  const descLines = doc.splitTextToSize(cleanDescription, 178);
  doc.text(descLines.slice(0, 4), 16, yPos);

  yPos += Math.min(descLines.length, 4) * 4 + 4;

  if (property.architecturalNotes) {
    doc.setFillColor(30, 27, 24);
    doc.roundedRect(16, yPos, 178, 16, 1.5, 1.5, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.text('MATERIALITY & STRUCTURAL NOTES', 22, yPos + 6);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(220, 215, 205);
    const cleanNotes = property.architecturalNotes.replace(/[^\x00-\x7F]/g, ' ').trim();
    const noteLines = doc.splitTextToSize(cleanNotes, 166);
    doc.text(noteLines.slice(0, 2), 22, yPos + 11);

    yPos += 20;
  }

  // Bespoke Amenities & Location
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('EXCLUSIVE AMENITIES & LIFESTYLE FEATURES', 16, yPos);

  yPos += 5;
  const amenitiesList = property.amenities || [];
  const half = Math.ceil(amenitiesList.length / 2);
  const leftCol = amenitiesList.slice(0, half);
  const rightCol = amenitiesList.slice(half);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 56, 52);

  leftCol.forEach((item, idx) => {
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.circle(18, yPos + idx * 4.5 - 0.8, 0.8, 'F');
    doc.text(item.replace(/[^\x00-\x7F]/g, ''), 22, yPos + idx * 4.5);
  });

  rightCol.forEach((item, idx) => {
    doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
    doc.circle(108, yPos + idx * 4.5 - 0.8, 0.8, 'F');
    doc.text(item.replace(/[^\x00-\x7F]/g, ''), 112, yPos + idx * 4.5);
  });

  yPos += Math.max(leftCol.length, rightCol.length) * 4.5 + 6;

  // Agent Contact & Verification Section
  doc.setFillColor(creamBg[0], creamBg[1], creamBg[2]);
  doc.roundedRect(16, yPos, 178, 28, 2, 2, 'F');
  doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(16, yPos, 178, 28, 2, 2, 'S');

  doc.setTextColor(deepGold[0], deepGold[1], deepGold[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DEDICATED SENIOR ESTATE ADVISOR', 22, yPos + 7);

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(11);
  doc.text(property.agent.name || 'Private Client Group', 22, yPos + 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text(property.agent.role || 'Senior Estate Director', 22, yPos + 20);
  doc.text(`Direct: ${property.agent.phone}  ·  Email: ${property.agent.email}`, 22, yPos + 25);

  // Official Seal
  doc.setFillColor(deepGold[0], deepGold[1], deepGold[2]);
  doc.roundedRect(144, yPos + 5, 44, 18, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('SIENNA VERIFIED', 166, yPos + 11, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL DOSSIER', 166, yPos + 15, { align: 'center' });
  doc.text('MUSEUM-GRADE ASSET', 166, yPos + 19, { align: 'center' });

  // Footer on page 1
  doc.setFontSize(6.5);
  doc.setTextColor(grayText[0], grayText[1], grayText[2]);
  doc.text(
    'SIENNA Real Estate Group · 42 Park Avenue, New York & Zamalek Island, Cairo · All rights reserved.',
    105,
    290,
    { align: 'center' }
  );

  // Trigger download
  const cleanFileName = `SIENNA_Brochure_${property.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(cleanFileName);
}

function drawPhotoPlaceholder(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  title: string
) {
  doc.setFillColor(35, 31, 28);
  doc.rect(x, y, w, h, 'F');
  doc.setTextColor(194, 142, 92);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('SIENNA ARCHITECTURAL VISUALIZATION', x + w / 2, y + h / 2 - 4, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 195, 185);
  const cleanT = title.replace(/[^\x00-\x7F]/g, '');
  doc.text(cleanT || 'Private Residence', x + w / 2, y + h / 2 + 3, { align: 'center' });
}
