# Product Review and Rating Platform (PRRP)
**Project Code**: J05 | **Domain**: E-Commerce | **Curriculum**: MCA 2nd Year / HCLTech EdTech Program

---

## 1. Executive Summary & Tech Stack

PRRP is a full-stack e-commerce review moderation and rating aggregation platform engineered to ensure marketplace trust and transparent consumer sentiment analysis.

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Recharts, React Router v7.
- **Backend**: Java 17, Spring Boot 3.3.5, Spring Security 6 (Stateless JWT), Spring Data JPA, Hibernate, Lombok, Springdoc OpenAPI 3.
- **Database**: MySQL 8.x (3NF Normalized Schema, Views, Foreign Key cascading, B-Tree indexes).
- **Testing & Tooling**: JUnit 5, Mockito, Spring Security Test, Postman Collection.

---

## 2. Project Directory Structure

```text
sid project/
├── backend/                  # Java 17 + Spring Boot 3.x REST API
│   ├── src/main/java/com/prrp/
│   │   ├── config/           # Security and CORS configurations
│   │   ├── controller/       # Auth, Product, Review, Seller REST controllers
│   │   ├── dto/              # Strongly typed Request and Response models
│   │   ├── entity/           # JPA domain models (User, Product, Review, etc.)
│   │   ├── exception/        # GlobalExceptionHandler and domain exceptions
│   │   ├── repository/       # Spring Data JPA repositories with query logic
│   │   ├── security/         # JWT Token Provider, UserPrincipal, Filters
│   │   └── service/          # Business logic and transaction orchestration
│   ├── src/main/resources/   # application.properties (MySQL connection, JWT secret)
│   ├── src/test/java/        # JUnit 5 and Mockito test suites
│   └── pom.xml               # Maven configuration
│
├── frontend/                 # React 19 Client Application
│   ├── src/
│   │   ├── components/       # Reusable UI, Navbars, Footers, Cards, Modals
│   │   ├── context/          # AuthContext with token session handling
│   │   ├── pages/            # Customer, Seller, and Admin page views
│   │   ├── services/         # apiClient, productService, reviewService
│   │   └── data/             # Resilient fallback mock datasets
│   ├── package.json          # Vite & React dependencies
│   └── vite.config.js        # Vite bundler configuration
│
├── database/                 # Database DDL & Seed scripts
│   ├── schema.sql            # 3NF Schema DDL, Constraints, Indexes, Views
│   └── seed_data.sql         # Realistic Indian dataset with encrypted passwords
│
└── docs/                     # Deliverable Documentation
    ├── API_DOCUMENTATION.md  # Complete REST endpoint specifications
    ├── TEST_REPORT.md        # JUnit 5 test execution and defect logs
    ├── WIREFRAMES_AND_REQUIREMENTS.md # UI wireframes and user roles
    └── DEV_LOG.md            # Detailed engineering changelog and sprint log
```

---

## 3. Getting Started & Setup Guide

### Prerequisites
- **Java**: OpenJDK 17 or 21 LTS
- **Node.js**: v18+ or v20+ with `npm`
- **MySQL**: MySQL 8.0 Server (or MySQL Workbench / Docker)

---

### Step 1: Initialize Database
1. Open your MySQL client or terminal:
   ```sql
   CREATE DATABASE prrp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Execute the schema script:
   ```bash
   mysql -u root -p prrp_db < database/schema.sql
   ```
3. Execute the seed data script:
   ```bash
   mysql -u root -p prrp_db < database/seed_data.sql
   ```

---

### Step 2: Run the Spring Boot Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Ensure your MySQL credentials in `src/main/resources/application.properties` match your local setup:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will boot up at `http://localhost:8080`.*
   *Swagger API Documentation is available at: `http://localhost:8080/swagger-ui.html`*

---

### Step 3: Run the React Frontend
1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser.*

---

## 4. Test Accounts & Credentials

All test accounts share the common password: **`Password@123`**

| Role | Name | Email | Password | Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Vikramaditya Sharma | `admin@prrp.in` | `Password@123` | Review Moderation Queue (Approve / Reject) |
| **Seller** | Aarav Infotech Ltd | `contact@aaravtech.in` | `Password@123` | Seller Dashboard, Reputation Analytics |
| **Seller** | Desi Crafts & Home Decor | `support@desicrafts.com` | `Password@123` | Catalog & Review Tracking |
| **Customer** | Rohan Verma | `rohan.verma@gmail.com` | `Password@123` | Browsing, Rating 1-5 Stars, Writing Reviews |
| **Customer** | Priya Sundaram | `priya.sundaram@yahoo.co.in` | `Password@123` | Product Reviews & Personal History |

---

## 5. Agile Deliverables (J05 Epic Mapping)

- **Sprint 0**: Project setup, 3NF database schema, seed data, wireframes (`v0.1.0`).
- **Sprint 1**: Review submission, moderation workflow, rating aggregation engine (`v0.2.0`).
- **Sprint 2**: Product filtering, keyword search, custom ranking algorithms (`v0.3.0`).
- **Sprint 3**: User profile management, test reports, final documentation release (`v1.0.0`).
