/**
 * MongoDB Seed Script for Kavyabhakti Medical Store
 * Run: node database/seed_mongo.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../Backend/.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kavyabhakti_medical';

// Inline minimal models for seeding
const CategorySchema = new mongoose.Schema({ name: String, image_path: String }, { timestamps: true });
const AdminSchema = new mongoose.Schema({ username: String, password_hash: String }, { timestamps: true });
const MedicineSchema = new mongoose.Schema({
    name: String, brand: String, description: String,
    category_id: mongoose.Schema.Types.ObjectId,
    image_path: String, purchase_price: Number, selling_price: Number,
    gst_percent: Number, stock: Number, expiry_date: Date,
    location: String, is_available: Boolean
}, { timestamps: true });

const Category = mongoose.model('Category', CategorySchema);
const AdminUser = mongoose.model('AdminUser', AdminSchema);
const Medicine = mongoose.model('Medicine', MedicineSchema);

const categories = [
    { name: 'BP Medicines',       image_path: 'index_images/bp.jpg' },
    { name: 'Heart Medicines',    image_path: 'index_images/heart.jpg' },
    { name: 'Diabetes Medicines', image_path: 'index_images/diabities.jpg' },
    { name: 'Pain Relief',        image_path: 'index_images/pain.jpg' },
    { name: 'Antibiotics',        image_path: 'index_images/Antibiotics.jpg' },
    { name: 'Nutraceuticals',     image_path: 'index_images/Nutraceuticals.jpg' },
    { name: 'Antidiabetic',       image_path: 'index_images/Medical.jpg' },
    { name: 'Antiviral',          image_path: 'index_images/Medical.jpg' },
    { name: 'Antibiotic',         image_path: 'index_images/Medical.jpg' },
    { name: 'Antifungal',         image_path: 'index_images/Medical.jpg' },
    { name: 'Antipyretic',        image_path: 'index_images/Medical.jpg' },
    { name: 'Antidepressant',     image_path: 'index_images/Medical.jpg' },
    { name: 'Analgesic',          image_path: 'index_images/Medical.jpg' },
    { name: 'Antiseptic',         image_path: 'index_images/Medical.jpg' }
];

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await AdminUser.deleteMany({});
    await Medicine.deleteMany({});

    // Seed categories
    const insertedCategories = await Category.insertMany(categories);
    const catMap = {};
    insertedCategories.forEach(c => { catMap[c.name] = c._id; });
    console.log(`✅ Seeded ${insertedCategories.length} categories`);

    // Seed admin user (password: admin123)
    const hash = await bcrypt.hash('admin123', 10);
    await AdminUser.create({ username: 'admin', password_hash: hash });
    console.log('✅ Seeded admin user (username: admin, password: admin123)');

    // Seed medicines
    const medicines = [
        // ── BP Medicines ──────────────────────────────────────────
        { name: 'Amlodipine 5mg',        brand: 'Norvasc',      cat: 'BP Medicines',       pp: 20,  sp: 35,  stock: 100, expiry: '2026-12-01', loc: 'Shelf A1' },
        { name: 'Amlodipine 10mg',       brand: 'Amlopin',      cat: 'BP Medicines',       pp: 25,  sp: 42,  stock: 80,  expiry: '2026-11-01', loc: 'Shelf A1' },
        { name: 'Losartan 50mg',         brand: 'Cozaar',       cat: 'BP Medicines',       pp: 28,  sp: 48,  stock: 90,  expiry: '2027-01-01', loc: 'Shelf A2' },
        { name: 'Losartan 100mg',        brand: 'Repace',       cat: 'BP Medicines',       pp: 40,  sp: 65,  stock: 60,  expiry: '2027-02-01', loc: 'Shelf A2' },
        { name: 'Telmisartan 40mg',      brand: 'Telma',        cat: 'BP Medicines',       pp: 30,  sp: 52,  stock: 75,  expiry: '2026-09-01', loc: 'Shelf A3' },
        { name: 'Telmisartan 80mg',      brand: 'Telma-H',      cat: 'BP Medicines',       pp: 45,  sp: 75,  stock: 55,  expiry: '2026-10-01', loc: 'Shelf A3' },
        { name: 'Enalapril 5mg',         brand: 'Envas',        cat: 'BP Medicines',       pp: 18,  sp: 32,  stock: 70,  expiry: '2027-03-01', loc: 'Shelf A4' },
        { name: 'Ramipril 5mg',          brand: 'Cardace',      cat: 'BP Medicines',       pp: 35,  sp: 58,  stock: 65,  expiry: '2027-04-01', loc: 'Shelf A4' },
        { name: 'Metoprolol 25mg',       brand: 'Betaloc',      cat: 'BP Medicines',       pp: 22,  sp: 38,  stock: 85,  expiry: '2026-08-01', loc: 'Shelf A5' },
        { name: 'Metoprolol 50mg',       brand: 'Metolar',      cat: 'BP Medicines',       pp: 30,  sp: 50,  stock: 70,  expiry: '2026-07-01', loc: 'Shelf A5' },

        // ── Heart Medicines ───────────────────────────────────────
        { name: 'Atorvastatin 10mg',     brand: 'Lipitor',      cat: 'Heart Medicines',    pp: 30,  sp: 55,  stock: 60,  expiry: '2027-01-01', loc: 'Shelf B1' },
        { name: 'Atorvastatin 20mg',     brand: 'Storvas',      cat: 'Heart Medicines',    pp: 45,  sp: 78,  stock: 50,  expiry: '2027-02-01', loc: 'Shelf B1' },
        { name: 'Rosuvastatin 10mg',     brand: 'Crestor',      cat: 'Heart Medicines',    pp: 55,  sp: 90,  stock: 45,  expiry: '2027-03-01', loc: 'Shelf B2' },
        { name: 'Rosuvastatin 20mg',     brand: 'Rozavel',      cat: 'Heart Medicines',    pp: 70,  sp: 115, stock: 40,  expiry: '2027-04-01', loc: 'Shelf B2' },
        { name: 'Aspirin 75mg',          brand: 'Ecosprin',     cat: 'Heart Medicines',    pp: 8,   sp: 18,  stock: 200, expiry: '2027-06-01', loc: 'Shelf B3' },
        { name: 'Clopidogrel 75mg',      brand: 'Plavix',       cat: 'Heart Medicines',    pp: 40,  sp: 68,  stock: 55,  expiry: '2026-12-01', loc: 'Shelf B3' },
        { name: 'Digoxin 0.25mg',        brand: 'Lanoxin',      cat: 'Heart Medicines',    pp: 25,  sp: 42,  stock: 35,  expiry: '2026-10-01', loc: 'Shelf B4' },
        { name: 'Carvedilol 6.25mg',     brand: 'Carca',        cat: 'Heart Medicines',    pp: 38,  sp: 62,  stock: 48,  expiry: '2027-01-01', loc: 'Shelf B4' },
        { name: 'Isosorbide 5mg',        brand: 'Isoket',       cat: 'Heart Medicines',    pp: 20,  sp: 35,  stock: 60,  expiry: '2026-09-01', loc: 'Shelf B5' },
        { name: 'Furosemide 40mg',       brand: 'Lasix',        cat: 'Heart Medicines',    pp: 12,  sp: 22,  stock: 90,  expiry: '2027-05-01', loc: 'Shelf B5' },

        // ── Diabetes Medicines ────────────────────────────────────
        { name: 'Metformin 500mg',       brand: 'Glucophage',   cat: 'Diabetes Medicines', pp: 15,  sp: 28,  stock: 150, expiry: '2026-08-01', loc: 'Shelf C1' },
        { name: 'Metformin 1000mg',      brand: 'Glycomet',     cat: 'Diabetes Medicines', pp: 22,  sp: 38,  stock: 120, expiry: '2026-09-01', loc: 'Shelf C1' },
        { name: 'Glipizide 5mg',         brand: 'Glucotrol',    cat: 'Diabetes Medicines', pp: 18,  sp: 32,  stock: 80,  expiry: '2027-01-01', loc: 'Shelf C2' },
        { name: 'Sitagliptin 50mg',      brand: 'Januvia',      cat: 'Diabetes Medicines', pp: 120, sp: 195, stock: 40,  expiry: '2027-03-01', loc: 'Shelf C2' },
        { name: 'Sitagliptin 100mg',     brand: 'Janumet',      cat: 'Diabetes Medicines', pp: 150, sp: 240, stock: 35,  expiry: '2027-04-01', loc: 'Shelf C3' },
        { name: 'Insulin Glargine',      brand: 'Lantus',       cat: 'Diabetes Medicines', pp: 350, sp: 520, stock: 20,  expiry: '2026-06-01', loc: 'Shelf C3' },
        { name: 'Empagliflozin 10mg',    brand: 'Jardiance',    cat: 'Diabetes Medicines', pp: 180, sp: 280, stock: 30,  expiry: '2027-02-01', loc: 'Shelf C4' },
        { name: 'Vildagliptin 50mg',     brand: 'Galvus',       cat: 'Diabetes Medicines', pp: 95,  sp: 155, stock: 45,  expiry: '2027-01-01', loc: 'Shelf C4' },

        // ── Pain Relief ───────────────────────────────────────────
        { name: 'Paracetamol 500mg',     brand: 'Calpol',       cat: 'Pain Relief',        pp: 5,   sp: 12,  stock: 250, expiry: '2027-03-01', loc: 'Shelf D1' },
        { name: 'Paracetamol 650mg',     brand: 'Dolo 650',     cat: 'Pain Relief',        pp: 8,   sp: 18,  stock: 200, expiry: '2027-04-01', loc: 'Shelf D1' },
        { name: 'Ibuprofen 400mg',       brand: 'Brufen',       cat: 'Pain Relief',        pp: 10,  sp: 22,  stock: 150, expiry: '2027-02-01', loc: 'Shelf D2' },
        { name: 'Ibuprofen 600mg',       brand: 'Advil',        cat: 'Pain Relief',        pp: 15,  sp: 28,  stock: 120, expiry: '2027-01-01', loc: 'Shelf D2' },
        { name: 'Diclofenac 50mg',       brand: 'Voveran',      cat: 'Pain Relief',        pp: 12,  sp: 24,  stock: 100, expiry: '2026-11-01', loc: 'Shelf D3' },
        { name: 'Tramadol 50mg',         brand: 'Ultram',       cat: 'Pain Relief',        pp: 25,  sp: 45,  stock: 60,  expiry: '2026-10-01', loc: 'Shelf D3' },
        { name: 'Naproxen 250mg',        brand: 'Naprosyn',     cat: 'Pain Relief',        pp: 18,  sp: 32,  stock: 80,  expiry: '2027-05-01', loc: 'Shelf D4' },
        { name: 'Aceclofenac 100mg',     brand: 'Zerodol',      cat: 'Pain Relief',        pp: 14,  sp: 26,  stock: 110, expiry: '2027-03-01', loc: 'Shelf D4' },

        // ── Antibiotics ───────────────────────────────────────────
        { name: 'Amoxicillin 250mg',     brand: 'Amoxil',       cat: 'Antibiotics',        pp: 40,  sp: 70,  stock: 50,  expiry: '2026-06-01', loc: 'Shelf E1' },
        { name: 'Amoxicillin 500mg',     brand: 'Mox',          cat: 'Antibiotics',        pp: 55,  sp: 90,  stock: 45,  expiry: '2026-07-01', loc: 'Shelf E1' },
        { name: 'Azithromycin 250mg',    brand: 'Zithromax',    cat: 'Antibiotics',        pp: 60,  sp: 100, stock: 55,  expiry: '2026-09-01', loc: 'Shelf E2' },
        { name: 'Azithromycin 500mg',    brand: 'Azee',         cat: 'Antibiotics',        pp: 80,  sp: 130, stock: 40,  expiry: '2026-08-01', loc: 'Shelf E2' },
        { name: 'Ciprofloxacin 500mg',   brand: 'Cipro',        cat: 'Antibiotics',        pp: 35,  sp: 60,  stock: 70,  expiry: '2027-01-01', loc: 'Shelf E3' },
        { name: 'Doxycycline 100mg',     brand: 'Vibramycin',   cat: 'Antibiotics',        pp: 30,  sp: 52,  stock: 65,  expiry: '2026-12-01', loc: 'Shelf E3' },
        { name: 'Cefixime 200mg',        brand: 'Suprax',       cat: 'Antibiotics',        pp: 70,  sp: 115, stock: 35,  expiry: '2026-10-01', loc: 'Shelf E4' },
        { name: 'Metronidazole 400mg',   brand: 'Flagyl',       cat: 'Antibiotics',        pp: 15,  sp: 28,  stock: 90,  expiry: '2027-02-01', loc: 'Shelf E4' },

        // ── Nutraceuticals ────────────────────────────────────────
        { name: 'Vitamin D3 1000IU',     brand: 'D-Rise',       cat: 'Nutraceuticals',     pp: 60,  sp: 110, stock: 75,  expiry: '2027-06-01', loc: 'Shelf F1' },
        { name: 'Vitamin D3 60000IU',    brand: 'Calcirol',     cat: 'Nutraceuticals',     pp: 45,  sp: 80,  stock: 80,  expiry: '2027-08-01', loc: 'Shelf F1' },
        { name: 'Vitamin B12 500mcg',    brand: 'Methylcobal',  cat: 'Nutraceuticals',     pp: 55,  sp: 95,  stock: 70,  expiry: '2027-05-01', loc: 'Shelf F2' },
        { name: 'Vitamin C 500mg',       brand: 'Limcee',       cat: 'Nutraceuticals',     pp: 20,  sp: 38,  stock: 120, expiry: '2027-07-01', loc: 'Shelf F2' },
        { name: 'Omega-3 1000mg',        brand: 'Omacor',       cat: 'Nutraceuticals',     pp: 90,  sp: 150, stock: 50,  expiry: '2027-04-01', loc: 'Shelf F3' },
        { name: 'Calcium + D3',          brand: 'Shelcal',      cat: 'Nutraceuticals',     pp: 70,  sp: 120, stock: 65,  expiry: '2027-03-01', loc: 'Shelf F3' },
        { name: 'Iron + Folic Acid',     brand: 'Feronia XT',   cat: 'Nutraceuticals',     pp: 35,  sp: 62,  stock: 90,  expiry: '2027-02-01', loc: 'Shelf F4' },
        { name: 'Zinc 50mg',             brand: 'Zincovit',     cat: 'Nutraceuticals',     pp: 40,  sp: 72,  stock: 85,  expiry: '2027-01-01', loc: 'Shelf F4' },

        // ── Antidiabetic ──────────────────────────────────────────
        { name: 'Glimepiride 1mg',       brand: 'Amaryl',       cat: 'Antidiabetic',       pp: 35,  sp: 60,  stock: 90,  expiry: '2026-11-01', loc: 'Shelf G1' },
        { name: 'Glimepiride 2mg',       brand: 'Glimisave',    cat: 'Antidiabetic',       pp: 45,  sp: 75,  stock: 70,  expiry: '2026-12-01', loc: 'Shelf G1' },
        { name: 'Pioglitazone 15mg',     brand: 'Actos',        cat: 'Antidiabetic',       pp: 50,  sp: 85,  stock: 55,  expiry: '2027-01-01', loc: 'Shelf G2' },
        { name: 'Pioglitazone 30mg',     brand: 'Piozone',      cat: 'Antidiabetic',       pp: 65,  sp: 105, stock: 45,  expiry: '2027-02-01', loc: 'Shelf G2' },
        { name: 'Dapagliflozin 10mg',    brand: 'Forxiga',      cat: 'Antidiabetic',       pp: 160, sp: 255, stock: 30,  expiry: '2027-03-01', loc: 'Shelf G3' },
        { name: 'Canagliflozin 100mg',   brand: 'Invokana',     cat: 'Antidiabetic',       pp: 175, sp: 275, stock: 25,  expiry: '2027-04-01', loc: 'Shelf G3' },

        // ── Antiviral ─────────────────────────────────────────────
        { name: 'Acyclovir 400mg',       brand: 'Zovirax',      cat: 'Antiviral',          pp: 45,  sp: 78,  stock: 50,  expiry: '2026-10-01', loc: 'Shelf H1' },
        { name: 'Oseltamivir 75mg',      brand: 'Tamiflu',      cat: 'Antiviral',          pp: 120, sp: 195, stock: 30,  expiry: '2026-08-01', loc: 'Shelf H1' },
        { name: 'Valacyclovir 500mg',    brand: 'Valtrex',      cat: 'Antiviral',          pp: 90,  sp: 148, stock: 35,  expiry: '2027-01-01', loc: 'Shelf H2' },
        { name: 'Ribavirin 200mg',       brand: 'Rebetol',      cat: 'Antiviral',          pp: 200, sp: 320, stock: 15,  expiry: '2026-12-01', loc: 'Shelf H2' },
        { name: 'Tenofovir 300mg',       brand: 'Viread',       cat: 'Antiviral',          pp: 250, sp: 395, stock: 20,  expiry: '2027-02-01', loc: 'Shelf H3' },

        // ── Antibiotic ────────────────────────────────────────────
        { name: 'Levofloxacin 500mg',    brand: 'Levaquin',     cat: 'Antibiotic',         pp: 55,  sp: 92,  stock: 60,  expiry: '2027-01-01', loc: 'Shelf I1' },
        { name: 'Clarithromycin 250mg',  brand: 'Biaxin',       cat: 'Antibiotic',         pp: 75,  sp: 122, stock: 45,  expiry: '2026-11-01', loc: 'Shelf I1' },
        { name: 'Clindamycin 300mg',     brand: 'Cleocin',      cat: 'Antibiotic',         pp: 65,  sp: 108, stock: 40,  expiry: '2026-10-01', loc: 'Shelf I2' },
        { name: 'Cephalexin 500mg',      brand: 'Keflex',       cat: 'Antibiotic',         pp: 50,  sp: 85,  stock: 55,  expiry: '2027-02-01', loc: 'Shelf I2' },
        { name: 'Nitrofurantoin 100mg',  brand: 'Macrobid',     cat: 'Antibiotic',         pp: 40,  sp: 68,  stock: 50,  expiry: '2027-03-01', loc: 'Shelf I3' },

        // ── Antifungal ────────────────────────────────────────────
        { name: 'Fluconazole 150mg',     brand: 'Diflucan',     cat: 'Antifungal',         pp: 30,  sp: 52,  stock: 70,  expiry: '2027-01-01', loc: 'Shelf J1' },
        { name: 'Itraconazole 100mg',    brand: 'Sporanox',     cat: 'Antifungal',         pp: 55,  sp: 92,  stock: 50,  expiry: '2026-12-01', loc: 'Shelf J1' },
        { name: 'Terbinafine 250mg',     brand: 'Lamisil',      cat: 'Antifungal',         pp: 45,  sp: 78,  stock: 55,  expiry: '2027-02-01', loc: 'Shelf J2' },
        { name: 'Clotrimazole 1% Cream', brand: 'Canesten',     cat: 'Antifungal',         pp: 35,  sp: 60,  stock: 80,  expiry: '2027-04-01', loc: 'Shelf J2' },
        { name: 'Ketoconazole 200mg',    brand: 'Nizoral',      cat: 'Antifungal',         pp: 40,  sp: 68,  stock: 60,  expiry: '2027-03-01', loc: 'Shelf J3' },

        // ── Antipyretic ───────────────────────────────────────────
        { name: 'Paracetamol Syrup',     brand: 'Crocin',       cat: 'Antipyretic',        pp: 18,  sp: 32,  stock: 100, expiry: '2027-01-01', loc: 'Shelf K1' },
        { name: 'Nimesulide 100mg',      brand: 'Nise',         cat: 'Antipyretic',        pp: 12,  sp: 22,  stock: 120, expiry: '2026-11-01', loc: 'Shelf K1' },
        { name: 'Mefenamic Acid 250mg',  brand: 'Ponstan',      cat: 'Antipyretic',        pp: 15,  sp: 28,  stock: 90,  expiry: '2027-02-01', loc: 'Shelf K2' },
        { name: 'Ibuprofen Syrup',       brand: 'Calprofen',    cat: 'Antipyretic',        pp: 22,  sp: 40,  stock: 75,  expiry: '2027-03-01', loc: 'Shelf K2' },

        // ── Antidepressant ────────────────────────────────────────
        { name: 'Sertraline 50mg',       brand: 'Zoloft',       cat: 'Antidepressant',     pp: 55,  sp: 92,  stock: 45,  expiry: '2027-01-01', loc: 'Shelf L1' },
        { name: 'Fluoxetine 20mg',       brand: 'Prozac',       cat: 'Antidepressant',     pp: 40,  sp: 68,  stock: 50,  expiry: '2027-02-01', loc: 'Shelf L1' },
        { name: 'Escitalopram 10mg',     brand: 'Lexapro',      cat: 'Antidepressant',     pp: 65,  sp: 108, stock: 40,  expiry: '2027-03-01', loc: 'Shelf L2' },
        { name: 'Amitriptyline 25mg',    brand: 'Elavil',       cat: 'Antidepressant',     pp: 20,  sp: 36,  stock: 60,  expiry: '2026-12-01', loc: 'Shelf L2' },
        { name: 'Clonazepam 0.5mg',      brand: 'Klonopin',     cat: 'Antidepressant',     pp: 30,  sp: 52,  stock: 35,  expiry: '2026-10-01', loc: 'Shelf L3' },

        // ── Analgesic ─────────────────────────────────────────────
        { name: 'Morphine 10mg',         brand: 'MS Contin',    cat: 'Analgesic',          pp: 80,  sp: 130, stock: 20,  expiry: '2026-09-01', loc: 'Shelf M1' },
        { name: 'Codeine 30mg',          brand: 'Tylenol-C',    cat: 'Analgesic',          pp: 50,  sp: 85,  stock: 30,  expiry: '2026-11-01', loc: 'Shelf M1' },
        { name: 'Pregabalin 75mg',       brand: 'Lyrica',       cat: 'Analgesic',          pp: 90,  sp: 148, stock: 40,  expiry: '2027-01-01', loc: 'Shelf M2' },
        { name: 'Gabapentin 300mg',      brand: 'Neurontin',    cat: 'Analgesic',          pp: 45,  sp: 78,  stock: 55,  expiry: '2027-02-01', loc: 'Shelf M2' },
        { name: 'Tapentadol 50mg',       brand: 'Nucynta',      cat: 'Analgesic',          pp: 110, sp: 178, stock: 25,  expiry: '2026-12-01', loc: 'Shelf M3' },

        // ── Antiseptic ────────────────────────────────────────────
        { name: 'Povidone Iodine 5%',    brand: 'Betadine',     cat: 'Antiseptic',         pp: 25,  sp: 45,  stock: 80,  expiry: '2027-06-01', loc: 'Shelf N1' },
        { name: 'Chlorhexidine 0.2%',    brand: 'Savlon',       cat: 'Antiseptic',         pp: 30,  sp: 52,  stock: 70,  expiry: '2027-05-01', loc: 'Shelf N1' },
        { name: 'Hydrogen Peroxide 3%',  brand: 'H2O2 Solution',cat: 'Antiseptic',         pp: 15,  sp: 28,  stock: 90,  expiry: '2027-04-01', loc: 'Shelf N2' },
        { name: 'Dettol Antiseptic',     brand: 'Dettol',       cat: 'Antiseptic',         pp: 35,  sp: 60,  stock: 100, expiry: '2027-07-01', loc: 'Shelf N2' },
        { name: 'Silver Sulfadiazine',   brand: 'Silverex',     cat: 'Antiseptic',         pp: 55,  sp: 92,  stock: 45,  expiry: '2027-03-01', loc: 'Shelf N3' }
    ];

    const inserted = await Medicine.insertMany(medicines.map(({ cat, pp, sp, expiry, loc, ...m }) => ({
        ...m,
        category_id: catMap[cat],
        purchase_price: pp,
        selling_price: sp,
        expiry_date: new Date(expiry),
        location: loc,
        description: '',
        image_path: 'index_images/Medical.jpg',
        gst_percent: 5,
        is_available: true
    })));
    console.log(`✅ Seeded ${inserted.length} medicines`);

    await mongoose.disconnect();
    console.log('✅ Seeding complete. Disconnected.');
}

seed().catch(err => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
