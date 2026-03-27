-- ============================================================
-- Kavyabhakti Medical Store - Seed Data
-- Run after schema.sql
-- ============================================================

USE kavyabhakti_medical;

-- ============================================================
-- MEDICINES SEED DATA
-- ============================================================
INSERT INTO medicines (id, name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available) VALUES
-- BP Medicines (category_id=1)
(1,  'Amlodipine',          'Pfizer',                    'Used to treat high blood pressure.',          1, 'index_images/bp.jpg',          30,  40,  5, 100, '2026-06-15', 'Shelf A1', 1),
(2,  'Losartan',             'Cipla',                     'For hypertension treatment.',                 1, 'index_images/bp.jpg',          50,  70,  5,  80, '2026-01-25', 'Drawer B1', 1),
(3,  'Metoprolol',           'Abbott',                    'Beta blocker for BP.',                        1, 'index_images/bp.jpg',          80, 110,  5,  60, '2026-05-30', 'Drawer B2', 1),
(4,  'Lisinopril',           'Pfizer Inc.',               'ACE inhibitor for hypertension.',             1, 'index_images/bp.jpg',          35,  50,  5,  90, '2026-04-15', 'Drawer A1', 1),
(5,  'Amlodipine Besylate',  'Mylan',                     'Calcium channel blocker for hypertension.',   1, 'index_images/bp.jpg',          28,  40,  5, 100, '2026-02-28', 'Rack A3',   1),
(6,  'Hydrochlorothiazide',  'Teva',                      'Thiazide diuretic for blood pressure.',       1, 'index_images/bp.jpg',          20,  30,  5, 120, '2026-03-18', 'Rack C1',   1),
-- Heart Medicines (category_id=2)
(7,  'Aspirin',              'Bayer',                     'Antiplatelet for heart protection.',          2, 'index_images/heart.jpg',       15,  25,  5, 150, '2026-03-20', 'Shelf A2',  1),
(8,  'Atorvastatin',         'Dr. Reddy''s',              'Cholesterol medicine.',                       2, 'index_images/heart.jpg',       85, 120,  5,  70, '2026-07-20', 'Drawer A2', 1),
(9,  'Clopidogrel',          'Sun Pharma',                'Blood thinner.',                              2, 'index_images/heart.jpg',      150, 200,  5,  50, '2026-06-25', 'Drawer C3', 1),
(10, 'Metoprolol Beta',      'AstraZeneca plc',           'Beta blocker for heart conditions.',          2, 'index_images/heart.jpg',      110, 150,  5,  60, '2026-05-30', 'Drawer B2', 1),
(11, 'Spironolactone',       'Pfizer Inc.',               'Potassium-sparing diuretic.',                 2, 'index_images/heart.jpg',       80, 110,  5,  65, '2026-09-25', 'Rack B2',   1),
(12, 'Furosemide',           'Sanofi S.A.',               'Loop diuretic for fluid retention.',          2, 'index_images/heart.jpg',       30,  45,  5,  95, '2026-12-12', 'Rack B3',   1),
-- Diabetes Medicines (category_id=3)
(13, 'Metformin',            'Sun Pharma',                'Oral diabetes medicine.',                     3, 'index_images/diabities.jpg',   45,  60,  5,  80, '2026-09-10', 'Shelf A3',  1),
(14, 'Glipizide',            'Abbott',                    'For type 2 diabetes.',                        3, 'index_images/diabities.jpg',   80, 110,  5,  60, '2026-08-15', 'Drawer B3', 0),
(15, 'Janumet',              'Merck',                     'Diabetes combination drug.',                  3, 'index_images/diabities.jpg',  180, 250,  5,  40, '2026-09-10', 'Shelf A3',  1),
(16, 'Gliclazide',           'Novo Nordisk A/S',          'Sulfonylurea for type 2 diabetes.',           3, 'index_images/diabities.jpg',   45,  65,  5,  85, '2026-08-15', 'Drawer B3', 1),
(17, 'Metformin XR',         'Sun Pharma',                'Extended release diabetes medication.',       3, 'index_images/diabities.jpg',   55,  80,  5,  75, '2026-02-18', 'Drawer C2', 1),
(18, 'Glibenclamide',        'Sun Pharma',                'Sulfonylurea for diabetes.',                  3, 'index_images/diabities.jpg',   35,  50,  5,  85, '2026-06-18', 'Rack B1',   1),
-- Pain Relief (category_id=4)
(19, 'Ibuprofen',            'Advil',                     'NSAID for pain and inflammation.',            4, 'index_images/pain.jpg',        25,  40,  5, 200, '2026-10-28', 'Shelf C1',  1),
(20, 'Acetaminophen',        'Tylenol',                   'Pain reliever and fever reducer.',            4, 'index_images/pain.jpg',        18,  30,  5, 180, '2026-03-20', 'Shelf A2',  1),
(21, 'Naproxen',             'Alkem',                     'Anti-inflammatory pain reliever.',            4, 'index_images/pain.jpg',        35,  55,  5,  90, '2026-05-22', 'Shelf C3',  0),
(22, 'Omeprazole',           'AbbVie Inc.',               'Proton pump inhibitor for acid reflux.',      4, 'index_images/pain.jpg',        50,  70,  5, 100, '2026-10-10', 'Drawer A3', 1),
(23, 'Paracetamol',          'GSK',                       'Fever reducer and pain reliever.',            4, 'index_images/pain.jpg',         8,  15,  5, 500, '2026-01-08', 'Shelf C2',  1),
(24, 'Cetirizine',           'Pfizer Inc.',               'Antihistamine for allergies.',                4, 'index_images/pain.jpg',        15,  25,  5, 180, '2026-08-08', 'Rack A1',   1),
(25, 'Pantoprazole',         'Takeda',                    'Proton pump inhibitor.',                      4, 'index_images/pain.jpg',        55,  75,  5,  80, '2026-07-28', 'Rack C2',   1),
(26, 'Montelukast',          'Merck',                     'Leukotriene receptor antagonist.',            4, 'index_images/pain.jpg',       130, 180,  5,  55, '2026-10-18', 'Rack C3',   1),
-- Antibiotics (category_id=5)
(27, 'Amoxicillin',          'Dr. Reddy''s',              'Penicillin antibiotic.',                      5, 'index_images/Antibiotics.jpg', 55,  75,  5,  70, '2026-03-28', 'Shelf A2',  1),
(28, 'Azithromycin',         'Cipla',                     'Macrolide antibiotic.',                       5, 'index_images/Antibiotics.jpg', 60,  85,  5,  70, '2025-12-10', 'Shelf A1',  0),
(29, 'Ciprofloxacin',        'Bayer',                     'Fluoroquinolone antibiotic.',                 5, 'index_images/Antibiotics.jpg', 80, 120,  5,  60, '2026-03-28', 'Shelf A2',  1),
(30, 'Doxycycline',          'Pfizer Inc.',               'Tetracycline antibiotic.',                    5, 'index_images/Antibiotics.jpg', 55,  75,  5,  80, '2026-09-12', 'Shelf A3',  1),
-- Nutraceuticals (category_id=6)
(31, 'Vitamin D',            'Nature Made',               'Essential vitamin supplement.',               6, 'index_images/Nutraceuticals.jpg', 90, 120, 5, 100, '2026-12-05', 'Shelf B1', 1),
(32, 'Omega-3',              'GSK',                       'Fish oil supplements.',                       6, 'index_images/Nutraceuticals.jpg',250, 350, 5,  40, '2026-07-15', 'Shelf B3', 0),
(33, 'Multivitamin',         'Himalaya',                  'Daily vitamin supplement.',                   6, 'index_images/Nutraceuticals.jpg',150, 200, 5,  80, '2026-04-20', 'Shelf B2', 1),
(34, 'Vitamin D3',           'Novartis AG',               'Essential vitamin supplement.',               6, 'index_images/Nutraceuticals.jpg', 40,  55, 5, 120, '2026-12-05', 'Shelf B1', 1),
(35, 'Calcium Carbonate',    'GSK',                       'Calcium supplement for bone health.',         6, 'index_images/Nutraceuticals.jpg', 30,  40, 5, 150, '2026-04-20', 'Shelf B2', 1),
(36, 'Omega-3 Fish Oil',     'Nordic Naturals',           'Heart healthy omega-3 supplement.',           6, 'index_images/Nutraceuticals.jpg',180, 250, 5,  40, '2026-07-15', 'Shelf B3', 1);

