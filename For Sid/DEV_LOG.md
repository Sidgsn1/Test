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
- **ReviewService**:
  - Enforces review submission workflow defaulting new submissions to `PENDING`.
  - Restricts duplicate reviews using `(user_id, product_id)` checks.
  - Administrative moderation workflow: Approves or rejects reviews while persisting an audit record in `review_moderation_logs`.
  - Enables customers to edit/delete their own submissions (edits automatically reset status to `PENDING`).
- **SellerService**:
  - Generates seller dashboard metrics: product catalog count, approved vs pending review tallies, and seller-level rating distributions.

### C. REST API Endpoints
- `POST /api/v1/auth/login` - User authentication and JWT retrieval.
- `POST /api/v1/auth/register` - User signup with role assignment.
- `GET /api/v1/auth/me` - Authenticated profile inspection.
- `GET /api/v1/products` - Catalog search, filter, and pagination.
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

### D. Automated Quality Assurance & Testing
- Unit test suite (`ReviewServiceTest.java`) using JUnit 5 and Mockito:
  - Verifies new review submissions strictly initialize with `PENDING` moderation status.
  - Validates rejection of duplicate review submissions for identical product and customer combinations.

---

## 4. Full-Stack Client-Server Integration (Sprint 3 - Step D)
- **Centralized HTTP Client (`apiClient.js`)**:
  - Built an async fetch transport handler with interceptors that automatically injects `Authorization: Bearer <token>` from local storage.
  - Standardized error parsing for unified user feedback across React pages.
- **Service Layer Bridge**:
  - `productService.js`: Connected to `/api/v1/products`, supporting category slugs, rating thresholds, keyword search, and custom rankings.
  - `reviewService.js`: Connected to review submission (`POST /api/v1/reviews`), product review streams (`GET /api/v1/products/{id}/reviews`), user review histories, and administrative moderation endpoints (`PATCH /api/v1/admin/reviews/{id}/action`).
  - `sellerService.js`: Integrated with `/api/v1/sellers` endpoints for multi-seller analytics and dashboard overviews.
  - `AuthContext.jsx`: Integrated login and registration pipelines directly into Spring Security JWT issuing endpoints.
- **Resilience & Offline Handling**:
  - All client services implement clean fallback strategies that ensure the UI runs smoothly whether testing against a live Spring Boot backend or during standalone evaluations.

---

## 5. Sprint Commit Roadmap
- Sprint 0: Repository structuring, 3NF database schema, seed data, and Spring Boot skeleton (`v0.1.0`).
- Sprint 1: Review submission, administrative moderation workflow, and rating aggregation engine (`v0.2.0`).
- Sprint 2: Multi-criteria product catalog filtering and ranking algorithms (`v0.3.0`).
- Sprint 3: User profiles, security hardening, automated test suites, and final release packaging (`v1.0.0`).
