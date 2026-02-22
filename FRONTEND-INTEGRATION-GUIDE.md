# Frontend Integration Guide - T-Shirt Store API

Complete guide for integrating the T-Shirt Store backend API with Razorpay payment gateway.

## Base URL
```
Production: https://your-api-domain.com
Development: http://localhost:3000
```

---

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📦 1. User Authentication

### Register User
```javascript
POST /api/v1/auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login User
```javascript
POST /api/v1/auth/login

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 👕 2. Products

### Get Products by Category
```javascript
GET /api/v1/products/category/:category?page=1&limit=10

Categories: Shiva, Shrooms, LSD, Chakras, Dark, Rick n Morty

Example:
GET /api/v1/products/category/Shiva?page=1&limit=10

Response:
{
  "success": true,
  "page": 1,
  "limit": 10,
  "totalPages": 2,
  "totalProducts": 15,
  "products": [
    {
      "_id": "product_id",
      "name": "Shiva Meditation T-Shirt",
      "category": "Shiva",
      "price": 799,
      "sizes": ["S", "M", "L", "XL"],
      "images": ["url1", "url2"],
      "stock": 50,
      "isFeatured": true
    }
  ]
}
```

### Get Featured Products
```javascript
GET /api/v1/products/featured?limit=10

Response:
{
  "success": true,
  "totalProducts": 6,
  "products": [...]
}
```

### Get Product by ID
```javascript
GET /api/v1/products/:id

Response:
{
  "success": true,
  "product": {
    "_id": "product_id",
    "name": "Shiva Meditation T-Shirt",
    "description": "Premium cotton T-shirt...",
    "price": 799,
    "category": "Shiva",
    "sizes": ["S", "M", "L", "XL"],
    "images": ["url1", "url2"],
    "stock": 50
  }
}
```

---

## 🛒 3. Cart Management

### Add to Cart
```javascript
POST /api/v1/cart/add
Headers: Authorization: Bearer {token}

Body:
{
  "productId": "product_id",
  "quantity": 2,
  "size": "L"
}

Response:
{
  "success": true,
  "message": "Product added to cart",
  "cart": {...}
}
```

### Get Cart
```javascript
GET /api/v1/cart/get-cart
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "cart": [
    {
      "product": {
        "_id": "product_id",
        "name": "Shiva T-Shirt",
        "price": 799,
        "images": ["url1"]
      },
      "category": "Shiva",
      "quantity": 2,
      "size": "L",
      "priceSnapshot": 799
    }
  ],
  "totalAmount": 1598
}
```

### Update Cart Quantity
```javascript
PUT /api/v1/cart/update
Headers: Authorization: Bearer {token}

Body:
{
  "productId": "product_id",
  "quantity": 3
}
```

### Remove from Cart
```javascript
DELETE /api/v1/cart/remove/:productId
Headers: Authorization: Bearer {token}
```

### Clear Cart
```javascript
DELETE /api/v1/cart/clear-cart
Headers: Authorization: Bearer {token}
```

---

## 💳 4. Payment & Orders

### Option A: Cash on Delivery (COD)

```javascript
POST /api/v1/orders/create
Headers: Authorization: Bearer {token}

Body:
{
  "totalAmount": 1598,
  "address": {
    "line1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  },
  "paymentMethod": "COD"
}

Response:
{
  "success": true,
  "message": "Order created successfully. Stock updated.",
  "order": {
    "_id": "order_id",
    "user": "user_id",
    "items": [...],
    "totalAmount": 1598,
    "status": "Pending",
    "paymentMethod": "COD"
  }
}
```

### Option B: Online Payment (Razorpay)

#### Step 1: Create Razorpay Order
```javascript
POST /api/v1/orders/create-razorpay-order
Headers: Authorization: Bearer {token}

Body:
{
  "totalAmount": 1598,
  "address": {
    "line1": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "country": "India"
  }
}

Response:
{
  "success": true,
  "message": "Razorpay order created",
  "razorpayOrder": {
    "id": "order_MhkLZjHbvXXXXX",
    "amount": 159800,
    "currency": "INR"
  },
  "orderId": "mongodb_order_id",
  "key": "rzp_test_XXXXXXXXXX"
}
```