-- Antidiabetic (category_id=7)
INSERT INTO medicines (name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available) VALUES
('Acetocillin',   'Roche Holding AG',                    'Virus',      7, 'index_images/Medical.jpg', 150, 200, 5,  50, '2026-04-22', 'Shelf B1',   1),
('Dextrocillin',  'Sanofi S.A.',                         'Pain',       7, 'index_images/Medical.jpg', 130, 175, 5,  50, '2026-10-25', 'Drawer B2',  1),
('Clariphen',     'GlaxoSmithKline plc',                 'Fungus',     7, 'index_images/Medical.jpg', 170, 230, 5,  35, '2026-03-15', 'Drawer C2',  1),
('Dolomet',       'Amgen Inc.',                          'Diabetes',   7, 'index_images/Medical.jpg', 185, 250, 5,  30, '2025-12-20', 'Shelf A1',   1),
('Claricillin',   'Novo Nordisk A/S',                    'Virus',      7, 'index_images/Medical.jpg', 140, 190, 5,  45, '2026-10-28', 'Shelf A3',   1),
('Cefphen',       'Bristol-Myers Squibb Company',        'Fungus',     7, 'index_images/Medical.jpg', 155, 210, 5,  40, '2026-03-15', 'Drawer C2',  1),
('Metophen',      'Merck & Co., Inc.',                   'Diabetes',   7, 'index_images/Medical.jpg', 145, 195, 5,  50, '2026-07-08', 'Shelf B3',   1),
('Cefcillin',     'Roche Holding AG',                    'Pain',       7, 'index_images/Medical.jpg', 155, 210, 5,  40, '2026-01-08', 'Rack A3',    1),
('Amoximet',      'Johnson & Johnson',                   'Pain',       7, 'index_images/Medical.jpg', 140, 190, 5,  45, '2026-11-28', 'Shelf B1',   1),
('Amoxivir',      'Novartis AG',                         'Virus',      7, 'index_images/Medical.jpg', 170, 230, 5,  35, '2026-02-08', 'Shelf B2',   1),
('Cefmet',        'Sanofi S.A.',                         'Diabetes',   7, 'index_images/Medical.jpg', 180, 245, 5,  30, '2026-12-22', 'Shelf C2',   1),
('Cefnazole',     'CSL Limited',                         'Diabetes',   7, 'index_images/Medical.jpg', 160, 215, 5,  40, '2026-03-12', 'Shelf C3',   1),
('Clarimet',      'AstraZeneca plc',                     'Diabetes',   7, 'index_images/Medical.jpg', 175, 240, 5,  35, '2026-12-18', 'Drawer C1',  1),
('Amoximycin',    'Roche Holding AG',                    'Fungus',     7, 'index_images/Medical.jpg', 145, 195, 5,  50, '2026-07-18', 'Rack C3',    1),
('Dolovir',       'AbbVie Inc.',                         'Infection',  7, 'index_images/Medical.jpg', 130, 175, 5,  55, '2026-09-08', 'Drawer B3',  1),
('Amoxistatin',   'AstraZeneca plc',                     'Infection',  7, 'index_images/Medical.jpg', 130, 175, 5,  55, '2026-05-10', 'Drawer B1',  1),
('Doloprofen',    'Gilead Sciences, Inc.',               'Diabetes',   7, 'index_images/Medical.jpg', 160, 220, 5,  40, '2026-07-28', 'Drawer A1',  1);

