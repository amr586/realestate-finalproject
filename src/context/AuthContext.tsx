import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, Property, PropertyInquiry, ViewingBooking } from '../types';
import { PROPERTIES, AGENTS } from '../data/properties';

interface AuthContextType {
  currentUser: AppUser | null;
  userRole: 'client' | 'agent' | 'guest';
  properties: Property[];
  inquiries: PropertyInquiry[];
  bookings: ViewingBooking[];
  loginAs: (role: 'client' | 'agent') => void;
  registerUser: (name: string, email: string, role: 'client' | 'agent', phone: string) => void;
  logout: () => void;
  addProperty: (property: Omit<Property, 'id' | 'agent'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  addInquiry: (propertyId: string, propertyTitle: string, fullName: string, email: string, phone: string, message: string) => void;
  replyToInquiry: (inquiryId: string, replyMessage: string) => void;
  addBooking: (booking: Omit<ViewingBooking, 'id' | 'status' | 'createdAt'>) => void;
}

const DEFAULT_CLIENT: AppUser = {
  id: 'usr-client-01',
  name: 'Ahmed Zaki',
  nameAr: 'أحمد زكي',
  email: 'a.zaki@luxurycollector.eg',
  role: 'client',
  phone: '+20 100 442 8811'
};

const DEFAULT_AGENT: AppUser = {
  id: 'agent-1',
  name: 'Karim El-Sayed',
  nameAr: 'كريم السيد',
  email: 'k.elsayed@sienna-residences.com',
  role: 'agent',
  phone: '+20 100 892 4100',
  agentId: 'agent-1'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('sienna_current_user');
    return saved ? JSON.parse(saved) : DEFAULT_CLIENT;
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('sienna_custom_properties');
    return saved ? JSON.parse(saved) : PROPERTIES;
  });

  const [inquiries, setInquiries] = useState<PropertyInquiry[]>(() => {
    const saved = localStorage.getItem('sienna_inquiries');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'inq-101',
        propertyId: 'sienna-01',
        propertyTitle: 'The Travertine Sanctuary',
        fullName: 'Omar Sherif',
        email: 'o.sherif@cairoholdings.com',
        phone: '+20 111 200 3400',
        message: 'Interested in the Travertine Sanctuary. Would like to review full architectural floorplans and confirm private helicopter clearance.',
        status: 'new',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'inq-102',
        propertyId: 'sienna-02',
        propertyTitle: 'The Solstice Sky Penthouse',
        fullName: 'Dina Mansour',
        email: 'dina@mansourgroup.com',
        phone: '+20 122 890 1200',
        message: 'Requesting a confidential evening tour of the Zamalek penthouse for family office principal.',
        status: 'replied',
        replyMessage: 'Private evening tour confirmed with biometric access clearance. Chauffeur dispatched.',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
  });

  const [bookings, setBookings] = useState<ViewingBooking[]>(() => {
    const saved = localStorage.getItem('sienna_bookings');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'bk-201',
        propertyId: 'sienna-01',
        propertyTitle: 'The Travertine Sanctuary',
        fullName: 'Ahmed Zaki',
        email: 'a.zaki@luxurycollector.eg',
        phone: '+20 100 442 8811',
        date: '2026-10-24',
        timeSlot: '16:00 - 18:00 (Sunset Viewing)',
        tourType: 'private-chauffeur',
        notes: 'Interested in structural travertine longevity and subterranean gallery.',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    ];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sienna_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sienna_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('sienna_custom_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('sienna_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem('sienna_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const loginAs = (role: 'client' | 'agent') => {
    if (role === 'agent') {
      setCurrentUser(DEFAULT_AGENT);
    } else {
      setCurrentUser(DEFAULT_CLIENT);
    }
  };

  const registerUser = (name: string, email: string, role: 'client' | 'agent', phone: string) => {
    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      name,
      nameAr: name,
      email,
      role,
      phone,
      agentId: role === 'agent' ? `agent-${Date.now()}` : undefined
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addProperty = (newPropData: Omit<Property, 'id' | 'agent'>) => {
    const agent = AGENTS.find(a => a.id === currentUser?.agentId) || AGENTS[0];
    const newProperty: Property = {
      ...newPropData,
      id: `sienna-custom-${Date.now()}`,
      agent
    };
    setProperties(prev => [newProperty, ...prev]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const addInquiry = (
    propertyId: string,
    propertyTitle: string,
    fullName: string,
    email: string,
    phone: string,
    message: string
  ) => {
    const newInq: PropertyInquiry = {
      id: `inq-${Date.now()}`,
      propertyId,
      propertyTitle,
      fullName,
      email,
      phone,
      message,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setInquiries(prev => [newInq, ...prev]);
  };

  const replyToInquiry = (inquiryId: string, replyMessage: string) => {
    setInquiries(prev =>
      prev.map(inq => (inq.id === inquiryId ? { ...inq, status: 'replied', replyMessage } : inq))
    );
  };

  const addBooking = (bookingData: Omit<ViewingBooking, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: ViewingBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole: currentUser ? currentUser.role : 'guest',
        properties,
        inquiries,
        bookings,
        loginAs,
        registerUser,
        logout,
        addProperty,
        updateProperty,
        deleteProperty,
        addInquiry,
        replyToInquiry,
        addBooking
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
