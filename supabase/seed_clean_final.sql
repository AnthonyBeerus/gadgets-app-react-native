-- Clean seed file using only existing columns (title, slug, price, category)
-- Fixed to remove duplicate slugs and non-existent columns

BEGIN;

-- Clear existing products first
DELETE FROM product WHERE id > 0;

-- Sefalana (Supermarket)
INSERT INTO product (title, slug, price, category) VALUES 
('Fresh Organic Bananas 1kg', 'fresh-organic-bananas-1kg', 25.00, 1),
('Premium Ground Coffee 500g', 'premium-ground-coffee-500g', 89.00, 1),
('Fresh Milk 2L', 'fresh-milk-2l', 35.00, 1),
('Whole Grain Bread 700g', 'whole-grain-bread-700g', 28.00, 1),
('Free Range Eggs 18pk', 'free-range-eggs-18pk', 65.00, 1),
('Premium Olive Oil 500ml', 'premium-olive-oil-500ml', 145.00, 1),
('Fresh Tomatoes 1kg', 'fresh-tomatoes-1kg', 42.00, 1),
('Basmati Rice 2kg', 'basmati-rice-2kg', 78.00, 1),
('Chicken Breast 1kg', 'chicken-breast-1kg', 125.00, 1),
('Organic Honey 500g', 'organic-honey-500g', 95.00, 1);

-- Bartender (Bar Supplies)  
INSERT INTO product (title, slug, price, category) VALUES 
('Johnnie Walker Black Label', 'johnnie-walker-black-label', 650.00, 1),
('Premium Cocktail Shaker Set', 'premium-cocktail-shaker-set', 280.00, 1),
('Champagne Flutes Set of 6', 'champagne-flutes-set-6', 320.00, 1),
('Bombay Sapphire Gin', 'bombay-sapphire-gin', 485.00, 1),
('Professional Bar Spoon', 'professional-bar-spoon', 85.00, 1),
('Wine Decanter Crystal', 'wine-decanter-crystal', 450.00, 1),
('Whiskey Stones Set', 'whiskey-stones-set', 150.00, 1),
('Bacardi Superior Rum', 'bacardi-superior-rum', 380.00, 1),
('Mixology Recipe Book', 'mixology-recipe-book', 220.00, 1),
('Ice Bucket Stainless Steel', 'ice-bucket-stainless-steel', 195.00, 1);

-- Liquorama (Alcohol)
INSERT INTO product (title, slug, price, category) VALUES 
('Dom Perignon Champagne', 'dom-perignon-champagne', 3500.00, 1),
('Macallan 18 Year Whisky', 'macallan-18-year-whisky', 4200.00, 1),
('Hennessy XO Cognac', 'hennessy-xo-cognac', 2800.00, 1),
('Grey Goose Vodka', 'grey-goose-vodka', 750.00, 1),
('Patron Silver Tequila', 'patron-silver-tequila', 950.00, 1),
('Chivas Regal 12 Year', 'chivas-regal-12-year', 580.00, 1),
('Moet Chandon Champagne', 'moet-chandon-champagne', 850.00, 1),
('Jack Daniels No.7', 'jack-daniels-no7', 420.00, 1),
('Absolut Vodka', 'absolut-vodka', 320.00, 1),
('Captain Morgan Spiced Rum', 'captain-morgan-spiced-rum', 280.00, 1);

COMMIT;