-- Antiviral (category_id=8)
INSERT INTO medicines (name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available) VALUES
('Ibuprocillin',  'CSL Limited',                         'Infection',  8, 'index_images/Medical.jpg', 120, 165, 5,  45, '2026-05-18', 'Shelf B2',   1),
('Metovir',       'Takeda Pharmaceutical Company Limited','Infection', 8, 'index_images/Medical.jpg',  95, 130, 5,  65, '2026-10-05', 'Rack A1',    1),
('Amoxiprofen',   'Novo Nordisk A/S',                    'Diabetes',   8, 'index_images/Medical.jpg', 165, 225, 5,  35, '2026-02-28', 'Drawer A2',  1),
('Acetomycin',    'Roche Holding AG',                    'Virus',      8, 'index_images/Medical.jpg', 140, 190, 5,  55, '2026-08-14', 'Drawer A3',  1),
('Amoxistatin',   'Sanofi S.A.',                         'Fever',      8, 'index_images/Medical.jpg', 125, 170, 5,  65, '2026-05-10', 'Drawer B1',  1),
('Dolocillin',    'Novo Nordisk A/S',                    'Diabetes',   8, 'index_images/Medical.jpg', 175, 240, 5,  30, '2025-11-25', 'Rack C1',    1),
('Acetomet',      'GlaxoSmithKline plc',                 'Pain',       8, 'index_images/Medical.jpg', 140, 190, 5,  50, '2026-02-12', 'Drawer C2',  1),
('Dextromet',     'AstraZeneca plc',                     'Fever',      8, 'index_images/Medical.jpg', 125, 170, 5,  50, '2026-01-28', 'Rack B1',    1),
('Cefstatin',     'CSL Limited',                         'Fungus',     8, 'index_images/Medical.jpg', 145, 195, 5,  50, '2026-09-22', 'Rack C2',    1),
('Acetocillin',   'GlaxoSmithKline plc',                 'Virus',      8, 'index_images/Medical.jpg', 140, 190, 5,  55, '2026-11-28', 'Rack C3',    1);

