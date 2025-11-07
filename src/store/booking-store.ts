import { create } from "zustand";

export type ServiceProvider = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  rating?: number;
};

export type BookingService = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category_id?: number;
  service_provider: ServiceProvider;
};

export type ShopContext = {
  id: number;
  name: string;
  logo_url?: string;
  image_url?: string;
  location?: string;
  phone?: string;
};

type BookingState = {
  // Modal visibility
  isModalVisible: boolean;

  // Selected service and shop context
  selectedService: BookingService | null;
  shopContext: ShopContext | null;

  // Booking form data
  selectedDate: Date;
  selectedTime: string | null;
  notes: string;

  // Actions
  openBookingModal: (service: BookingService, shop: ShopContext) => void;
  closeBookingModal: () => void;
  setSelectedDate: (date: Date) => void;
  setSelectedTime: (time: string | null) => void;
  setNotes: (notes: string) => void;
  resetBookingForm: () => void;

  // Utility functions
  getMinDate: () => Date;
  getMaxDate: () => Date;
  formatDate: (date: Date) => string;
  generateTimeSlots: () => string[];
};

const getInitialDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};

export const useBookingStore = create<BookingState>((set, get) => ({
  // Initial state
  isModalVisible: false,
  selectedService: null,
  shopContext: null,
  selectedDate: getInitialDate(),
  selectedTime: null,
  notes: "",

  // Actions
  openBookingModal: (service: BookingService, shop: ShopContext) => {
    set({
      isModalVisible: true,
      selectedService: service,
      shopContext: shop,
      selectedDate: getInitialDate(),
      selectedTime: null,
      notes: "",
    });
  },

  closeBookingModal: () => {
    set({ isModalVisible: false });
  },

  setSelectedDate: (date: Date) => {
    set({ selectedDate: date });
  },

  setSelectedTime: (time: string | null) => {
    set({ selectedTime: time });
  },

  setNotes: (notes: string) => {
    set({ notes });
  },

  resetBookingForm: () => {
    set({
      selectedDate: getInitialDate(),
      selectedTime: null,
      notes: "",
    });
  },

  // Utility functions
  getMinDate: () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  },

  getMaxDate: () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days advance booking
    return maxDate;
  },

  formatDate: (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  generateTimeSlots: () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  },
}));