#### Step 2: Initialize Razorpay Checkout (Frontend)

```javascript
// Install Razorpay SDK
// npm install react-razorpay

import useRazorpay from "react-razorpay";

const [Razorpay] = useRazorpay();

const handlePayment = async () => {
  // Step 1: Create Razorpay order
  const response = await fetch('/api/v1/orders/create-razorpay-order', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      totalAmount: 1598,
      address: {...}
    })
  });

  const data = await response.json();

  // Step 2: Initialize Razorpay
  const options = {
    key: data.key, // Razorpay key from response
    amount: data.razorpayOrder.amount,
    currency: data.razorpayOrder.currency,
    name: "T-Shirt Store",
    description: "Purchase T-Shirts",
    order_id: data.razorpayOrder.id,
    handler: async function (response) {
      // Step 3: Verify payment
      await verifyPayment(
        response.razorpay_order_id,
        response.razorpay_payment_id,
        response.razorpay_signature,
        data.orderId
      );
    },
    prefill: {
      name: "John Doe",
      email: "john@example.com",
      contact: "9999999999"
    },
    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
};

// Step 3: Verify Payment
const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId) => {
  const response = await fetch('/api/v1/orders/verify-payment', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId
    })
  });

  const data = await response.json();
  
  if (data.success) {
    // Payment successful - redirect to success page
    console.log("Payment verified and order confirmed");
    // Navigate to order success page
  } else {
    // Payment verification failed
    console.error("Payment verification failed");
  }
};
```

#### Alternative: Using Script Tag (Vanilla JS)

```html
<!-- Add Razorpay script in HTML -->
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>

<script>
async function handlePayment() {
  // Step 1: Create Razorpay order
  const response = await fetch('/api/v1/orders/create-razorpay-order', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      totalAmount: 1598,
      address: {...}
    })
  });

  const data = await response.json();

  // Step 2: Initialize Razorpay
  const options = {
    key: data.key,
    amount: data.razorpayOrder.amount,
    currency: data.razorpayOrder.currency,
    name: "T-Shirt Store",
    description: "Purchase T-Shirts",
    order_id: data.razorpayOrder.id,
    handler: async function (response) {
      // Step 3: Verify payment
      await verifyPayment(
        response.razorpay_order_id,
        response.razorpay_payment_id,
        response.razorpay_signature,
        data.orderId
      );
    },
    prefill: {
      name: "John Doe",
      email: "john@example.com",
      contact: "9999999999"
    },
    theme: {
      color: "#3399cc"
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
</script>
```

---

## 📋 5. Order Management

### Get User Orders
```javascript
GET /api/v1/orders?page=1&limit=10
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "orders": [...],
  "totalPages": 3,
  "currentPage": 1,
  "totalOrders": 25
}
```

### Get Order by ID
```javascript
GET /api/v1/orders/:orderId
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "order": {
    "_id": "order_id",
    "items": [...],
    "totalAmount": 1598,
    "status": "Processing",
    "paymentMethod": "Online",
    "address": {...}
  }
}
```

---

## ❤️ 6. Wishlist

### Add to Wishlist
```javascript
POST /api/v1/wishlist/add
Headers: Authorization: Bearer {token}

Body:
{
  "productId": "product_id"
}

Response:
{
  "success": true,
  "message": "Product added to wishlist"
}
```

### Get Wishlist
```javascript
GET /api/v1/wishlist/get
Headers: Authorization: Bearer {token}

// Optional: Filter by category
GET /api/v1/wishlist/get?category=Shiva

Response:
{
  "_id": "wishlist_id",
  "userId": "user_id",
  "products": [...],
  "cartCount": 3
}
```

### Remove from Wishlist
```javascript
DELETE /api/v1/wishlist/remove/:productId
Headers: Authorization: Bearer {token}
```

---

## 🎨 7. Categories & Sizes

### Valid Categories
```javascript
const categories = [
  "Shiva",
  "Shrooms",
  "LSD",
  "Chakras",
  "Dark",
  "Rick n Morty"
];
```

### Valid Sizes
```javascript
const sizes = ["S", "M", "L", "XL"];
```

### Order Status Values
```javascript
const orderStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];
```