-- Antibiotic (category_id=9)
INSERT INTO medicines (name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available) VALUES
('Dextrophen',    'Johnson & Johnson',                   'Wound',      9, 'index_images/Medical.jpg', 100, 140, 5,  60, '2026-07-25', 'Shelf B3',   1),
('Ibupromycin',   'Takeda Pharmaceutical Company Limited','Infection', 9, 'index_images/Medical.jpg', 130, 175, 5,  50, '2026-06-28', 'Drawer B3',  1),
('Dolophen',      'Johnson & Johnson',                   'Depression', 9, 'index_images/Medical.jpg', 115, 160, 5,  50, '2026-07-22', 'Rack C3',    1),
('Doloprofen',    'Eli Lilly and Company',               'Fungus',     9, 'index_images/Medical.jpg', 155, 210, 5,  45, '2026-11-12', 'Shelf B2',   1),
('Metocillin',    'Amgen Inc.',                          'Depression', 9, 'index_images/Medical.jpg', 120, 165, 5,  50, '2026-04-25', 'Rack B3',    1),
('Clarimycin',    'Biogen Inc.',                         'Pain',       9, 'index_images/Medical.jpg', 110, 150, 5,  55, '2026-02-25', 'Rack C3',    1),
('Claricillin',   'Novo Nordisk A/S',                    'Virus',      9, 'index_images/Medical.jpg', 125, 170, 5,  55, '2026-06-22', 'Drawer B3',  1),
('Metoprofen',    'Johnson & Johnson',                   'Wound',      9, 'index_images/Medical.jpg', 115, 155, 5,  60, '2026-01-25', 'Rack C1',    1),
('Metomycin',     'Roche Holding AG',                    'Pain',       9, 'index_images/Medical.jpg', 115, 155, 5,  55, '2026-07-15', 'Drawer C2',  1),
('Cefprofen',     'Novo Nordisk A/S',                    'Wound',      9, 'index_images/Medical.jpg', 125, 170, 5,  55, '2026-10-05', 'Shelf A1',   1);

