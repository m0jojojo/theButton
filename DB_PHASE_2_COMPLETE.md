# ✅ DB Phase 2: Core Business Schema - COMPLETE

## What Was Created

### 1. ✅ Enums
- `UserRole` - customer, admin
- `OrderStatus` - pending, confirmed, processing, shipped, delivered, cancelled
- `PaymentMethod` - razorpay, cod
- `PaymentStatus` - pending, paid, failed
- `ReviewStatus` - approved, pending, rejected

### 2. ✅ User Model
- Fields: id, email (unique), phone, name, passwordHash, role, timestamps
- Relations: orders, reviews, reviewVotes, whatsappEvents
- Indexes: email, phone

### 3. ✅ Product Model
- Fields: id, name, price, compareAtPrice, description, images (JSON), sizes (JSON), inStock, sku (unique), collection, searchKeywords (JSON), timestamps
- Relations: orderItems, reviews
- Indexes: collection, sku, inStock
- Uses JSONB for flexible data (images array, sizes array, searchKeywords)

### 4. ✅ Order Model
- Fields: id, orderId (unique), userId (nullable), userEmail, status, paymentMethod, paymentStatus, subtotal, shipping, total, shippingAddress (JSON), timestamps
- Relations: user, items, whatsappEvents
- Indexes: userId, userEmail, orderId, status, createdAt
- Uses JSONB for shippingAddress

### 5. ✅ OrderItem Model
- Fields: id, orderId, productId, name, price, compareAtPrice, size, quantity, image, createdAt
- Relations: order, product
- Indexes: orderId, productId
- Cascade delete when order is deleted

### 6. ✅ Review Model
- Fields: id, productId, userId, userEmail, userName, rating (1-5), comment, verifiedPurchase, helpfulCount, status, timestamps
- Relations: product, user, votes
- Unique constraint: one review per product per user (by email)
- Indexes: productId, userId, status, createdAt

### 7. ✅ ReviewVote Model
- Fields: id, reviewId, userId, userEmail, helpful (boolean), createdAt
- Relations: review, user
- Unique constraint: one vote per review per user
- Indexes: reviewId, userId

### 8. ✅ WhatsAppEvent Model
- Fields: id, userId (nullable), userEmail (nullable), productId, productName, page, orderId, createdAt
- Relations: user, order
- Indexes: userId, userEmail, productId, orderId, createdAt
- Tracks WhatsApp clicks for analytics

## Schema Features

✅ **Proper Relations** - All foreign keys with cascade/restrict rules
✅ **Enums for Statuses** - Type-safe status fields
✅ **JSONB for Flexibility** - Images, sizes, addresses stored as JSON
✅ **Indexes for Performance** - Strategic indexes on frequently queried fields
✅ **Unique Constraints** - Prevent duplicate reviews/votes
✅ **Nullable Fields** - Support guest orders and anonymous events
✅ **Timestamps** - createdAt and updatedAt on all models
✅ **Snake Case Mapping** - Database columns use snake_case, Prisma uses camelCase

## Next Steps

### Step 1: Stop Dev Server
The Prisma client generation needs the server to be stopped:

```bash
# Stop the dev server (Ctrl+C in the server window)
# Or kill process on port 3000
```

### Step 2: Generate Prisma Client
```bash
npm run db:generate
```

### Step 3: Create Migration
```bash
npm run db:migrate
# Name: init_schema
```

This will:
- Create migration files
- Apply migration to database
- Create all tables

### Step 4: Verify Schema
```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555 - visual database browser

## Testing Checklist

After migration:
- [ ] All tables created in database
- [ ] Prisma Studio shows all models
- [ ] Can view schema in Supabase dashboard
- [ ] No migration errors

## Important Notes

⚠️ **No API logic changed yet** - This is schema only
⚠️ **Backward compatible** - Existing code still works (using in-memory stores)
⚠️ **Ready for Phase 3** - Migrations and data safety

---

## Suggested Commit Message

```
feat(db): create core business schema with Prisma models

- Add User, Product, Order, OrderItem models
- Add Review and ReviewVote models
- Add WhatsAppEvent model for tracking
- Use enums for statuses (OrderStatus, PaymentMethod, etc.)
- Use JSONB for flexible data (images, sizes, addresses)
- Add strategic indexes for performance
- Add proper relations with cascade rules

Phase 2: Core Business Schema - No API logic yet
```

