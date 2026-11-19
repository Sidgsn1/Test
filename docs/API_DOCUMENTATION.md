# API Documentation
Project Code: J05 | Product Review and Rating Platform (PRRP)
Base URL: `http://localhost:8080/api/v1`

---

## 1. Authentication Endpoints

### 1.1 Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "admin@prrp.in",
  "password": "Password@123"
}
```
- **Response** (`200 OK`):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 1,
  "fullName": "Vikramaditya Sharma",
  "email": "admin@prrp.in",
  "role": "ROLE_ADMIN"
}
```

### 1.2 User Registration
- **URL**: `/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
```json
{
  "fullName": "Rahul Deshmukh",
  "email": "rahul.deshmukh@gmail.com",
  "password": "Password@123",
  "phoneNumber": "+919876543210",
  "role": "ROLE_CUSTOMER",
  "city": "Pune",
  "state": "Maharashtra"
}
```
- **Response** (`201 Created`):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 11,
  "fullName": "Rahul Deshmukh",
  "email": "rahul.deshmukh@gmail.com",
  "role": "ROLE_CUSTOMER"
}
```

### 1.3 Current User Profile
- **URL**: `/auth/me`
- **Method**: `GET`
- **Access**: Authenticated (`Bearer <token>`)
- **Response** (`200 OK`):
```json
{
  "id": 1,
  "fullName": "Vikramaditya Sharma",
  "email": "admin@prrp.in",
  "phoneNumber": "+919811001122",
  "role": "ROLE_ADMIN",
  "city": "New Delhi",
  "state": "Delhi",
  "createdAt": "2026-02-01T10:00:00"
}
```

---

## 2. Product Catalog Endpoints

### 2.1 Search and Filter Products
- **URL**: `/products`
- **Method**: `GET`
- **Access**: Public
- **Query Parameters**:
  - `categoryId` (optional, Long): Filter by category ID.
  - `minPrice` (optional, Decimal): Minimum price boundary.
  - `maxPrice` (optional, Decimal): Maximum price boundary.
  - `keyword` (optional, String): Search term matching name or description.
  - `sortBy` (optional, String): `featured`, `price-low`, `price-high`, `rating-desc`, `reviews-desc`.
  - `page` (optional, Integer, default: 0)
  - `size` (optional, Integer, default: 20)
- **Response** (`200 OK`):
```json
{
  "content": [
    {
      "id": 1,
      "name": "boAt BassHeads 900 Pro Wired Headphones",
      "description": "High fidelity over-ear wired headphones with 40mm Neodymium dynamic drivers...",
      "price": 1499.00,
      "sku": "ELC-BOAT-900",
      "isAvailable": true,
      "categoryId": 1,
      "categoryName": "Electronics & Gadgets",
      "sellerId": 2,
      "sellerName": "Aarav Infotech Ltd",
      "primaryImageUrl": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      "images": ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"],
      "averageRating": 4.7,
      "totalReviews": 3,
      "ratingDistribution": {
        "5": 2,
        "4": 1,
        "3": 0,
        "2": 0,
        "1": 0
      }
    }
  ],
  "totalElements": 1,
  "totalPages": 1
}
```

### 2.2 Product Details
- **URL**: `/products/{id}`
- **Method**: `GET`
- **Access**: Public
- **Response** (`200 OK`): Product response object.

### 2.3 Product Categories
- **URL**: `/products/categories`
- **Method**: `GET`
- **Access**: Public
- **Response** (`200 OK`): Array of category objects.

### 2.4 Product Rankings
- **URL**: `/products/rankings?categoryId={optionalId}`
- **Method**: `GET`
- **Access**: Public
- **Response** (`200 OK`): Products sorted by weighted performance algorithm.

---

## 3. Review Submission & Moderation Endpoints

### 3.1 Get Approved Product Reviews
- **URL**: `/products/{productId}/reviews`
- **Method**: `GET`
- **Access**: Public
- **Query Parameters**:
  - `ratingFilter` (optional, Integer): 1 to 5.
  - `sortBy` (optional, String): `newest`, `highest`, `lowest`.
- **Response** (`200 OK`): List of approved reviews.

### 3.2 Submit a Review
- **URL**: `/reviews`
- **Method**: `POST`
- **Access**: Authenticated (`CUSTOMER`)
- **Request Body**:
```json
{
  "productId": 1,
  "rating": 5,
  "title": "Unbeatable sound quality",
  "comment": "Crisp highs, deep bass, and comfortable fit for daily commute.",
  "imageUrls": ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500"]
}
```
- **Response** (`201 Created`):
```json
{
  "id": 14,
  "productId": 1,
  "productName": "boAt BassHeads 900 Pro Wired Headphones",
  "userId": 5,
  "userName": "Rohan Verma",
  "rating": 5,
  "title": "Unbeatable sound quality",
  "comment": "Crisp highs, deep bass...",
  "moderationStatus": "PENDING",
  "createdAt": "2026-03-01T12:00:00"
}
```

### 3.3 Admin Review Moderation Action
- **URL**: `/admin/reviews/{id}/action`
- **Method**: `PATCH`
- **Access**: Authenticated (`ADMIN` role required)
- **Request Body**:
```json
{
  "action": "APPROVED",
  "remarks": "Verified customer feedback complying with community guidelines."
}
```
- **Response** (`200 OK`): Updated review with status `APPROVED` or `REJECTED`.

---

## 4. Seller Portal Endpoints

### 4.1 Seller Dashboard Analytics
- **URL**: `/sellers/{id}/dashboard`
- **Method**: `GET`
- **Access**: Public / Authenticated
- **Response** (`200 OK`):
```json
{
  "sellerId": 2,
  "sellerName": "Aarav Infotech Ltd",
  "totalProducts": 3,
  "totalApprovedReviews": 6,
  "totalPendingReviews": 1,
  "totalRejectedReviews": 1,
  "averageRating": 4.2,
  "ratingDistribution": {
    "5": 3,
    "4": 2,
    "3": 1,
    "2": 0,
    "1": 0
  }
}
```