-- Antifungal (category_id=10)
INSERT INTO medicines (name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available) VALUES
('Clarinazole',   'AbbVie Inc.',                         'Pain',      10, 'index_images/Medical.jpg', 130, 180, 5,  40, '2026-08-12', 'Shelf C1',   1),
('Ibuprocillin',  'AbbVie Inc.',                         'Wound',     10, 'index_images/Medical.jpg', 125, 170, 5,  45, '2026-03-28', 'Rack B2',    1),
('Cefmet',        'AstraZeneca plc',                     'Depression',10, 'index_images/Medical.jpg', 145, 195, 5,  55, '2026-04-18', 'Rack C2',    1),
('Ibupronazole',  'Novartis AG',                         'Fungus',    10, 'index_images/Medical.jpg', 135, 185, 5,  40, '2026-09-05', 'Drawer A1',  1),
('Metovir',       'Merck & Co., Inc.',                   'Diabetes',  10, 'index_images/Medical.jpg', 155, 210, 5,  45, '2026-01-18', 'Drawer B3',  1),
('Clariprofen',   'Pfizer Inc.',                         'Infection', 10, 'index_images/Medical.jpg', 120, 165, 5,  55, '2026-02-05', 'Shelf B3',   1),
('Acetophen',     'Merck & Co., Inc.',                   'Virus',     10, 'index_images/Medical.jpg',  90, 125, 5,  60, '2026-04-18', 'Rack C3',    1),
('Dextrostatin',  'Merck & Co., Inc.',                   'Wound',     10, 'index_images/Medical.jpg', 125, 170, 5,  50, '2026-01-22', 'Drawer C2',  1),
('Metomycin',     'Pfizer Inc.',                         'Wound',     10, 'index_images/Medical.jpg', 125, 170, 5,  55, '2026-01-30', 'Rack A1',    1),
('Acetomycin',    'Bayer AG',                            'Virus',     10, 'index_images/Medical.jpg', 135, 185, 5,  45, '2026-03-22', 'Rack A2',    1);

-- Antipyretic (category_id=11)
INSERT INTO medicines (name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available) VALUES
('Metovir',       'Takeda Pharmaceutical Company Limited','Infection',11, 'index_images/Medical.jpg',  95, 130, 5,  65, '2026-10-05', 'Rack A1',    1),
('Cefcillin',     'Takeda Pharmaceutical Company Limited','Fungus',   11, 'index_images/Medical.jpg', 140, 190, 5,  50, '2026-01-08', 'Rack A3',    1),
('Acetonazole',   'Bayer AG',                            'Wound',     11, 'index_images/Medical.jpg', 105, 145, 5,  60, '2026-06-30', 'Rack B3',    1),
('Cefstatin',     'Roche Holding AG',                    'Fever',     11, 'index_images/Medical.jpg', 115, 155, 5,  50, '2026-12-28', 'Shelf C3',   1),
('Dextromycin',   'Takeda Pharmaceutical Company Limited','Wound',    11, 'index_images/Medical.jpg', 110, 150, 5,  50, '2026-09-28', 'Rack C2',    1),
('Metostatin',    'CSL Limited',                         'Pain',      11, 'index_images/Medical.jpg', 110, 150, 5,  55, '2026-03-25', 'Shelf C3',   1),
('Clariphen',     'Takeda Pharmaceutical Company Limited','Pain',     11, 'index_images/Medical.jpg', 110, 150, 5,  55, '2025-12-08', 'Shelf A2',   1);

