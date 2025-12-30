# The Button - Premium Menswear D2C Website

A high-conversion D2C menswear website optimized for Instagram traffic, mobile-first users, and WhatsApp-driven conversions.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Vercel** (deployment)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
theButton/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with SEO & Analytics
│   ├── page.tsx           # Home page
│   ├── products/[id]/     # Product detail pages
│   ├── collections/[slug]/ # Collection listing pages
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Checkout page
│   ├── verify-otp/        # OTP verification page
│   ├── order-success/     # Order success page
│   └── policies/          # Policy pages
├── components/            # React components
│   ├── Header.tsx         # Global header
│   ├── Footer.tsx         # Global footer
│   ├── ImageGallery.tsx  # Product image gallery
│   ├── ProductInfo.tsx    # Product details
│   ├── CartItem.tsx       # Cart item component
│   ├── CheckoutForm.tsx   # Checkout form
│   ├── Analytics.tsx      # Analytics integration
│   └── ...                # Other components
├── contexts/              # React Context providers
│   └── CartContext.tsx    # Shopping cart state
├── lib/                   # Utility functions
│   ├── analytics.ts       # Analytics tracking
│   └── razorpay.ts       # Payment integration
└── public/                # Static assets
```

## Development Phases

- ✅ **Phase 1**: Foundation & Project Setup
- ✅ **Phase 2**: Core Pages (Non-Conversion)
- ✅ **Phase 3**: Product Page (Conversion Critical)
- ✅ **Phase 4**: Cart & CRO Mechanics
- ✅ **Phase 5**: Checkout & Payments (with OTP Verification)
- ✅ **Phase 6**: Analytics & Tracking
- ✅ **Phase 7**: Performance, QA & Polish

## Features

### 🛍️ E-Commerce Functionality
- Product browsing and filtering
- Shopping cart with persistence
- One-page checkout with validation
- OTP verification before order confirmation
- Multiple payment methods (Razorpay, COD)
- Order tracking and confirmation

### 📊 Analytics & Tracking
- Meta Pixel integration
- Google Analytics 4 (GA4)
- Event tracking (ViewContent, AddToCart, Purchase, etc.)
- WhatsApp click tracking

### 🎨 User Experience
- Mobile-first responsive design
- Sticky add-to-cart and WhatsApp buttons
- Image zoom functionality
- Free shipping progress indicator
- Trust badges and social proof
- Smooth animations with Framer Motion

### ⚡ Performance
- Optimized images with Next.js Image
- Code splitting and lazy loading
- Error boundaries for graceful error handling
- SEO optimized with metadata

## Environment Variables

Create a `.env.local` file:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://thebutton.in

# Analytics (Optional)
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id
NEXT_PUBLIC_GA4_ID=your_ga4_measurement_id

# Payment Gateway (Optional - for production)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Testing

See `TESTING_CHECKLIST.md` and `QUICK_TEST_GUIDE.md` for comprehensive testing instructions.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The site will be live at `https://your-project.vercel.app`

## License

Private - The Button (Rewari)

