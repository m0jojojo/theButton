# Development Plan - Advanced Features

## Overview
This document outlines the phased development plan for implementing advanced features:
1. Product Search Functionality
2. User Accounts/Authentication
3. Order History
4. Product Reviews/Ratings
5. Wishlist Functionality
6. Email Notifications
7. Admin Dashboard

---

## Architecture Decisions

### Backend Strategy
**Option A: Next.js API Routes (Recommended for MVP)**
- Use Next.js API routes (`/app/api/*`) for backend logic
- Database: PostgreSQL or MongoDB (via Prisma/Mongoose)
- Authentication: NextAuth.js or custom JWT
- File Storage: Local filesystem or cloud storage (AWS S3, Cloudinary)

**Option B: Separate Backend (For Scale)**
- Express.js or Nest.js backend
- Separate database server
- RESTful API or GraphQL

**Decision: Start with Option A (Next.js API Routes) for faster development, can migrate to Option B later.**

### Database Schema (Key Tables)
```
Users
- id, email, password_hash, name, phone, created_at, updated_at

Orders
- id, user_id, order_id, status, total, shipping_address, created_at

OrderItems
- id, order_id, product_id, quantity, price, size

Reviews
- id, product_id, user_id, rating, comment, created_at

Wishlist
- id, user_id, product_id, created_at

Products (extend existing)
- Add: search_keywords, review_count, average_rating
```

---

## Phase Breakdown

### **Phase 8: Product Search Functionality**
**Priority: High | Dependencies: None | Estimated Time: 2-3 days**

#### Features
- Search bar in header (desktop & mobile)
- Real-time search suggestions
- Search results page with filters
- Search by product name, description, SKU
- Sort by relevance, price, popularity

#### Implementation
1. **Frontend Components**
   - `components/SearchBar.tsx` - Search input with autocomplete
   - `app/search/page.tsx` - Search results page
   - `components/SearchFilters.tsx` - Filter sidebar
   - `components/SearchResults.tsx` - Results grid

2. **Backend/Logic**
   - Client-side search (for MVP - search in mock data)
   - Or API route: `/app/api/search/route.ts`
   - Fuzzy search algorithm (Fuse.js or custom)

3. **Data Structure**
   - Extract product data to shared file: `lib/products.ts`
   - Add search keywords to products

#### Testing Checklist
- [ ] Search bar appears in header
- [ ] Typing shows suggestions
- [ ] Clicking suggestion navigates to product
- [ ] Search results page shows matching products
- [ ] Filters work (price, collection, availability)
- [ ] Empty state shows when no results
- [ ] Mobile search works correctly
- [ ] Search persists in URL query params

---

### **Phase 9: User Accounts & Authentication**
**Priority: High | Dependencies: None | Estimated Time: 4-5 days**

#### Features
- User registration (email/phone + password)
- Login/Logout
- Password reset (email OTP)
- Protected routes
- User profile page
- Session management

#### Implementation
1. **Authentication System**
   - Install: `next-auth` or custom JWT solution
   - API routes: `/app/api/auth/register`, `/app/api/auth/login`, `/app/api/auth/logout`
   - Session storage: JWT tokens in httpOnly cookies

2. **Database Setup**
   - Set up database (PostgreSQL with Prisma ORM recommended)
   - User model/schema
   - Migration scripts

3. **Frontend Components**
   - `app/login/page.tsx` - Login page
   - `app/register/page.tsx` - Registration page
   - `app/profile/page.tsx` - User profile
   - `components/AuthGuard.tsx` - Protected route wrapper
   - Update `components/Header.tsx` - Add user menu

4. **Context/State**
   - `contexts/AuthContext.tsx` - Global auth state
   - Persist auth state in localStorage/sessionStorage

#### Testing Checklist
- [ ] User can register with email/phone
- [ ] Registration validates email format
- [ ] Registration validates password strength
- [ ] User can login with credentials
- [ ] Login shows error for invalid credentials
- [ ] User session persists on page refresh
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] User menu shows in header when logged in
- [ ] Profile page displays user info
- [ ] Password reset flow works

---

### **Phase 10: Order History**
**Priority: Medium | Dependencies: Phase 9 (Auth) | Estimated Time: 3-4 days**

#### Features
- View past orders
- Order details page
- Order status tracking
- Download invoice (PDF)
- Reorder functionality

#### Implementation
1. **Database**
   - Orders table
   - OrderItems table
   - Link orders to users

2. **API Routes**
   - `/app/api/orders/route.ts` - GET user orders
   - `/app/api/orders/[id]/route.ts` - GET order details

