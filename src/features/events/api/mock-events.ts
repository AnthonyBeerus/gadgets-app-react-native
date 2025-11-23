import { Event } from '../types/event';

export const UPCOMING_EVENTS: Event[] = [
  {
    id: 1,
    title: "Botswana Music Festival",
    date: "2025-02-15",
    time: "18:00",
    venue: "Main Arena",
    category: "Music",
    price: 150,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
    description:
      "Experience the best of Botswana's music scene with top local and international artists.",
    totalTickets: 500,
    availableTickets: 120,
    featured: true,
  },
  {
    id: 2,
    title: "Art Exhibition Opening",
    date: "2025-02-18",
    time: "17:30",
    venue: "Gallery Space",
    category: "Art",
    price: 75,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    description:
      "Discover contemporary African art from emerging and established artists.",
    totalTickets: 100,
    availableTickets: 45,
    featured: false,
  },
  {
    id: 3,
    title: "Comedy Night",
    date: "2025-02-20",
    time: "20:00",
    venue: "Entertainment Hall",
    category: "Comedy",
    price: 80,
    image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
    description:
      "A night of laughter with Botswana's funniest comedians and special guests.",
    totalTickets: 200,
    availableTickets: 0,
    featured: false,
  },
  {
    id: 4,
    title: "Fashion Show",
    date: "2025-02-22",
    time: "19:00",
    venue: "Central Court",
    category: "Fashion",
    price: 120,
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800",
    description:
      "Showcasing the latest collections from top African fashion designers.",
    totalTickets: 150,
    availableTickets: 15,
    featured: false,
  },
  {
    id: 5,
    title: "Business Summit 2025",
    date: "2025-02-25",
    time: "08:00",
    venue: "Conference Center",
    category: "Business",
    price: 200,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    description:
      "Connect with industry leaders and explore business opportunities in Botswana.",
    totalTickets: 300,
    availableTickets: 180,
    featured: true,
  },
];

export const EVENT_CATEGORIES = ["All", "Music", "Art", "Comedy", "Fashion", "Business"];
