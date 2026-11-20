USE prrp_db;

INSERT INTO users (user_id, full_name, email, password_hash, phone_number, role, city, state) VALUES
(1, 'Vikramaditya Sharma', 'admin@prrp.in', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919811001122', 'ROLE_ADMIN', 'New Delhi', 'Delhi'),
(2, 'Aarav Infotech Ltd', 'contact@aaravtech.in', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919876543210', 'ROLE_SELLER', 'Bengaluru', 'Karnataka'),
(3, 'Desi Crafts & Home Decor', 'support@desicrafts.com', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919822334455', 'ROLE_SELLER', 'Jaipur', 'Rajasthan'),
(4, 'FitPulse Fitness Gear', 'sales@fitpulse.in', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919844556677', 'ROLE_SELLER', 'Pune', 'Maharashtra'),
(5, 'Rohan Verma', 'rohan.verma@gmail.com', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919810123456', 'ROLE_CUSTOMER', 'Noida', 'Uttar Pradesh'),
(6, 'Priya Sundaram', 'priya.sundaram@yahoo.co.in', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919717890123', 'ROLE_CUSTOMER', 'Chennai', 'Tamil Nadu'),
(7, 'Ananya Iyer', 'ananya.iyer@outlook.com', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919650234567', 'ROLE_CUSTOMER', 'Mumbai', 'Maharashtra'),
(8, 'Kabir Mehta', 'kabir.mehta@gmail.com', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919920345678', 'ROLE_CUSTOMER', 'Ahmedabad', 'Gujarat'),
(9, 'Simran Kaur', 'simran.kaur@gmail.com', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919818456789', 'ROLE_CUSTOMER', 'Chandigarh', 'Punjab'),
(10, 'Tariq Hussain', 'tariq.hussain@gmail.com', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919419123456', 'ROLE_CUSTOMER', 'Hyderabad', 'Telangana'),
(11, 'Customer User', 'customer@prrp.in', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919800000000', 'ROLE_CUSTOMER', 'New Delhi', 'Delhi'),
(12, 'TechMatrix India', 'seller@prrp.in', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919876543210', 'ROLE_SELLER', 'Noida', 'Uttar Pradesh'),
(13, 'Platform Admin', 'realadmin@prrp.in', '$2a$10$qhRSk/.Bjx4YDuEaRiyFBuLZIbk/0wNIx/9Ty8Nl1T3olOGzIkkkG', '+919811001122', 'ROLE_ADMIN', 'New Delhi', 'Delhi'),
(15, 'Aditya Kumar', 'adityakumar@customer.com', '$2a$10$jUBtBVvsdiEzmr5WJkCsauMK/FJ8mpRIOUUorRy1t/ulnk/Sr/Dv6', '+91 98765 43210', 'ROLE_CUSTOMER', 'New Delhi', 'Delhi'),
(16, 'Sid Gusain', 'sid@seller.com', '$2a$10$mKpcuRPuCFrsSI06kBDaXOUDhOLbsC8CM53hMn7F.7xXOCAnLeraS', '+91 1234567890', 'ROLE_SELLER', 'Gzb', 'Delhi')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), email = VALUES(email), password_hash = VALUES(password_hash), role = VALUES(role);

INSERT INTO categories (category_id, category_name, category_slug, description) VALUES
(1, 'Electronics & Gadgets', 'electronics-gadgets', 'Smartphones, Audio gear, Laptops and accessories'),
(2, 'Home & Kitchen', 'home-kitchen', 'Handicrafts, kitchenware, bedding and decor'),
(3, 'Fitness & Sports', 'fitness-sports', 'Workout equipment, yoga mats, and sports gear'),
(4, 'Fashion & Apparel', 'fashion-apparel', 'Ethnic wear, casual attire, footwear')
ON DUPLICATE KEY UPDATE category_name = VALUES(category_name), category_slug = VALUES(category_slug);

INSERT INTO products (product_id, seller_id, category_id, name, description, price, sku, is_available) VALUES
(1, 12, 1, 'boAt BassHeads 900 Pro Wired Headphones', 'High fidelity over-ear wired headphones with 40mm Neodymium dynamic drivers and snug fit padded cushions.', 1499.00, 'ELC-BOAT-900', TRUE),
(2, 12, 1, 'Noise ColorFit Ultra 3 Smartwatch', '1.96 inch AMOLED Display, metallic finish, BT Calling, 7-day battery life with health monitoring suite.', 2999.00, 'ELC-NOISE-U3', TRUE),
(3, 3, 2, 'Jaipuri Pure Cotton Double Bed Bedsheet (Sanganeri Print)', 'Traditional royal Rajasthani block print king size bedsheet with two matching zipped pillow covers.', 899.00, 'HOM-JPR-BED01', TRUE),
(4, 3, 2, 'Handcrafted Brass Diya with Peacock Arch (Set of 2)', 'Solid pure brass traditional diya suitable for pooja rooms, Diwali festivities, and home decor gifting.', 1250.00, 'HOM-BRS-DIYA2', TRUE),
(5, 4, 3, 'Boldfit Anti-Skid TPE Yoga Mat 6mm with Carrying Strap', 'Eco-friendly double-sided textured grip fitness mat suitable for Yoga, Pilates, and floor exercises.', 749.00, 'SPT-BLD-YOGA6', TRUE),
(6, 4, 3, 'Cultsport 20kg Adjustable Cast Iron Dumbbell Set', 'Heavy duty multi-purpose dumbbell kit with star-lock collars for home strength training and muscle building.', 3499.00, 'SPT-CLT-DB20', TRUE),
(7, 12, 1, 'Portronics Konnect Pro 65W GaN Fast Charger', 'Dual Type-C + USB-A ports fast charger supporting PD 3.0 and QC for laptops, tablets, and phones.', 1199.00, 'ELC-PORT-65W', TRUE),
(8, 3, 2, 'Handmade Blue Pottery Ceramic Planter Pot', 'Authentic GI tagged ceramic planter handcrafted by Jaipur master artisans.', 650.00, 'HOM-JPR-POT01', TRUE),
(9, 12, 1, 'OnePlus Nord Buds 3 Pro', 'Active Noise Cancellation up to 49dB, 12.4mm Titanized diaphragm drivers, 44 hours total playback.', 2799.00, 'ELC-OP-BUDS3', TRUE),
(10, 12, 1, 'CMF Buds', 'Active Noise Cancellation Wireless Earbuds with Ultra Bass Technology.', 3000.00, 'EHHU-HHH', TRUE),
(11, 16, 3, 'Dumbbell', 'Heavy duty solid hex rubber dumbbell pair for home fitness workouts.', 240.00, 'dfgdfsa', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price), description = VALUES(description);

INSERT INTO product_images (image_id, product_id, image_url, is_primary, display_order) VALUES
(1, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', TRUE, 1),
(2, 1, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', FALSE, 2),
(3, 2, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', TRUE, 1),
(4, 2, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800', FALSE, 2),
(5, 3, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800', TRUE, 1),
(6, 4, 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800', TRUE, 1),
(7, 5, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800', TRUE, 1),
(8, 6, 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800', TRUE, 1),
(9, 7, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800', TRUE, 1),
(10, 8, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800', TRUE, 1),
(11, 9, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', TRUE, 1),
(12, 10, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', TRUE, 1),
(13, 11, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80', TRUE, 1)
ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), is_primary = VALUES(is_primary);

INSERT INTO reviews (review_id, product_id, user_id, rating, title, comment, moderation_status, created_at) VALUES
(1, 1, 5, 5, 'Paisa Vasool! Outstanding Bass for Indian Music', 'The bass response is phenomenal at this price tag. Build quality is sturdy and does not feel cheap. Very comfortable for long coding sessions.', 'APPROVED', '2026-02-10 10:15:00'),
(2, 1, 6, 4, 'Very good sound quality, wire could be longer', 'Vocals and highs are very crisp. Only minor drawback is the cable length is around 1.2m, which is slightly short if your PC CPU is placed on the floor.', 'APPROVED', '2026-02-14 14:30:00'),
(3, 1, 7, 5, 'Great design and sound clarity', 'Loved the cushions and the folding hinge design. Mic clarity over Google Meet is also great.', 'APPROVED', '2026-02-18 11:20:00'),
(4, 1, 8, 1, 'Duplicate fake product sent, total scam!!!', 'Worst seller ever do not buy, fake duplicate copy delivered box was opened.', 'REJECTED', '2026-02-19 09:00:00'),
(5, 1, 9, 4, 'Awaiting approval: Decent headphone overall', 'Soundstage is balanced, lightweight on ears. Will update review after 1 month.', 'PENDING', '2026-02-20 08:30:00'),
(6, 2, 5, 4, 'Smooth display and accurate step counting', 'The AMOLED display is super bright outdoors even in harsh Delhi sunlight. Battery easily lasts 5-6 days with normal usage.', 'APPROVED', '2026-02-11 16:45:00'),
(7, 2, 8, 2, 'Battery drains rapidly with Bluetooth calling', 'Calling quality is clear but battery drops 40% in a single day when continuous Bluetooth connection is turned on.', 'APPROVED', '2026-02-15 19:10:00'),
(8, 2, 10, 3, 'Average companion app features', 'Hardware is decent but the NoiseFit companion Android app takes time to sync workouts.', 'APPROVED', '2026-02-17 12:00:00'),
(9, 3, 6, 5, 'Authentic Sanganeri Print, 100% Pure Cotton', 'Colors did not fade after first machine wash. Fabric is soft, breathable, and properly fits our 6x6.5 ft king mattress.', 'APPROVED', '2026-02-12 18:00:00'),
(10, 3, 7, 5, 'Excellent traditional look for guest bedroom', 'Bright colors and high quality stitching on edges. Must buy for festive decoration.', 'APPROVED', '2026-02-16 15:20:00'),
(11, 5, 9, 4, 'Firm grip and good cushioning for knees', 'Does not slip on vitrified tiles during Surya Namaskar. 6mm thickness protects knees well.', 'APPROVED', '2026-02-13 07:45:00'),
(12, 5, 10, 2, 'Slight plastic odor initially', 'The grip is good but had a strong chemical smell out of the box. Had to air dry for 3 days before using.', 'APPROVED', '2026-02-16 09:15:00'),
(13, 5, 5, 5, 'Value for money gym mat', 'Carrying strap makes it very easy to take to park in the morning. Good durability.', 'PENDING', '2026-02-19 14:00:00'),
(14, 10, 11, 5, 'Good', 'Good sound quality and impressive battery life for daily work calls.', 'APPROVED', '2026-11-19 15:15:49'),
(15, 11, 15, 1, 'Not Good', 'Build quality did not meet expectations, rubber finish had scuffs.', 'APPROVED', '2026-11-19 15:20:28')
ON DUPLICATE KEY UPDATE rating = VALUES(rating), title = VALUES(title), comment = VALUES(comment), moderation_status = VALUES(moderation_status);
