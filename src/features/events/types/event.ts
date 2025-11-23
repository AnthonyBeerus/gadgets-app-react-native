export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  price: number;
  image: string;
  description: string;
  totalTickets: number;
  availableTickets: number;
  featured: boolean;
}
