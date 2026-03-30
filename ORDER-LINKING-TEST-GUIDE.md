# Order Linking Feature - Testing Guide

## 🎯 Quick Test Scenarios

### Scenario 1: Single Guest Order → Register → View Order

**Steps:**

1. **Place Guest Order**
   - Go to `/shop`
   - Add product to cart
   - Go to checkout → Click "Continue as Guest"
   - Fill form:
     ```
     Name: Test User
     Email: testuser@example.com
     Phone: 9876543210
     Address: 123 Test Street
     City: Mumbai
     State: Maharashtra
     Pincode: 400001
     ```
   - Select "Cash on Delivery"
   - Click "Place Order"
   - **Note:** See registration tip before submitting

2. **View Confirmation**
   - Should redirect to confirmation page
   - **Verify:** See prominent registration prompt
   - **Verify:** "Create Account Now" button visible
   - **Verify:** Shows email used for order
   - Copy Order ID for reference

3. **Register Account**
   - Click "Create Account Now" button
   - Fill registration form with **SAME EMAIL**:
     ```
     Name: Test User
     Email: testuser@example.com (SAME!)
     Phone: 9876543210 (SAME!)
     Password: password123
     ```
   - **Verify:** See info message about order linking
   - Click "Register"
   - **Expected:** Success toast shows "Account created! 1 previous order(s) linked to your account."

4. **Login and View Orders**
   - Redirected to login page
   - Login with:
     ```
     Email: testuser@example.com
     Password: password123
     ```
   - Go to "My Orders" (Profile → Orders)
   - **Expected:** See the guest order in the list!

**✅ Success Criteria:**
- Registration shows "1 previous order(s) linked"
- Guest order appears in "My Orders"
- Order shows correct details

---

### Scenario 2: Multiple Guest Orders → Register

**Steps:**

1. **Place First Guest Order**
   - Email: multiorder@example.com
   - Phone: 9111111111
   - Place order (COD)
   - Note Order ID #1

2. **Place Second Guest Order**
   - Use **SAME EMAIL**: multiorder@example.com
   - Use **SAME PHONE**: 9111111111
   - Place order (COD)
   - Note Order ID #2

3. **Place Third Guest Order**
   - Use **SAME EMAIL**: multiorder@example.com
   - Use **SAME PHONE**: 9111111111
   - Place order (Online Payment - use test card)
   - Note Order ID #3

4. **Register Account**
   - Email: multiorder@example.com
   - Phone: 9111111111
   - Password: password123
   - **Expected:** "Account created! 3 previous order(s) linked to your account."

5. **Login and Verify**
   - Login with credentials
   - Go to "My Orders"
   - **Expected:** See all 3 orders!

**✅ Success Criteria:**
- Registration shows "3 previous order(s) linked"
- All 3 orders visible in "My Orders"
- Orders show correct payment methods (2 COD, 1 Online)

---

### Scenario 3: Phone Number Matching

**Steps:**

1. **Place Guest Order**
   - Email: guest1@example.com
   - Phone: 9222222222
   - Place order

2. **Register with Different Email but Same Phone**
   - Email: different@example.com (DIFFERENT!)
   - Phone: 9222222222 (SAME!)
   - Password: password123
   - **Expected:** "Account created! 1 previous order(s) linked to your account."

3. **Verify**
   - Login
   - Check "My Orders"
   - **Expected:** Guest order is linked (matched by phone)

**✅ Success Criteria:**
- Order linked by phone number match
- Order visible in "My Orders"

---

### Scenario 4: Email Matching (Case Insensitive)

**Steps:**

1. **Place Guest Order**
   - Email: TestUser@Example.COM (mixed case)
   - Phone: 9333333333
   - Place order

2. **Register with Lowercase Email**
   - Email: testuser@example.com (lowercase)
   - Phone: 9333333333
   - Password: password123
   - **Expected:** "Account created! 1 previous order(s) linked to your account."

