# Database - MongoDB

This project uses **MongoDB** with Mongoose ODM.

## Models (Backend/models/)

| Model           | Collection       | Description                         |
| --------------- | ---------------- | ----------------------------------- |
| AdminUser       | adminusers       | Admin login credentials             |
| Category        | categories       | Medicine categories (14 total)      |
| Medicine        | medicines        | Inventory with stock & pricing      |
| Customer        | customers        | Customer info (upserted on order)   |
| Order           | orders           | Customer orders with embedded items |
| Bill            | bills            | Admin billing with embedded items   |
| MedicineRequest | medicinerequests | Out-of-stock requests               |
| ContactMessage  | contactmessages  | Contact form submissions            |

## Seed the Database

```bash
node database/seed_mongo.js
```

This creates:

- Admin user: `admin` / `admin123`
- 14 medicine categories
- 8 sample medicines

## Connection

Default URI: `mongodb://localhost:27017/kavyabhakti_medical`

Override with environment variable:

```bash
MONGO_URI=mongodb://your-host:27017/kavyabhakti_medical npm start
```
