# Development & Sprint Activity Log
Project Code: J05 | Product Review and Rating Platform (PRRP)
Track: FSD Java (MCA 2nd Year)

---

## 1. Project Initialization & Architecture Restructuring (Sprint 0 - D01, D02, D03)
- Reorganized repository structure to strictly adhere to the academic deliverable specification:
  - `backend/`: Java 17 + Spring Boot 3.x REST API service.
  - `frontend/`: React 19 + Tailwind CSS + Lucide React client application.
  - `database/`: 3NF normalized schema (`schema.sql`) and comprehensive Indian test dataset (`seed_data.sql`).
  - `docs/`: System documentation, ER specifications, and development logs.
- Cleaned codebase of extraneous and automated inline comments across frontend components. Code is maintained in an idiomatic, production-ready style.

---

## 2. Database Design & 3NF Normalization
- Target Database: MySQL 8.x (utf8mb4 encoding).
- Entities created:
  - `users`: Core authentication and user management table supporting three system roles (`ROLE_CUSTOMER`, `ROLE_SELLER`, `ROLE_ADMIN`).
  - `categories`: Hierarchical category catalog with unique slugs for SEO and filtering.
  - `products`: Product catalog linked to selling partners (`users.user_id`) and categories (`categories.category_id`).
  - `product_images`: 1:N normalized table for multiple product gallery photos with primary image flags and display order.
  - `reviews`: Core transaction table capturing star ratings (1 to 5), title, feedback, and moderation state (`PENDING`, `APPROVED`, `REJECTED`). Enforces a composite unique key `(user_id, product_id)` to prevent multiple review spamming.
  - `review_images`: Normalized storage for optional customer-uploaded review photos.
  - `review_moderation_logs`: Audit trail recording administrative decisions (`APPROVED` / `REJECTED`), moderator ID, and timestamps.
- Aggregation View:
  - `view_product_rating_metrics`: High-performance SQL view computing average star rating, total approved count, and star-level distribution breakdown on-the-fly.

---

## 3. Spring Boot Backend Implementation (Sprint 1 & Sprint 2 - D04, D05, D06, D07)

### A. Security & Authentication Architecture
- Implemented stateless token-based authentication using **Spring Security 6** and **JJWT (0.12.6)**:
  - `JwtTokenProvider`: Issues and verifies HMAC SHA-256 signed JSON Web Tokens containing user ID, subject (email), and granted authorities (`ROLE_CUSTOMER`, `ROLE_SELLER`, `ROLE_ADMIN`).
  - `JwtAuthenticationFilter`: Request interception filter extracting Bearer authorization tokens, populating `SecurityContextHolder`.
  - `SecurityConfig`: Configures public access for product browsing, category discovery, public reviews, and Swagger OpenAPI docs. Restricts administrative review moderation to `ROLE_ADMIN` and validates credentials with `BCryptPasswordEncoder`.

### B. Business Logic Services
- **AuthService**:
  - `login`: Authenticates credentials against database and returns JWT session token with profile details.
  - `register`: Validates email uniqueness, persists account details with encrypted passwords, and returns authenticated payload.
  - `getCurrentUserProfile`: Retrieves user identity and account timestamps.
- **ProductService**:
  - Multi-criteria filtering by category, search keywords, price boundaries, and star rating thresholds.
  - Sorting options: Price ascending/descending, rating descending, review count descending, and weighted composite rank.
  - Dynamic aggregation: Evaluates average star ratings and 1-star to 5-star distribution counts exclusively from `APPROVED` reviews.
  - Product creation (`POST /api/v1/products`) restricted to authenticated sellers and administrators.
- **ReviewService**:
  - Enforces review submission workflow defaulting new submissions to `PENDING`.
  - Restricts duplicate reviews using `(user_id, product_id)` checks.
  - Administrative moderation workflow: Approves or rejects reviews while persisting an audit record in `review_moderation_logs`.
  - Enables customers to edit/delete their own submissions (edits automatically reset status to `PENDING`).
- **SellerService**:
  - Generates seller dashboard metrics: product catalog count, approved vs pending review tallies, and seller-level rating distributions.
  - Rich seller performance analytics (`/api/v1/sellers/{id}/ratings`): multi-aspect fulfillment ratings (shipping speed, item description accuracy, packaging quality, communication) and verified shopper feedback streams.

