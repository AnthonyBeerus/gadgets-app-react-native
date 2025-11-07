-- Enable virtual try-on for beauty shops that offer hair and nail services
-- HairStranz (79), Doll Life (80), Cutting Line Studio (81)

UPDATE shops
SET has_virtual_try_on = true
WHERE id IN (79, 80, 81);

-- Verify the update
SELECT id, name, has_virtual_try_on, has_appointment_booking
FROM shops
WHERE id IN (79, 80, 81);