3. **Frontend**
   - `app/orders/page.tsx` - Orders list
   - `app/orders/[id]/page.tsx` - Order details
   - `components/OrderCard.tsx` - Order summary card
   - `components/OrderStatusBadge.tsx` - Status indicator

4. **Integration**
   - Update checkout to save orders to database
   - Link orders to authenticated users

#### Testing Checklist
- [ ] Orders page shows user's orders
- [ ] Orders sorted by date (newest first)
- [ ] Order card shows key info (date, total, status)
- [ ] Clicking order shows full details
- [ ] Order details show all items
- [ ] Order status is displayed correctly
- [ ] Reorder button adds items to cart
- [ ] Empty state when no orders
- [ ] Mobile responsive

---

### **Phase 11: Product Reviews & Ratings**
**Priority: Medium | Dependencies: Phase 9 (Auth) | Estimated Time: 3-4 days**

#### Features
- Add review/rating on product page
- View all reviews for a product
- Average rating display
- Review moderation (admin)
- Verified purchase badge
- Helpful votes on reviews

#### Implementation
1. **Database**
   - Reviews table
   - ReviewVotes table (for helpful votes)

2. **API Routes**
   - `/app/api/reviews/route.ts` - POST new review, GET product reviews
   - `/app/api/reviews/[id]/vote/route.ts` - Vote on review

3. **Frontend**
   - `components/ProductReviews.tsx` - Reviews section on product page
   - `components/ReviewForm.tsx` - Add review form
   - `components/ReviewCard.tsx` - Individual review display
   - `components/StarRating.tsx` - Rating input/display

4. **Integration**
   - Add reviews section to product page
   - Show average rating in product card
   - Only allow reviews from logged-in users
   - Optionally: Only allow reviews from users who purchased

#### Testing Checklist
- [ ] Reviews section appears on product page
- [ ] Average rating displays correctly
- [ ] User can submit review when logged in
- [ ] Review form validates (rating required, comment length)
- [ ] Reviews display in chronological order
- [ ] Star rating input works
- [ ] Helpful vote button works
- [ ] Verified purchase badge shows (if applicable)
- [ ] Non-logged-in users see "Login to review" message
- [ ] Admin can moderate reviews

---

### **Phase 12: Wishlist Functionality**
**Priority: Low | Dependencies: Phase 9 (Auth) | Estimated Time: 2-3 days**

#### Features
- Add/remove products to wishlist
- Wishlist page
- Wishlist icon in header (with count)
- Quick add to cart from wishlist
- Share wishlist (optional)

#### Implementation
1. **Database**
   - Wishlist table

2. **API Routes**
   - `/app/api/wishlist/route.ts` - GET, POST, DELETE
   - `/app/api/wishlist/[productId]/route.ts` - Toggle product

3. **Frontend**
   - `app/wishlist/page.tsx` - Wishlist page
   - `components/WishlistButton.tsx` - Add to wishlist button
   - `components/WishlistIcon.tsx` - Header icon with count
   - Update product pages with wishlist button

4. **Context/State**
   - `contexts/WishlistContext.tsx` - Global wishlist state
   - Sync with backend

#### Testing Checklist
- [ ] Wishlist button appears on product pages
- [ ] Clicking adds/removes from wishlist
- [ ] Wishlist icon shows count in header
- [ ] Wishlist page shows saved products
- [ ] Add to cart from wishlist works
- [ ] Remove from wishlist works
- [ ] Wishlist persists across sessions
- [ ] Empty wishlist shows empty state
- [ ] Mobile responsive

---

### **Phase 13: Email Notifications**
**Priority: Medium | Dependencies: Phase 9 (Auth), Phase 10 (Orders) | Estimated Time: 3-4 days**

#### Features
- Order confirmation email
- Shipping notification
- Order delivered notification
- Password reset email
- Welcome email
- Abandoned cart reminder (optional)

#### Implementation
1. **Email Service**
   - Choose: SendGrid, Resend, AWS SES, or Nodemailer
   - Set up email templates
   - Environment variables for API keys

2. **API Routes**
   - `/app/api/email/send/route.ts` - Send email utility
   - Integrate into order flow

3. **Email Templates**
   - `lib/email-templates/order-confirmation.tsx`
   - `lib/email-templates/shipping.tsx`
   - `lib/email-templates/password-reset.tsx`

4. **Integration Points**
   - After order placement
   - After order status change
   - After user registration
   - Password reset flow

#### Testing Checklist
- [ ] Order confirmation email sent after purchase
- [ ] Email contains order details
- [ ] Shipping notification sent when status changes
- [ ] Password reset email sent
- [ ] Welcome email sent after registration
- [ ] Email templates render correctly
- [ ] Email links work (order tracking, password reset)
- [ ] Email delivery works in production

---