-- Antidepressant (category_id=12)
INSERT INTO medicines (name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available) VALUES
('Ibuprovir',     'Eli Lilly and Company',               'Fungus',    12, 'index_images/Medical.jpg', 160, 220, 5,  35, '2026-11-20', 'Rack A2',    1),
('Cefmet',        'Boehringer Ingelheim GmbH',           'Fever',     12, 'index_images/Medical.jpg', 165, 225, 5,  40, '2026-09-18', 'Shelf B1',   1),
('Acetonazole',   'Takeda Pharmaceutical Company Limited','Pain',     12, 'index_images/Medical.jpg', 170, 230, 5,  35, '2026-11-05', 'Rack C3',    1),
('Clariprofen',   'Boehringer Ingelheim GmbH',           'Infection', 12, 'index_images/Medical.jpg', 160, 215, 5,  40, '2026-10-18', 'Rack C2',    1),
('Clariphen',     'AbbVie Inc.',                         'Depression',12, 'index_images/Medical.jpg', 165, 225, 5,  40, '2026-08-30', 'Shelf C1',   1),
('Dolomet',       'Johnson & Johnson',                   'Infection', 12, 'index_images/Medical.jpg', 150, 205, 5,  45, '2026-05-25', 'Drawer C3',  1),
('Ibuprophen',    'AbbVie Inc.',                         'Depression',12, 'index_images/Medical.jpg', 150, 205, 5,  45, '2025-12-15', 'Drawer B3',  1),
('Claristatin',   'Novo Nordisk A/S',                    'Diabetes',  12, 'index_images/Medical.jpg', 180, 245, 5,  30, '2026-01-12', 'Shelf B3',   1);

-- Analgesic (category_id=13)
INSERT INTO medicines (name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available) VALUES
('Acetomycin',    'Novo Nordisk A/S',                    'Wound',     13, 'index_images/Medical.jpg',  85, 120, 5,  75, '2026-12-15', 'Rack B1',    1),
('Amoximet',      'Gilead Sciences, Inc.',               'Pain',      13, 'index_images/Medical.jpg', 100, 135, 5,  65, '2026-07-30', 'Shelf A3',   1),
('Metocillin',    'Eli Lilly and Company',               'Pain',      13, 'index_images/Medical.jpg',  95, 130, 5,  60, '2026-08-25', 'Shelf C1',   1),
('Ibupromycin',   'Roche Holding AG',                    'Diabetes',  13, 'index_images/Medical.jpg', 110, 150, 5,  55, '2026-05-18', 'Rack B2',    1),
('Clarivir',      'Bristol-Myers Squibb Company',        'Pain',      13, 'index_images/Medical.jpg',  90, 125, 5,  60, '2026-06-18', 'Rack B1',    1),
('Ibuproprofen',  'CSL Limited',                         'Pain',      13, 'index_images/Medical.jpg',  85, 115, 5,  65, '2025-11-08', 'Rack B2',    1),
('Cefprofen',     'Novartis AG',                         'Pain',      13, 'index_images/Medical.jpg', 100, 140, 5,  55, '2026-07-12', 'Rack C1',    1),
('Dextrophen',    'Merck & Co., Inc.',                   'Wound',     13, 'index_images/Medical.jpg', 100, 135, 5,  60, '2026-09-15', 'Rack A2',    1),
('Amoxinazole',   'Pfizer Inc.',                         'Depression',13, 'index_images/Medical.jpg', 110, 150, 5,  55, '2026-11-22', 'Rack A3',    1),
('Clarimycin',    'Biogen Inc.',                         'Pain',      13, 'index_images/Medical.jpg',  90, 125, 5,  60, '2026-02-25', 'Rack C3',    1);

-- Antiseptic (category_id=14)
INSERT INTO medicines (name, brand, description, category_id, image_path, purchase_price, selling_price, gst_percent, stock, expiry_date, location, is_available) VALUES
('Metoprofen',    'Novartis AG',                         'Wound',     14, 'index_images/Medical.jpg',  80, 110, 5,  70, '2026-10-08', 'Rack A3',    1),
('Dolomet',       'Novo Nordisk A/S',                    'Diabetes',  14, 'index_images/Medical.jpg', 100, 140, 5,  55, '2026-04-30', 'Drawer C3',  1),
('Metophen',      'AstraZeneca plc',                     'Virus',     14, 'index_images/Medical.jpg',  95, 130, 5,  60, '2026-07-18', 'Shelf A1',   1),
('Dextronazole',  'Boehringer Ingelheim GmbH',           'Diabetes',  14, 'index_images/Medical.jpg', 110, 150, 5,  55, '2026-08-05', 'Rack B3',    1),
('Ibuprovir',     'Teva Pharmaceutical Industries Ltd.', 'Fever',     14, 'index_images/Medical.jpg',  85, 115, 5,  65, '2026-11-28', 'Drawer A3',  1),
('Dolonazole',    'Gilead Sciences, Inc.',               'Virus',     14, 'index_images/Medical.jpg', 100, 135, 5,  60, '2026-06-18', 'Drawer B2',  1);