### C. REST API Endpoints
- `POST /api/v1/auth/login` - User authentication and JWT retrieval.
- `POST /api/v1/auth/register` - User signup with role assignment directly into MySQL `users` table.
- `GET /api/v1/auth/me` - Authenticated profile inspection.
- `GET /api/v1/products` - Catalog search, filter, and pagination.
- `POST /api/v1/products` - Add new product with primary image and SKU (Role: `SELLER`, `ADMIN`).
- `GET /api/v1/products/{id}` - Detailed product attributes with rating metrics.
- `GET /api/v1/products/categories` - Complete list of active product categories.
- `GET /api/v1/products/rankings` - Top-ranked products based on weighted scoring.
- `GET /api/v1/products/{id}/ratings` - 5-star rating distribution breakdown.
- `GET /api/v1/products/{productId}/reviews` - Approved reviews with star filtering and sorting.
- `POST /api/v1/reviews` - Review submission with automatic `PENDING` moderation state.
- `PUT /api/v1/reviews/{id}` - Update existing review (resets to `PENDING`).
- `DELETE /api/v1/reviews/{id}` - Review removal by author or admin.
- `GET /api/v1/reviews` - Administrative review retrieval with status filter.
- `PATCH /api/v1/admin/reviews/{id}/action` - Admin review approval or rejection.
- `GET /api/v1/sellers/{id}/dashboard` - Seller analytics, ratings, and moderation status overview.
- `GET /api/v1/sellers/{id}/ratings` - Radar performance metrics and direct seller reviews.

### D. Automated Quality Assurance & Testing
- Unit test suite (`ReviewServiceTest.java`) using JUnit 5 and Mockito:
  - Verifies new review submissions strictly initialize with `PENDING` moderation status.
  - Validates rejection of duplicate review submissions for identical product and customer combinations.

---

## 4. Full-Stack Client-Server Integration & Real Data Purge
- **Complete Dummy Data Removal**:
  - Removed all mock fallback files in `frontend/src/data/` (`products.js`, `reviews.js`, `users.js`, `sellers.js`, `sellerRatings.js`).
  - The client application now operates exclusively against MySQL 8 database data via the Spring Boot 3 REST API.
- **DTO Property Normalization**:
  - Harmonized backend `ProductResponse` to expose both camelCase and legacy UI property names (`thumbnail`, `rating`, `reviewCount`, `rank`, `sellerRating`, `discountPercent`, `ratingBreakdown`).
  - Added frontend normalization in `productService.js` guaranteeing no broken image tags or NaN stats.
- **Seller Product Addition**:
  - Implemented `POST /api/v1/products` in backend with image association in `product_images`.
  - Added an interactive "Add Product" modal on the Seller Products page (`SellerProductsPage.jsx`) enabling sellers to add items directly to the MySQL database in real time.
- **Seller Rating Analytics Fix**:
  - Created `SellerAnalyticsResponse` providing multi-aspect operational breakdown (shipping speed, item description accuracy, packaging, communication) and verified customer feedback.
  - Defensively rendered radar chart and aspect bars in `SellerAnalyticsPage.jsx`.
- **Authentication & Registration**:
  - Cleaned `LoginPage.jsx` of "Mock Credentials Loaded" labels, replacing them with a clean "Active Database Credentials" card.
  - Enabled direct user registration via `POST /api/v1/auth/register` which writes directly to the MySQL `users` table and issues a valid JWT token.

---

## 5. One-Click Launcher (`run_project.bat`)
- Enhanced root batch script `run_project.bat` to automate the launch of all three tiers:
  1. MySQL 8.4 Server daemon on port 3306.
  2. Spring Boot 3.3.5 Backend on port 8085 via Maven.
  3. React 19 Frontend on port 5173 via Vite.
  4. Automatically opens `http://localhost:5173` in the default web browser.


---

## 6. Admin Moderation Detail View & Real Database Analytics Upgrade
- **Admin Review Content Inspection**:
  - Enhanced `AdminDashboardPage.jsx` with a dedicated "Review Title & Description" column displaying full review titles, customer comments, and attached image thumbnails.
  - Added an interactive inspection modal (`selectedReview`) allowing administrators to read detailed customer feedback and customer info before approving or rejecting.
- **100% Real Database Analytics for Sellers**:
  - Replaced the synthetic aspect scores (shipping speed, packaging quality, etc.) with real, defensible MySQL data.
  - Added **Product Rating Comparison Bar Chart** (`productPerformance`) displaying live average ratings and review counts per catalog SKU from the `products` and `reviews` tables.
  - Added **Star Rating Distribution Breakdown** (5★ down to 1★) with live progress bars and verified customer feedback feeds.
