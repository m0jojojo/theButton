# Deployment Guide - The Button

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Analytics IDs added (Meta Pixel, GA4)
- [ ] Razorpay keys added (if using online payments)
- [ ] Site URL updated in metadata
- [ ] All tests passed
- [ ] Build successful (`npm run build`)

## Environment Variables

### Required
- `NEXT_PUBLIC_SITE_URL` - Your production site URL (e.g., `https://thebutton.in`)

### Optional (but recommended)
- `NEXT_PUBLIC_META_PIXEL_ID` - Facebook Pixel ID for tracking
- `NEXT_PUBLIC_GA4_ID` - Google Analytics 4 Measurement ID
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay Key ID for payments

## Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Optimized for Next.js
- Automatic deployments from GitHub
- Free tier available
- Global CDN
- Easy environment variable management

**Steps:**
1. Push code to GitHub (already done ✅)
2. Go to [vercel.com](https://vercel.com)
3. Sign up/Login with GitHub
4. Click "Add New Project"
5. Import `m0jojojo/theButton` repository
6. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
7. Add Environment Variables:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_META_PIXEL_ID` (if using)
   - `NEXT_PUBLIC_GA4_ID` (if using)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` (if using)
8. Click "Deploy"
9. Wait for deployment (2-3 minutes)
10. Your site will be live at `https://thebutton-xxx.vercel.app`

**Custom Domain:**
- Go to Project Settings → Domains
- Add your custom domain (e.g., `thebutton.in`)
- Follow DNS configuration instructions

### Option 2: Netlify

**Steps:**
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Sign up/Login with GitHub
4. Click "Add new site" → "Import an existing project"
5. Select GitHub and choose `theButton` repository
6. Configure:
   - Build command: `npm run build`
   - Publish directory: `.next`
7. Add environment variables
8. Deploy

### Option 3: Self-Hosted

**Requirements:**
- Node.js 18+ server
- PM2 or similar process manager
- Nginx or Apache for reverse proxy

**Steps:**
1. Clone repository on server
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Set environment variables
5. Start: `npm start` or use PM2
6. Configure reverse proxy

## Post-Deployment

### 1. Verify Deployment
- [ ] Site loads correctly
- [ ] All pages accessible
- [ ] Images load (or show placeholders)
- [ ] Forms work
- [ ] Analytics tracking works

### 2. Test Critical Flows
- [ ] Browse products
- [ ] Add to cart
- [ ] Checkout flow
- [ ] OTP verification
- [ ] Order success

### 3. Performance Check
- Run Lighthouse audit
- Check Core Web Vitals
- Verify image optimization
- Check bundle sizes

### 4. SEO Setup
- Submit sitemap to Google Search Console
- Verify meta tags
- Check Open Graph tags
- Test social sharing

### 5. Analytics Verification
- Check Meta Pixel events in Events Manager
- Check GA4 real-time reports
- Verify all events fire correctly

## Monitoring

### Recommended Tools
- **Vercel Analytics** (if using Vercel)
- **Google Analytics 4**
- **Meta Pixel Events Manager**
- **Sentry** (for error tracking - optional)

## Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors
- Review build logs

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side
- Restart deployment after adding variables
- Check variable names match code

### Images Not Loading
- Verify image URLs are correct
- Check Next.js Image configuration
- Ensure external domains are in `next.config.mjs`

### Analytics Not Working
- Verify IDs are correct
- Check browser console for errors
- Ensure variables are set in production
- Wait 24-48 hours for data to appear

## Support

For issues or questions:
- Check `TESTING_CHECKLIST.md` for testing procedures
- Review `QUICK_TEST_GUIDE.md` for quick fixes
- Check browser console for errors
- Review deployment logs

