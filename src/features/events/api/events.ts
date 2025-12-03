
import { supabase } from '../../../shared/lib/supabase';
import { Event } from '../types/event';

export const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      venue:event_venue(*)
    `)
    .eq('status', 'active')
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  if (!data) return [];

  return data.map((event: any) => ({
    id: event.id,
    title: event.title,
    date: event.event_date,
    time: event.start_time.slice(0, 5), // Format HH:MM:SS to HH:MM
    venue: event.venue?.name || 'Unknown Venue',
    category: event.category,
    price: event.price,
    image: event.image_url || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800', // Fallback image
    description: event.description,
    totalTickets: event.total_tickets,
    availableTickets: event.available_tickets,
    featured: event.is_featured || false,
  }));
};
