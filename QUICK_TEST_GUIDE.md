# Quick Testing Guide - The Button

## ✅ Automated Tests (Already Passed)

- ✅ **Build**: `npm run build` - Successful
- ✅ **Linting**: `npm run lint` - No errors
- ✅ **TypeScript**: Type checking - No errors

## 🧪 Manual Testing Steps

### 1. Start Testing Environment

```bash
# Make sure dev server is running
npm run dev
```

Open browser: `http://localhost:3000`

### 2. Critical Path Testing (5 minutes)

#### Test 1: Browse & Add to Cart
1. Go to homepage
2. Click "Shop New Arrivals" or navigate to `/collections/shirts`
3. Click on any product
4. Select a size (required)
5. Click "Add to Cart"
6. ✅ **Expected**: Cart icon shows count, item added

#### Test 2: View Cart
1. Click cart icon in header
2. Verify item is displayed
3. Try quantity controls (+/-)
4. Try remove item
5. ✅ **Expected**: Cart updates correctly

#### Test 3: Checkout Flow
1. Click "Proceed to Checkout"
2. Fill form with **invalid data first**:
   - Email: "test" (should show error)
   - Phone: "123" (should show error)
   - Submit (should show all errors)
3. Fill form with **valid data**:
   - First Name: "John"
   - Last Name: "Doe"
   - Email: "john@example.com"
   - Phone: "9876543210"
   - Address: "123 Test Street"
   - City: "Mumbai"
   - State: "Maharashtra"
   - Pincode: "400001"
4. Select payment method (COD or Razorpay)
5. Click "Place Order" or "Pay"
6. ✅ **Expected**: Redirects to OTP page

#### Test 4: OTP Verification
1. Check browser console (F12) for OTP
2. Enter the 6-digit OTP from console
3. ✅ **Expected**: Auto-verifies and redirects to success page
4. Try invalid OTP: Should show error
5. Try resend: Wait 60 seconds, click resend

#### Test 5: Order Success
1. Verify order success page displays
2. Check order ID is shown
3. Click WhatsApp button
4. ✅ **Expected**: Opens WhatsApp with pre-filled message
5. Click "Continue Shopping"
6. ✅ **Expected**: Cart is empty

### 3. Error Testing (2 minutes)

#### Test Error Handling
1. Navigate to `/products/999` (non-existent product)
2. ✅ **Expected**: 404 page shows
3. Navigate to `/collections/invalid`
4. ✅ **Expected**: 404 page shows

#### Test Form Validation
1. Go to checkout
2. Try submitting empty form
3. ✅ **Expected**: All required fields show errors in red
4. Type in email field with invalid email
5. ✅ **Expected**: Error shows when you blur or submit

### 4. Mobile Testing (3 minutes)

#### Test Mobile View
1. Open DevTools (F12)
2. Click device toggle (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Test:
   - Navigation menu (hamburger)
   - Product browsing
   - Add to cart
   - Checkout form
   - Sticky elements (Add to Cart, WhatsApp)
5. ✅ **Expected**: Everything works on mobile

### 5. Performance Check (1 minute)

#### Check Console
1. Open DevTools (F12)
2. Go to Console tab
3. ✅ **Expected**: No red errors
4. ⚠️ **Acceptable**: Warnings about analytics (if IDs not set)
5. Go to Network tab
6. Reload page
7. ✅ **Expected**: Images load, no failed requests

### 6. Accessibility Check (2 minutes)

#### Keyboard Navigation
1. Press Tab repeatedly
2. ✅ **Expected**: Focus moves through all interactive elements
3. ✅ **Expected**: Focus indicator is visible
4. Press Enter on buttons
5. ✅ **Expected**: Buttons activate

## 🐛 Common Issues to Watch For

- ❌ **Infinite loops**: Check console for "Maximum update depth" warnings
- ❌ **Missing images**: Should show placeholder gracefully
- ❌ **Form errors not visible**: Check text color (should be red)
- ❌ **Cart not persisting**: Check localStorage in DevTools
- ❌ **OTP not working**: Check console for generated OTP

## ✅ Success Criteria

All tests pass if:
- ✅ No console errors
- ✅ All user flows work end-to-end
- ✅ Forms validate correctly
- ✅ Mobile view works
- ✅ Images load (or show placeholders)
- ✅ Cart persists
- ✅ OTP verification works
- ✅ Order success page shows

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Critical Flows:
[ ] Browse & Add to Cart
[ ] View Cart
[ ] Checkout Flow
[ ] OTP Verification
[ ] Order Success

Error Handling:
[ ] 404 Pages
[ ] Form Validation

Mobile:
[ ] Responsive Design
[ ] Touch Interactions

Performance:
[ ] No Console Errors
[ ] Fast Load Times

Issues Found:
1. 
2. 
3. 
```

---

**Ready to test?** Start with the Critical Path Testing above!