3. **Verify**
   - Login
   - Check "My Orders"
   - **Expected:** Order linked (case-insensitive match)

**✅ Success Criteria:**
- Email matching is case-insensitive
- Order successfully linked

---

### Scenario 5: No Guest Orders (New User)

**Steps:**

1. **Register Without Prior Orders**
   - Email: newuser@example.com
   - Phone: 9444444444
   - Password: password123
   - **Expected:** "Registration successful! Please login."
   - **Note:** No mention of linked orders

2. **Login**
   - Login with credentials
   - Go to "My Orders"
   - **Expected:** Empty orders list

**✅ Success Criteria:**
- Registration succeeds without errors
- No linked orders message
- Orders page is empty

---

### Scenario 6: Guest Order → Track → Register

**Steps:**

1. **Place Guest Order**
   - Email: tracker@example.com
   - Phone: 9555555555
   - Place order
   - Save Order ID

2. **Track Order as Guest**
   - Go to `/track-order`
   - Enter Order ID
   - Enter Email: tracker@example.com
   - Click "Track Order"
   - **Verify:** Order details shown

3. **Register Account**
   - Go to `/register`
   - Email: tracker@example.com
   - Phone: 9555555555
   - Password: password123
   - **Expected:** "1 previous order(s) linked"

4. **Track Order as Logged-in User**
   - Login
   - Go to "My Orders"
   - **Expected:** See the order
   - Can track from "My Orders" page

**✅ Success Criteria:**
- Can track as guest before registration
- Order links after registration
- Can access order from "My Orders"

---

## 🎨 UI Elements to Verify

### Guest Checkout Page
- [ ] Registration tip box visible
- [ ] Gradient background (blue to purple)
- [ ] Clear message about registration benefits
- [ ] Responsive on mobile

### Order Confirmation Page
- [ ] Large registration prompt visible
- [ ] "🎉 Want to track your orders easily?" heading
- [ ] "Create Account Now" button prominent
- [ ] Shows user's email
- [ ] Explains automatic linking
- [ ] Responsive design

### Registration Page
- [ ] Info box about order linking visible
- [ ] Blue background with border
- [ ] ℹ️ icon present
- [ ] Clear message about automatic linking
- [ ] Phone field accepts 10 digits
- [ ] Password minimum 6 characters

### Success Messages
- [ ] Toast appears after registration
- [ ] Shows linked orders count (if any)
- [ ] Toast duration is 5 seconds
- [ ] Toast is dismissible

---

## 🧪 Backend API Testing

### Test Registration Response

```bash
# Create guest order first
curl -X POST http://localhost:3000/api/v1/orders/guest/create \
  -H "Content-Type: application/json" \
  -d '{
    "guestInfo": {
      "name": "API Test",
      "email": "apitest@example.com",
      "phone": "9999999999"
    },
    "items": [{
      "product": "PRODUCT_ID",
      "category": "Shiva",
      "size": "M",
      "quantity": 1
    }],
    "address": {
      "line1": "123 API St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "country": "India"
    },
    "totalAmount": 999,
    "paymentMethod": "COD"
  }'

# Register with same email
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test",
    "email": "apitest@example.com",
    "phone": "9999999999",
    "password": "password123"
  }'

# Expected Response:
{
  "success": true,
  "message": "User created successfully",
  "linkedOrders": 1,  // <-- Check this field!
  "token": "jwt_token",
  "user": {
    "_id": "user_id",
    "name": "API Test",
    "email": "apitest@example.com",
    "phone": "9999999999"
  }
}
```

### Verify Order Linking in Database

```bash
# Get user orders
curl -X GET http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check response:
# - Order should have isGuestOrder: false
# - Order should have user: user_id
# - Order should still have guestInfo
```

---

## 📊 Test Results Checklist