-- ============================================================
-- CUSTOMERS SEED DATA
-- ============================================================
INSERT INTO customers (name, phone, address) VALUES
('John Doe',            '1234567890', '123 Main St, New York, NY'),
('Jane Smith',          '0987654321', '456 Oak Ave, Los Angeles, CA'),
('Michael Johnson',     '5551234567', '789 Pine Rd, Chicago, IL'),
('Emily Davis',         '5559876543', '321 Elm St, Houston, TX'),
('Robert Wilson',       '5554443322', '654 Maple Dr, Phoenix, AZ'),
('Sarah Martinez',      '5557778888', '987 Cedar Ln, Philadelphia, PA'),
('David Brown',         '5556669999', '147 Birch Ct, San Antonio, TX'),
('Lisa Anderson',       '5552223333', '258 Walnut Way, San Diego, CA'),
('James Taylor',        '5551112222', '369 Spruce St, Dallas, TX'),
('Jennifer Thomas',     '5554445555', '741 Ash Ave, San Jose, CA'),
('Christopher Garcia',  '5556667777', '852 Poplar Rd, Austin, TX'),
('Amanda Robinson',     '5558889999', '963 Hickory Dr, Jacksonville, FL'),
('William Lee',         '5551234123', '159 Oak Lane, Seattle, WA'),
('Sophia Martinez',     '5552345234', '753 Pine Ave, Denver, CO'),
('Oliver Brown',        '5553456345', '951 Maple Street, Boston, MA'),
('Emma Wilson',         '5554567456', '357 Elm Drive, Miami, FL'),
('Liam Anderson',       '5555678567', '159 Cedar Road, Portland, OR'),
('Olivia Taylor',       '5556789678', '753 Birch Lane, Atlanta, GA'),
('Noah Thomas',         '5557891789', '951 Walnut Way, Phoenix, AZ'),
('Ava Garcia',          '5558912891', '147 Spruce Ave, Chicago, IL');

-- ============================================================
-- MEDICINE REQUESTS SEED DATA
-- ============================================================
INSERT INTO medicine_requests (customer_name, phone, medicine_name, quantity, status) VALUES
('Bob Johnson',    '1112223333', 'Lisinopril',           1, 'Pending'),
('Alice Brown',    '4445556666', 'Clopidogrel',          2, 'Pending'),
('Charlie Wilson', '7778889999', 'Metoprolol',           3, 'Pending'),
('Diana Lee',      '2223334444', 'Atorvastatin',         2, 'Fulfilled'),
('Edward Kim',     '5556667777', 'Omeprazole',           1, 'Pending'),
('Fiona Chen',     '8889990000', 'Losartan',             2, 'Pending'),
('George Patel',   '1231231234', 'Gliclazide',           3, 'Pending'),
('Hannah White',   '4564564567', 'Amlodipine',           1, 'Fulfilled'),
('Ivan Rodriguez', '7897897890', 'Metformin',            2, 'Pending'),
('Julia Martinez', '3213213210', 'Aspirin',              4, 'Pending'),
('Kevin Thompson', '6546546543', 'Glipizide',            2, 'Pending'),
('Laura Garcia',   '9879879876', 'Bisoprolol',           1, 'Rejected'),
('Mark Anderson',  '1471471478', 'Captopril',            3, 'Pending'),
('Nancy Lopez',    '2582582589', 'Nifedipine',           2, 'Pending'),
('Paul Smith',     '3693693690', 'Hydrochlorothiazide',  1, 'Pending'),
('Quinn Davis',    '7417417412', 'Spironolactone',       2, 'Pending'),
('Rachel Miller',  '8528528523', 'Furosemide',           1, 'Fulfilled'),
('Steve Moore',    '9639639634', 'Levothyroxine',        3, 'Pending'),
('Tina Jackson',   '1591591595', 'Glibenclamide',        2, 'Pending'),
('Uma Harris',     '3573573576', 'Metformin XR',         1, 'Pending');

