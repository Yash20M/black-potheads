# Offers System - Frontend Integration Guide

Complete guide for integrating the Offers/Promotions system in your T-Shirt Store.

## 📋 Overview

The Offers system allows admins to create promotional banners/posters with:
- Offer name and description
- Promotional image/poster
- Category-specific offers
- Original price and discount percentage
- Validity period (from/until dates)
- Active/Inactive status

## 🔑 Base URL
```
Development: http://localhost:3000
Production: https://your-api-domain.com
```

---

## 👥 USER ENDPOINTS (Public)

### 1. Get Active Offers

Get all currently active and valid offers.

```javascript
GET /api/v1/offers/active

// Optional: Filter by category
GET /api/v1/offers/active?category=Shiva

Query Parameters:
- category (optional): Filter by T-shirt category (Shiva, Shrooms, LSD, Chakras, Dark, Rick n Morty)

Response:
{
  "success": true,
  "offers": [
    {
      "_id": "offer_id",
      "name": "Shiva Collection Sale",
      "description": "Get 30% off on all Shiva themed T-shirts this week!",
      "image": {
        "public_id": "offers/shiva_sale",
        "url": "https://cloudinary.com/image.jpg"
      },
      "category": "Shiva",
      "originalPrice": 799,
      "discountPercentage": 30,
      "discountedPrice": 559,
      "validFrom": "2024-01-15T00:00:00.000Z",
      "validUntil": "2024-01-22T23:59:59.000Z",
      "isActive": true,
      "isValid": true,
      "termsAndConditions": "Valid on all Shiva category products",
      "createdAt": "2024-01-10T10:00:00.000Z"
    }
  ],
  "totalOffers": 3
}
```

### 2. Get Offer by ID

Get details of a specific offer.

```javascript
GET /api/v1/offers/:offerId

Response:
{
  "success": true,
  "offer": {
    "_id": "offer_id",
    "name": "Shiva Collection Sale",
    "description": "Get 30% off on all Shiva themed T-shirts!",
    "image": {
      "public_id": "offers/shiva_sale",
      "url": "https://cloudinary.com/image.jpg"
    },
    "category": "Shiva",
    "originalPrice": 799,
    "discountPercentage": 30,
    "discountedPrice": 559,
    "validFrom": "2024-01-15T00:00:00.000Z",
    "validUntil": "2024-01-22T23:59:59.000Z",
    "isActive": true,
    "isValid": true,
    "termsAndConditions": "Valid on all Shiva category products"
  }
}
```

---

## 🔐 ADMIN ENDPOINTS

All admin endpoints require authentication:
```javascript
Headers: {
  'Authorization': 'Bearer {admin_token}'
}
```

### 1. Create Offer

Create a new promotional offer.

```javascript
POST /api/admin/offers
Headers: 
  Authorization: Bearer {admin_token}
  Content-Type: multipart/form-data

Body (FormData):
{
  "name": "Shiva Collection Sale",
  "description": "Get 30% off on all Shiva themed T-shirts this week!",
  "image": File, // Image file (required)
  "category": "Shiva",
  "originalPrice": 799,
  "discountPercentage": 30,
  "validFrom": "2024-01-15T00:00:00.000Z",
  "validUntil": "2024-01-22T23:59:59.000Z",
  "termsAndConditions": "Valid on all Shiva category products",
  "isActive": true // optional, defaults to true
}

Response:
{
  "success": true,
  "message": "Offer created successfully",
  "offer": {
    "_id": "offer_id",
    "name": "Shiva Collection Sale",
    "discountedPrice": 559, // Auto-calculated
    ...
  }
}
```

### 2. Get All Offers (Admin)

Get all offers with pagination and filters.

```javascript
GET /api/admin/offers?page=1&limit=10&category=Shiva&isActive=true

Query Parameters:
- page (optional): Page number (default: 1)
- limit (optional): Items per page (default: 10)
- category (optional): Filter by category
- isActive (optional): Filter by active status (true/false)

Response:
{
  "success": true,
  "offers": [...],
  "currentPage": 1,
  "totalPages": 3,
  "totalOffers": 25
}
```

### 3. Update Offer

Update an existing offer.

```javascript
PUT /api/admin/offers/:offerId
Headers: 
  Authorization: Bearer {admin_token}
  Content-Type: multipart/form-data

Body (FormData) - All fields optional:
{
  "name": "Updated Offer Name",
  "description": "Updated description",
  "image": File, // New image (optional)
  "category": "Shrooms",
  "originalPrice": 899,
  "discountPercentage": 40,
  "validFrom": "2024-01-20T00:00:00.000Z",
  "validUntil": "2024-01-27T23:59:59.000Z",
  "termsAndConditions": "Updated terms",
  "isActive": false
}

Response:
{
  "success": true,
  "message": "Offer updated successfully",
  "offer": {...}
}
```

