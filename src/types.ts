export type PropertyCategory = 'all' | 'villas' | 'penthouses' | 'coastal' | 'mansions';
export type ListingType = 'buy' | 'rent';
export type CurrencyCode = 'USD' | 'EGP' | 'AED';

export interface PropertyAgent {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  phone: string;
  email: string;
  avatar: string;
  languages: string[];
}

export interface Property {
  id: string;
  title: string;
  titleAr: string;
  tagline: string;
  taglineAr: string;
  category: PropertyCategory;
  listingType: ListingType;
  priceUSD: number;
  priceRentPerMonthUSD?: number;
  location: string;
  locationAr: string;
  city: string;
  cityAr: string;
  address: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSqft: number;
  yearBuilt: number;
  garageSpaces: number;
  architect: string;
  architectAr: string;
  featured: boolean;
  coverImage: string;
  galleryImages: string[];
  description: string;
  descriptionAr: string;
  amenities: string[];
  amenitiesAr: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  agent: PropertyAgent;
  floorPlanUrl?: string;
  architecturalNotes?: string;
  architecturalNotesAr?: string;
}

export interface ViewingBooking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  tourType: 'in-person' | 'private-chauffeur' | 'virtual-3d';
  notes?: string;
  status: 'confirmed' | 'pending' | 'completed';
  createdAt: string;
}

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'replied' | 'archived';
  replyMessage?: string;
  createdAt: string;
}

export type UserRole = 'client' | 'agent';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  nameAr: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  agentId?: string; // If role is agent
}

export interface SearchFilterState {
  searchTerm: string;
  listingType: 'all' | 'buy' | 'rent';
  category: PropertyCategory;
  city: string;
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  minSqft: number;
  amenities: string[];
}
