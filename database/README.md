# Kavyabhakti Medical Store - Database Setup

## Files
- `schema.sql` — Creates the database, all tables, indexes, and default admin user
- `seed_data.sql` — Populates all tables with the medicine/order/billing data from the frontend

## Setup

```bash
# 1. Log into MySQL
mysql -u root -p

# 2. Run schema (creates DB + tables)
source /path/to/database/schema.sql

# 3. Run seed data
source /path/to/database/seed_data.sql
```

Or in one command:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p kavyabhakti_medical < database/seed_data.sql
```

## Database: `kavyabhakti_medical`

### Tables

| Table               | Description                                      |
|---------------------|--------------------------------------------------|
| `admin_users`       | Admin login credentials                          |
| `categories`        | Medicine categories (BP, Heart, Diabetes, etc.)  |
| `medicines`         | Full medicine inventory with pricing & stock     |
| `customers`         | Customer records                                 |
| `orders`            | Customer orders placed via the website           |
| `order_items`       | Line items for each order                        |
| `medicine_requests` | Requests for out-of-stock medicines              |
| `bills`             | Admin-generated bills (billing management)       |
| `bill_items`        | Line items for each bill                         |
| `contact_messages`  | Messages from the contact form                   |

## Default Admin Credentials
- Username: `admin`
- Password: `admin123`

> **Note:** Update the `password_hash` in `admin_users` with a proper bcrypt hash before deploying to production.