-- ============================================================
-- SAMPLE BILLS SEED DATA
-- ============================================================
INSERT INTO bills (bill_number, customer_name, customer_phone, payment_method, subtotal, discount, gst_amount, final_total, billing_date) VALUES
('BILL001', 'John Doe',        '1234567890', 'Cash', 200.00,  0.00, 10.00, 210.00, '2026-01-05'),
('BILL002', 'Jane Smith',      '0987654321', 'UPI',  350.00, 20.00, 16.50, 346.50, '2026-01-10'),
('BILL003', 'Michael Johnson', '5551234567', 'Card', 480.00,  0.00, 24.00, 504.00, '2026-01-15'),
('BILL004', 'Emily Davis',     '5559876543', 'Cash', 150.00, 10.00,  7.00, 147.00, '2026-02-03'),
('BILL005', 'Robert Wilson',   '5554443322', 'UPI',  620.00,  0.00, 31.00, 651.00, '2026-02-14'),
('BILL006', 'Sarah Martinez',  '5557778888', 'Cash', 280.00, 15.00, 13.25, 278.25, '2026-02-20'),
('BILL007', 'David Brown',     '5556669999', 'Card', 390.00,  0.00, 19.50, 409.50, '2026-03-01'),
('BILL008', 'Lisa Anderson',   '5552223333', 'Cash', 175.00,  5.00,  8.50, 178.50, '2026-03-08');

-- ============================================================
-- SAMPLE BILL ITEMS
-- ============================================================
INSERT INTO bill_items (bill_id, medicine_id, medicine_name, brand, quantity, unit_price, expiry_date, total_price) VALUES
(1, 1,  'Amlodipine',  'Pfizer',      2, 40.00,  '2026-06-15', 80.00),
(1, 7,  'Aspirin',     'Bayer',       4, 25.00,  '2026-03-20', 100.00),
(2, 13, 'Metformin',   'Sun Pharma',  3, 60.00,  '2026-09-10', 180.00),
(2, 8,  'Atorvastatin','Dr. Reddy''s',1, 120.00, '2026-07-20', 120.00),
(3, 27, 'Amoxicillin', 'Dr. Reddy''s',2, 75.00,  '2026-03-28', 150.00),
(3, 19, 'Ibuprofen',   'Advil',       6, 40.00,  '2026-10-28', 240.00),
(4, 23, 'Paracetamol', 'GSK',        10, 15.00,  '2026-01-08', 150.00),
(5, 9,  'Clopidogrel', 'Sun Pharma',  2, 200.00, '2026-06-25', 400.00),
(5, 31, 'Vitamin D',   'Nature Made', 2, 120.00, '2026-12-05', 240.00),
(6, 13, 'Metformin',   'Sun Pharma',  2, 60.00,  '2026-09-10', 120.00),
(6, 22, 'Omeprazole',  'AbbVie Inc.', 2, 70.00,  '2026-10-10', 140.00),
(7, 4,  'Lisinopril',  'Pfizer Inc.', 3, 50.00,  '2026-04-15', 150.00),
(7, 8,  'Atorvastatin','Dr. Reddy''s',2, 120.00, '2026-07-20', 240.00),
(8, 23, 'Paracetamol', 'GSK',         5, 15.00,  '2026-01-08', 75.00),
(8, 24, 'Cetirizine',  'Pfizer Inc.', 4, 25.00,  '2026-08-08', 100.00);