### **Phase 14: Admin Dashboard**
**Priority: Low | Dependencies: Phase 9 (Auth), Phase 10 (Orders) | Estimated Time: 5-6 days**

#### Features
- Admin login (separate from customer)
- Dashboard overview (stats, charts)
- Product management (CRUD)
- Order management (view, update status)
- User management
- Review moderation
- Analytics/reports

#### Implementation
1. **Authentication**
   - Admin role in user table
   - Admin login page
   - Protected admin routes

2. **API Routes**
   - `/app/api/admin/*` - All admin endpoints
   - Product CRUD
   - Order management
   - User management

3. **Frontend**
   - `app/admin/login/page.tsx` - Admin login
   - `app/admin/dashboard/page.tsx` - Main dashboard
   - `app/admin/products/page.tsx` - Product management
   - `app/admin/orders/page.tsx` - Order management
   - `app/admin/users/page.tsx` - User management
   - `app/admin/reviews/page.tsx` - Review moderation

4. **Components**
   - `components/admin/StatsCard.tsx`
   - `components/admin/ProductForm.tsx`
   - `components/admin/OrderTable.tsx`
   - `components/admin/UserTable.tsx`

#### Testing Checklist
- [ ] Admin can login with admin credentials
- [ ] Dashboard shows key metrics
- [ ] Admin can create/edit/delete products
- [ ] Admin can view all orders
- [ ] Admin can update order status
- [ ] Admin can view users
- [ ] Admin can moderate reviews
- [ ] Regular users cannot access admin routes
- [ ] Admin dashboard is responsive

---

## Technology Stack Additions

### New Dependencies
```json
{
  "next-auth": "^4.24.0",           // Authentication
  "@prisma/client": "^5.7.0",       // ORM
  "prisma": "^5.7.0",                // Database toolkit
  "bcryptjs": "^2.4.3",              // Password hashing
  "jsonwebtoken": "^9.0.2",          // JWT tokens
  "fuse.js": "^7.0.0",               // Fuzzy search
  "react-query": "^3.39.3",          // Data fetching (optional)
  "zod": "^3.22.4",                  // Schema validation
  "resend": "^2.0.0",                // Email service (or SendGrid)
  "recharts": "^2.10.0"              // Charts for admin dashboard
}
```

### Database
- **PostgreSQL** (recommended) or **MongoDB**
- Use **Prisma** as ORM for PostgreSQL
- Or **Mongoose** for MongoDB

---

## Development Workflow

1. **Phase Start**: Review plan, set up dependencies
2. **Development**: Implement features following plan
3. **Testing**: Run test checklist
4. **Code Review**: Self-review for quality
5. **Commit**: Commit with descriptive message
6. **Pause**: Wait for user approval
7. **Next Phase**: Proceed after approval

---

## Testing Strategy

### Unit Tests (Optional but Recommended)
- Test utility functions
- Test API route handlers
- Test form validation

### Integration Tests
- Test complete user flows
- Test API endpoints
- Test database operations

### Manual Testing
- Follow test checklist for each phase
- Test on multiple browsers
- Test on mobile devices
- Test edge cases

---

## Security Considerations

1. **Authentication**
   - Hash passwords (bcrypt)
   - Use httpOnly cookies for tokens
   - Implement CSRF protection
   - Rate limiting on auth endpoints

2. **Authorization**
   - Role-based access control
   - Protect admin routes
   - Validate user ownership (orders, reviews)

3. **Data Validation**
   - Validate all inputs (Zod schemas)
   - Sanitize user inputs
   - SQL injection prevention (use ORM)

4. **Email**
   - Secure email service API keys
   - Validate email addresses
   - Rate limit email sending

---

## Performance Considerations

1. **Search**
   - Implement debouncing for search input
   - Cache search results
   - Use database indexes

2. **Database**
   - Add indexes on frequently queried fields
   - Optimize queries
   - Use pagination for lists

3. **Frontend**
   - Lazy load admin dashboard
   - Optimize images
   - Code splitting

---

## Next Steps

**Ready to start Phase 8: Product Search Functionality**

After each phase:
1. Complete implementation
2. Run test checklist
3. Commit changes
4. **PAUSE for approval**
5. Proceed to next phase

---

## Estimated Timeline

- Phase 8: 2-3 days
- Phase 9: 4-5 days
- Phase 10: 3-4 days
- Phase 11: 3-4 days
- Phase 12: 2-3 days
- Phase 13: 3-4 days
- Phase 14: 5-6 days

**Total: ~22-28 days** (depending on complexity and testing)

---

## Notes

- Each phase is independent and can be tested separately
- Dependencies are clearly marked
- Can adjust priorities based on business needs
- Can skip optional features if needed
- Database setup needed before Phase 9

