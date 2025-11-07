-- ============================================================
-- GET ACTUAL IDS FIRST
-- ============================================================

-- Get provider IDs for HairStranz
SELECT id, name, email FROM service_provider WHERE shop_id = 79;

-- Expected output: Two rows with their actual IDs
-- Example:
-- | id  | name                              | email                      |
-- | 156 | Thandi Mokoena - Senior Stylist   | thandi@hairstranz.com      |
-- | 157 | Kabelo Motsumi - Master Colorist  | kabelo@hairstranz.com      |

-- COPY THE IDs FROM THE RESULT ABOVE AND PASTE THEM IN THE COMMENT BELOW:
-- Thandi's ID: ___
-- Kabelo's ID: ___
