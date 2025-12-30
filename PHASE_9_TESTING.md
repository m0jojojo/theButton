# Phase 9: User Accounts & Authentication - Testing Checklist

## ✅ Test Checklist

### 1. Registration
- [ ] Registration page loads at `/register`
- [ ] Form fields: Name, Email, Phone (optional), Password, Confirm Password
- [ ] Email validation works (invalid format shows error)
- [ ] Password validation works (min 6 characters)
- [ ] Password confirmation validation works (mismatch shows error)
- [ ] Phone validation works (10 digits if provided)
- [ ] Registration with valid data creates account
- [ ] Registration redirects to profile page after success
- [ ] Duplicate email shows error message
- [ ] Error messages display correctly
- [ ] Loading state shows during registration

### 2. Login
- [ ] Login page loads at `/login`
- [ ] Form fields: Email, Password
- [ ] Login with valid credentials works
- [ ] Login redirects to profile page after success
- [ ] Invalid email shows error
- [ ] Invalid password shows error
- [ ] Error messages display correctly
- [ ] Loading state shows during login
- [ ] "Forgot password?" link exists (placeholder for future)
- [ ] "Sign up" link navigates to register page

### 3. Authentication State
- [ ] User session persists on page refresh
- [ ] Token stored in localStorage
- [ ] User data stored in localStorage
- [ ] Token verification on page load works
- [ ] Invalid/expired token clears session
- [ ] Logout clears session and localStorage
- [ ] Auth state loads correctly on app start

### 4. Protected Routes
- [ ] Profile page requires authentication
- [ ] Unauthenticated users redirected to `/login` from profile
- [ ] AuthGuard component shows loading spinner
- [ ] After login, redirects to intended page (if applicable)

### 5. User Profile
- [ ] Profile page displays user information
- [ ] Email shown (read-only)
- [ ] Name displayed correctly
- [ ] Phone displayed (or "Not provided")
- [ ] Member since date displayed correctly
- [ ] Edit button works
- [ ] Edit mode shows input fields
- [ ] Save changes works
- [ ] Cancel button discards changes
- [ ] Logout button works from profile
- [ ] Profile updates persist

### 6. Header Integration
- [ ] Login link shows when not authenticated (desktop)
- [ ] User menu shows when authenticated (desktop)
- [ ] User menu shows user's first name
- [ ] User menu dropdown works
- [ ] "My Profile" link in menu works
- [ ] Logout button in menu works
- [ ] Mobile menu shows login/auth links
- [ ] Mobile menu closes after navigation

### 7. API Endpoints
- [ ] POST `/api/auth/register` creates user
- [ ] POST `/api/auth/register` validates input
- [ ] POST `/api/auth/register` returns token and user
- [ ] POST `/api/auth/login` authenticates user
- [ ] POST `/api/auth/login` validates credentials
- [ ] POST `/api/auth/login` returns token and user
- [ ] GET `/api/auth/me` requires authentication
- [ ] GET `/api/auth/me` returns user data
- [ ] GET `/api/auth/me` handles invalid token

### 8. Security
- [ ] Passwords are hashed (bcrypt)
- [ ] Passwords not stored in plain text
- [ ] JWT tokens used for authentication
- [ ] Token expiration works (7 days default)
- [ ] Token verification works
- [ ] API routes validate input
- [ ] Error messages don't leak sensitive info

### 9. Mobile Responsiveness
- [ ] Login page responsive
- [ ] Registration page responsive
- [ ] Profile page responsive
- [ ] User menu works on mobile
- [ ] Forms work on mobile devices
- [ ] Touch interactions work

### 10. Edge Cases
- [ ] Empty form submission shows validation errors
- [ ] Very long email handled correctly
- [ ] Special characters in name handled
- [ ] Network errors handled gracefully
- [ ] Multiple rapid submissions prevented
- [ ] Session persists across browser tabs

### 11. Integration
- [ ] Auth works with existing cart functionality
- [ ] Auth works with search functionality
- [ ] No conflicts with other features
- [ ] Layout renders correctly with AuthProvider

## 🐛 Known Issues
- Password reset flow not implemented (placeholder link exists)
- User data stored in-memory (will be replaced with database in production)

## 📝 Notes
- Authentication uses JWT tokens stored in localStorage
- User data stored in-memory (Map) - will be replaced with database
- Password hashing uses bcrypt with salt rounds of 10
- Token expiration: 7 days (configurable via JWT_EXPIRES_IN env var)
- JWT_SECRET should be changed in production

## ✅ Ready for Approval
Once all tests pass, Phase 9 is complete and ready for approval to proceed to Phase 10.