### 4. Delete Offer

Delete an offer permanently.

```javascript
DELETE /api/admin/offers/:offerId
Headers: Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "message": "Offer deleted successfully"
}
```

### 5. Toggle Offer Status

Activate or deactivate an offer.

```javascript
PATCH /api/admin/offers/:offerId/toggle
Headers: Authorization: Bearer {admin_token}

Response:
{
  "success": true,
  "message": "Offer activated successfully",
  "offer": {
    "_id": "offer_id",
    "isActive": true,
    ...
  }
}
```

---

## 💻 FRONTEND IMPLEMENTATION

### React Example - Display Active Offers

```jsx
import React, { useState, useEffect } from 'react';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchOffers();
  }, [selectedCategory]);

  const fetchOffers = async () => {
    try {
      const url = selectedCategory 
        ? `http://localhost:3000/api/v1/offers/active?category=${selectedCategory}`
        : 'http://localhost:3000/api/v1/offers/active';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeLeft = (validUntil) => {
    const difference = new Date(validUntil) - new Date();
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Ending soon';
  };

  if (loading) return <div>Loading offers...</div>;

  return (
    <div className="offers-container">
      <h1>Current Offers & Promotions</h1>
      
      {/* Category Filter */}
      <select 
        value={selectedCategory} 
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Shiva">Shiva</option>
        <option value="Shrooms">Shrooms</option>
        <option value="LSD">LSD</option>
        <option value="Chakras">Chakras</option>
        <option value="Dark">Dark</option>
        <option value="Rick n Morty">Rick n Morty</option>
      </select>

      {/* Offers Grid */}
      <div className="offers-grid">
        {offers.map(offer => (
          <div key={offer._id} className="offer-card">
            <img 
              src={offer.image.url} 
              alt={offer.name}
              className="offer-image"
            />
            <div className="offer-content">
              <h2>{offer.name}</h2>
              <p className="category-badge">{offer.category}</p>
              <p className="description">{offer.description}</p>
              
              <div className="price-section">
                <span className="original-price">₹{offer.originalPrice}</span>
                <span className="discounted-price">₹{offer.discountedPrice}</span>
                <span className="discount-badge">{offer.discountPercentage}% OFF</span>
              </div>
              
              <p className="validity">
                {calculateTimeLeft(offer.validUntil)}
              </p>
              
              {offer.termsAndConditions && (
                <p className="terms">{offer.termsAndConditions}</p>
              )}
              
              <button 
                onClick={() => window.location.href = `/products?category=${offer.category}`}
                className="shop-now-btn"
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 && (
        <p className="no-offers">No active offers at the moment</p>
      )}
    </div>
  );
};

export default OffersPage;
```

### React Example - Admin Create Offer

```jsx
import React, { useState } from 'react';

const CreateOfferForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Shiva',
    originalPrice: '',
    discountPercentage: '',
    validFrom: '',
    validUntil: '',
    termsAndConditions: '',
    isActive: true
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3000/api/admin/offers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        alert('Offer created successfully!');
        // Reset form or redirect
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Failed to create offer');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-offer-form">
      <h2>Create New Offer</h2>

      <input
        type="text"
        placeholder="Offer Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />

      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        required
      />

      <select
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
        required
      >
        <option value="Shiva">Shiva</option>
        <option value="Shrooms">Shrooms</option>
        <option value="LSD">LSD</option>
        <option value="Chakras">Chakras</option>
        <option value="Dark">Dark</option>
        <option value="Rick n Morty">Rick n Morty</option>
      </select>

      <input
        type="number"
        placeholder="Original Price"
        value={formData.originalPrice}
        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
        required
      />

      <input
        type="number"
        placeholder="Discount Percentage"
        min="0"
        max="100"
        value={formData.discountPercentage}
        onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})}
        required
      />

      <div className="date-inputs">
        <label>
          Valid From:
          <input
            type="datetime-local"
            value={formData.validFrom}
            onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
            required
          />
        </label>

        <label>
          Valid Until:
          <input
            type="datetime-local"
            value={formData.validUntil}
            onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
            required
          />
        </label>
      </div>

      <textarea
        placeholder="Terms and Conditions (optional)"
        value={formData.termsAndConditions}
        onChange={(e) => setFormData({...formData, termsAndConditions: e.target.value})}
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
        />
        Active
      </label>

      <div className="image-upload">
        <label>Offer Image (Poster):</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {preview && (
          <img src={preview} alt="Preview" className="image-preview" />
        )}
      </div>

      <button type="submit">Create Offer</button>
    </form>
  );
};