---

## 🔔 8. Webhook Configuration (Backend Only)

The backend automatically handles Razorpay webhooks at:
```
POST /api/webhook/razorpay
```

**Configure in Razorpay Dashboard:**
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add webhook URL: `https://your-api-domain.com/api/webhook/razorpay`
3. Select events: `payment.authorized`, `payment.captured`, `payment.failed`, `order.paid`
4. Use the webhook secret from your `.env` file

---

## 🚨 Error Handling

### Common Error Responses

```javascript
// 400 Bad Request
{
  "success": false,
  "message": "Cart is empty"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Unauthorized. Please login."
}

// 404 Not Found
{
  "success": false,
  "message": "Product not found"
}

// 500 Server Error
{
  "success": false,
  "message": "Something went wrong",
  "error": "Error details"
}
```

---

## 📱 Complete React Example

```javascript
import React, { useState, useEffect } from 'react';
import useRazorpay from "react-razorpay";

const CheckoutPage = () => {
  const [Razorpay] = useRazorpay();
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState({});
  const token = localStorage.getItem('token');

  // Fetch cart
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const response = await fetch('http://localhost:3000/api/v1/cart/get-cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setCart(data.cart);
  };

  // COD Payment
  const handleCOD = async () => {
    const response = await fetch('http://localhost:3000/api/v1/orders/create', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        totalAmount: calculateTotal(),
        address,
        paymentMethod: 'COD'
      })
    });

    const data = await response.json();
    if (data.success) {
      alert('Order placed successfully!');
      // Navigate to success page
    }
  };

  // Online Payment
  const handleOnlinePayment = async () => {
    // Step 1: Create Razorpay order
    const response = await fetch('http://localhost:3000/api/v1/orders/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        totalAmount: calculateTotal(),
        address
      })
    });

    const data = await response.json();

    // Step 2: Open Razorpay checkout
    const options = {
      key: data.key,
      amount: data.razorpayOrder.amount,
      currency: data.razorpayOrder.currency,
      name: "T-Shirt Store",
      description: "Purchase T-Shirts",
      order_id: data.razorpayOrder.id,
      handler: async function (response) {
        // Step 3: Verify payment
        const verifyResponse = await fetch('http://localhost:3000/api/v1/orders/verify-payment', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: data.orderId
          })
        });

        const verifyData = await verifyResponse.json();
        if (verifyData.success) {
          alert('Payment successful!');
          // Navigate to success page
        }
      },
      prefill: {
        name: "John Doe",
        email: "john@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.priceSnapshot * item.quantity), 0);
  };

  return (
    <div>
      <h1>Checkout</h1>
      {/* Cart items display */}
      <div>Total: ₹{calculateTotal()}</div>
      
      {/* Address form */}
      <input 
        placeholder="Address Line 1" 
        onChange={(e) => setAddress({...address, line1: e.target.value})}
      />
      
      {/* Payment buttons */}
      <button onClick={handleCOD}>Pay on Delivery</button>
      <button onClick={handleOnlinePayment}>Pay Online</button>
    </div>
  );
};

export default CheckoutPage;
```

---

## 🔧 Environment Variables Needed

```env
# API Base URL
REACT_APP_API_URL=http://localhost:3000

# Or for production
REACT_APP_API_URL=https://your-api-domain.com
```

---

## 📝 Notes

1. **Stock Management**: Stock is automatically deducted when:
   - COD order is created
   - Online payment is verified/captured

2. **Payment Flow**:
   - COD: Direct order creation
   - Online: Create Razorpay order → User pays → Verify payment → Confirm order

3. **Webhook**: Razorpay webhooks handle payment status updates automatically

4. **Cart**: Cart is cleared after successful order creation

5. **Authentication**: Store JWT token in localStorage/sessionStorage

6. **Error Handling**: Always check `success` field in response

---

## 🆘 Support

For issues:
1. Check response `success` and `message` fields
2. Verify JWT token is valid
3. Ensure category names match exactly (case-sensitive)
4. Check stock availability before checkout
5. Verify Razorpay credentials in backend `.env`

---

**Last Updated**: January 2024
**API Version**: 1.0
**Payment Gateway**: Razorpay
