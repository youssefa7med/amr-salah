-- First fix the column names to camelCase
ALTER TABLE services RENAME COLUMN namear TO "nameAr";
ALTER TABLE services RENAME COLUMN nameen TO "nameEn";

-- Clear existing services and variants
DELETE FROM service_variants;
DELETE FROM services;

-- Insert new services with complete data
INSERT INTO services (id, "nameAr", "nameEn", price, duration, category, active, "createdAt", "updatedAt") VALUES
-- Category: haircut
('11111111-1111-1111-1111-111111111111'::uuid, 'قص شعر', 'Haircut', 50, 20, 'haircut', true, NOW(), NOW()),
('11111111-1111-1111-1111-111111111112'::uuid, 'حلاقة لحية', 'Beard Trim', 30, 15, 'beard', true, NOW(), NOW()),
('11111111-1111-1111-1111-111111111113'::uuid, 'عناية بالبشرة', 'Skincare', 80, 30, 'skincare', true, NOW(), NOW()),
('11111111-1111-1111-1111-111111111114'::uuid, 'حلاقة أطفال', 'Kids Haircut', 40, 15, 'kids', true, NOW(), NOW()),
('11111111-1111-1111-1111-111111111115'::uuid, 'باقة كاملة', 'Full Package', 150, 60, 'packages', true, NOW(), NOW());

-- Insert variants for "قص شعر" (Haircut)
INSERT INTO service_variants (id, "serviceId", "nameAr", "nameEn", price, duration, "isActive", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111'::uuid, 'قص عادي', 'Regular Cut', 50, 20, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111'::uuid, 'قص فاخر', 'Premium Cut', 75, 25, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111'::uuid, 'قص + غسيل', 'Cut + Wash', 65, 25, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111111'::uuid, 'قص + تصفيف', 'Cut + Style', 85, 30, true, NOW(), NOW());

-- Insert variants for "حلاقة لحية" (Beard Trim)
INSERT INTO service_variants (id, "serviceId", "nameAr", "nameEn", price, duration, "isActive", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111112'::uuid, 'حلاقة عادية', 'Regular Trim', 30, 15, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111112'::uuid, 'حلاقة + ترتيب', 'Trim + Shape', 45, 20, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111112'::uuid, 'علاج لحية', 'Beard Treatment', 60, 25, true, NOW(), NOW());

-- Insert variants for "عناية بالبشرة" (Skincare)
INSERT INTO service_variants (id, "serviceId", "nameAr", "nameEn", price, duration, "isActive", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111113'::uuid, 'تقشير بسيط', 'Basic Exfoliation', 80, 30, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111113'::uuid, 'قناع من الطين', 'Clay Mask', 100, 35, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111113'::uuid, 'علاج شامل', 'Full Treatment', 150, 45, true, NOW(), NOW());

-- Insert variants for "حلاقة أطفال" (Kids Haircut)
INSERT INTO service_variants (id, "serviceId", "nameAr", "nameEn", price, duration, "isActive", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111114'::uuid, 'قص بسيط', 'Simple Cut', 40, 15, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111114'::uuid, 'قص مع ديزاين', 'Cut with Design', 60, 20, true, NOW(), NOW());

-- Insert variants for "باقة كاملة" (Full Package)
INSERT INTO service_variants (id, "serviceId", "nameAr", "nameEn", price, duration, "isActive", "createdAt", "updatedAt") VALUES
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111115'::uuid, 'قص + لحية', 'Haircut + Beard', 75, 40, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111115'::uuid, 'قص + لحية + عناية', 'Haircut + Beard + Care', 150, 60, true, NOW(), NOW()),
(uuid_generate_v4(), '11111111-1111-1111-1111-111111111115'::uuid, 'الباقة الملكية', 'Royal Package', 200, 90, true, NOW(), NOW());

-- Verify the data
SELECT 'Services count:' as info, COUNT(*) FROM services;
SELECT 'Variants count:' as info, COUNT(*) FROM service_variants;