export default CreateOfferForm;
```

### React Example - Admin Offers List

```jsx
import React, { useState, useEffect } from 'react';

const AdminOffersList = () => {
  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOffers();
  }, [page]);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `http://localhost:3000/api/admin/offers?page=${page}&limit=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        setOffers(data.offers);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const toggleStatus = async (offerId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `http://localhost:3000/api/admin/offers/${offerId}/toggle`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchOffers(); // Refresh list
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const deleteOffer = async (offerId) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(
        `http://localhost:3000/api/admin/offers/${offerId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();
      if (data.success) {
        fetchOffers(); // Refresh list
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  return (
    <div className="admin-offers-list">
      <h2>Manage Offers</h2>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Discount</th>
            <th>Valid Until</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.map(offer => (
            <tr key={offer._id}>
              <td>
                <img 
                  src={offer.image.url} 
                  alt={offer.name}
                  style={{width: '100px'}}
                />
              </td>
              <td>{offer.name}</td>
              <td>{offer.category}</td>
              <td>{offer.discountPercentage}%</td>
              <td>{new Date(offer.validUntil).toLocaleDateString()}</td>
              <td>
                <span className={offer.isActive ? 'active' : 'inactive'}>
                  {offer.isActive ? 'Active' : 'Inactive'}
                </span>
                {offer.isValid && <span className="valid-badge">Valid</span>}
              </td>
              <td>
                <button onClick={() => toggleStatus(offer._id)}>
                  {offer.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => window.location.href = `/admin/offers/edit/${offer._id}`}>
                  Edit
                </button>
                <button onClick={() => deleteOffer(offer._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button 
          disabled={page === totalPages} 
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminOffersList;
```

---

## 📝 FIELD DESCRIPTIONS

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Offer title/name |
| description | String | Yes | Detailed offer description |
| image | File | Yes | Promotional poster/banner image |
| category | String | Yes | T-shirt category (Shiva, Shrooms, LSD, Chakras, Dark, Rick n Morty) |
| originalPrice | Number | Yes | Original price before discount |
| discountPercentage | Number | Yes | Discount percentage (0-100) |
| discountedPrice | Number | Auto | Calculated automatically |
| validFrom | Date | Yes | Offer start date/time |
| validUntil | Date | Yes | Offer end date/time |
| isActive | Boolean | No | Active status (default: true) |
| termsAndConditions | String | No | Offer terms and conditions |
| isValid | Boolean | Virtual | Auto-calculated based on dates and isActive |

---

## 🎨 UI/UX RECOMMENDATIONS

### User-Facing Offers Page:
1. Display offers as cards/banners with prominent images
2. Show discount percentage in a badge
3. Display countdown timer for expiring offers
4. Add "Shop Now" button linking to category page
5. Filter by category
6. Show "Valid until" date clearly

### Admin Panel:
1. List view with thumbnail images
2. Quick toggle for active/inactive status
3. Visual indicator for expired offers
4. Filter by category and status
5. Bulk actions (activate/deactivate multiple)
6. Preview before publishing

---

## ⚠️ IMPORTANT NOTES

1. **Image Upload**: Use FormData for file uploads
2. **Date Format**: Use ISO 8601 format for dates
3. **Validation**: validFrom must be before validUntil
4. **Auto-calculation**: discountedPrice is calculated automatically
5. **isValid**: Virtual field, calculated based on dates and isActive
6. **Categories**: Must match T-shirt categories exactly
7. **Admin Only**: Create/Update/Delete require admin authentication
8. **Public Access**: Active offers endpoint is public (no auth required)

---

## 🚀 QUICK START

### 1. Display Offers on Homepage:
```javascript
fetch('http://localhost:3000/api/v1/offers/active')
  .then(res => res.json())
  .then(data => {
    // Display data.offers
  });
```

### 2. Create Offer (Admin):
```javascript
const formData = new FormData();
formData.append('name', 'Summer Sale');
formData.append('description', '50% off!');
formData.append('image', imageFile);
formData.append('category', 'Shiva');
formData.append('originalPrice', 799);
formData.append('discountPercentage', 50);
formData.append('validFrom', '2024-06-01T00:00:00Z');
formData.append('validUntil', '2024-06-30T23:59:59Z');

fetch('http://localhost:3000/api/admin/offers', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  },
  body: formData
});
```

---

## 📞 SUPPORT

For issues or questions:
- Check response `success` and `message` fields
- Verify admin token for admin endpoints
- Ensure image file is included for create/update
- Validate date formats (ISO 8601)
- Check category names match exactly

---

**Last Updated**: January 2024
**API Version**: 1.0
