-- Create event_venue table for event locations
CREATE TABLE IF NOT EXISTS public.event_venue (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    capacity TEXT NOT NULL,
    amenities TEXT[] DEFAULT '{}',
    price_range TEXT,
    phone TEXT,
    email TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create events table for events happening at venues
CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    venue_id BIGINT REFERENCES public.event_venue(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('Music', 'Comedy', 'Art', 'Business', 'Culture', 'Film')),
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    image_url TEXT,
    price DECIMAL(10,2) NOT NULL,
    total_tickets INTEGER NOT NULL DEFAULT 0,
    available_tickets INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'sold_out', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create ticket_purchases table for tracking ticket sales
CREATE TABLE IF NOT EXISTS public.ticket_purchases (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    total_price DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'refunded')),
    payment_intent_id TEXT, -- For Stripe integration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_venue_available ON public.event_venue(is_available);
CREATE INDEX IF NOT EXISTS idx_event_venue_type ON public.event_venue(type);
CREATE INDEX IF NOT EXISTS idx_events_venue_id ON public.events(venue_id);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_event_id ON public.ticket_purchases(event_id);
CREATE INDEX IF NOT EXISTS idx_ticket_purchases_user_id ON public.ticket_purchases(user_id);

-- Enable Row Level Security
ALTER TABLE public.event_venue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_venue (everyone can view available venues)
CREATE POLICY "Event venues are viewable by everyone" ON public.event_venue
    FOR SELECT USING (is_available = true);

-- RLS Policies for events (everyone can view active events)
CREATE POLICY "Events are viewable by everyone" ON public.events
    FOR SELECT USING (status = 'active');

-- RLS Policies for ticket_purchases (users can only see their own purchases)
CREATE POLICY "Users can view their own ticket purchases" ON public.ticket_purchases
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ticket purchases" ON public.ticket_purchases
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to update available_tickets when a purchase is made
CREATE OR REPLACE FUNCTION update_available_tickets()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Decrease available tickets when a purchase is made
        UPDATE public.events 
        SET available_tickets = available_tickets - NEW.quantity,
            updated_at = timezone('utc'::text, now())
        WHERE id = NEW.event_id;
        
        -- Update status to sold_out if no tickets left
        UPDATE public.events 
        SET status = 'sold_out',
            updated_at = timezone('utc'::text, now())
        WHERE id = NEW.event_id AND available_tickets <= 0;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Increase available tickets when a purchase is cancelled/refunded
        UPDATE public.events 
        SET available_tickets = available_tickets + OLD.quantity,
            status = CASE 
                WHEN status = 'sold_out' AND available_tickets + OLD.quantity > 0 THEN 'active'
                ELSE status
            END,
            updated_at = timezone('utc'::text, now())
        WHERE id = OLD.event_id;
        
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Handle status changes (cancellation/refund)
        IF OLD.status = 'confirmed' AND NEW.status IN ('cancelled', 'refunded') THEN
            UPDATE public.events 
            SET available_tickets = available_tickets + NEW.quantity,
                status = CASE 
                    WHEN status = 'sold_out' AND available_tickets + NEW.quantity > 0 THEN 'active'
                    ELSE status
                END,
                updated_at = timezone('utc'::text, now())
            WHERE id = NEW.event_id;
        ELSIF OLD.status IN ('cancelled', 'refunded') AND NEW.status = 'confirmed' THEN
            UPDATE public.events 
            SET available_tickets = available_tickets - NEW.quantity,
                updated_at = timezone('utc'::text, now())
            WHERE id = NEW.event_id;
            
            -- Update status to sold_out if no tickets left
            UPDATE public.events 
            SET status = 'sold_out',
                updated_at = timezone('utc'::text, now())
            WHERE id = NEW.event_id AND available_tickets <= 0;
        END IF;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update available tickets
CREATE TRIGGER ticket_purchase_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.ticket_purchases
    FOR EACH ROW EXECUTE FUNCTION update_available_tickets();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER events_updated_at_trigger
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();