### Functional Tests
- [ ] Single order linking works
- [ ] Multiple orders linking works
- [ ] Email matching works (case-insensitive)
- [ ] Phone matching works
- [ ] No orders scenario works
- [ ] Registration tip displays on checkout
- [ ] Registration prompt displays on confirmation
- [ ] Order linking info displays on registration
- [ ] Success message shows linked count
- [ ] Linked orders appear in "My Orders"

### UI Tests
- [ ] All prompts visible and styled correctly
- [ ] Gradient backgrounds render properly
- [ ] Dark mode works
- [ ] Responsive on mobile (320px - 480px)
- [ ] Responsive on tablet (768px - 1024px)
- [ ] Responsive on desktop (1280px+)
- [ ] Buttons are clickable
- [ ] Links navigate correctly

### Integration Tests
- [ ] Guest order creation works
- [ ] Registration API returns linkedOrders
- [ ] Orders API shows linked orders
- [ ] Order tracking works before registration
- [ ] Order tracking works after registration
- [ ] Login works after registration
- [ ] "My Orders" page shows all orders

### Edge Cases
- [ ] Register with no guest orders
- [ ] Register with email only match
- [ ] Register with phone only match
- [ ] Register with both email and phone match
- [ ] Case-insensitive email matching
- [ ] Multiple orders with same email
- [ ] Multiple orders with same phone

---

## 🐛 Common Issues & Solutions

### Issue: linkedOrders not showing in success message
**Check:**
- Backend returns `linkedOrders` field in response
- Frontend checks `result.linkedOrders` correctly
- Toast condition: `result.linkedOrders > 0`

### Issue: Orders not appearing in "My Orders"
**Check:**
- Order `isGuestOrder` changed to `false`
- Order `user` field set to user ID
- Orders API filters by user ID correctly

### Issue: Email matching not working
**Check:**
- Backend does case-insensitive comparison
- Email trimmed of whitespace
- Email format validation passes

### Issue: Phone matching not working
**Check:**
- Phone stored as string (not number)
- Exact 10-digit match
- No country code prefix

### Issue: Registration prompt not showing
**Check:**
- Order confirmation page has the prompt component
- Order data loaded successfully
- `order.guestInfo.email` exists

---

## 📝 Test Report Template

```
Date: ___________
Tester: ___________
Environment: [ ] Development  [ ] Staging  [ ] Production

Scenario 1 - Single Order Linking:     [ ] Pass  [ ] Fail
Scenario 2 - Multiple Orders:           [ ] Pass  [ ] Fail
Scenario 3 - Phone Matching:            [ ] Pass  [ ] Fail
Scenario 4 - Email Case Insensitive:    [ ] Pass  [ ] Fail
Scenario 5 - No Guest Orders:           [ ] Pass  [ ] Fail
Scenario 6 - Track then Register:       [ ] Pass  [ ] Fail

UI Elements:
- Guest Checkout Tip:                   [ ] Pass  [ ] Fail
- Confirmation Prompt:                  [ ] Pass  [ ] Fail
- Registration Info:                    [ ] Pass  [ ] Fail
- Success Message:                      [ ] Pass  [ ] Fail

Issues Found:
_________________________________
_________________________________
_________________________________

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🎯 Quick Verification Commands

### Check if order is guest order
```javascript
// In browser console after placing guest order
console.log(localStorage.getItem('guestOrderId'));
console.log(localStorage.getItem('guestOrderEmail'));
```

### Check registration response
```javascript
// In browser Network tab
// Look for /api/v1/auth/register response
// Verify linkedOrders field exists
```

### Check orders after login
```javascript
// In browser console after login
// Go to My Orders page
// Check if guest orders appear
```

---

## ✅ Final Checklist

Before marking as complete:

- [ ] All 6 test scenarios pass
- [ ] All UI elements display correctly
- [ ] All API responses correct
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] Success messages show correctly
- [ ] Orders appear in "My Orders"
- [ ] Documentation is complete

---

**Testing Status:** Ready for Testing
**Last Updated:** March 30, 2026
**Version:** 2.0.0
