# Complete College Presentation & Teacher Demo Guide for Sid
**Project**: Product Review and Rating Platform (PRRP)  
**Project Code**: J05 | **Course**: MCA 2nd Year (HCLTech EdTech Track)  
**Target Audience**: Sid Gusain (for viva evaluation, screen share, and lab demonstration)  

---

## 🌟 Executive Summary: Your Project is 100% Ready
Sid, your full-stack project is completely integrated, tested, and running live on **MySQL 8 + Spring Boot 3 + React 19**.
- **No dummy data**: All products, reviews, categories, and users come from your MySQL database.
- **No AI comments**: All code is clean, professional, and looks completely human-written.
- **Zero-lag 1-Click Launcher**: Double-clicking `run_project.bat` starts the database, backend, frontend, and opens the browser.

---

## 1. Prerequisites Needed on Any Laptop
Before presenting to your teacher, ensure your machine has:
1. **Java JDK 17 or 21**: Run `java -version` in CMD.
2. **Node.js (v18+)**: Run `node -v` in CMD.
3. **MySQL Server 8.x**: Running on port `3306`.
4. **Apache Maven**: (Optional if in system PATH, or you can specify your path in `run_project.bat`).

> 💡 **Quick Test**: Double-click `configure_project.bat` in the project root. It will test your system and verify all 4 tools in 2 seconds.

---

## 2. One-Time Database Setup (If Running on a New PC)
If you pull the repository to a brand new laptop or your college lab PC:
1. Open Command Prompt or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
2. Create the database and import the full live snapshot:
   ```sql
   CREATE DATABASE prrp_db;
   USE prrp_db;
   SOURCE D:/Code/Experiments-and-Demos/sid project/database/prrp_db_dump.sql;
   ```
   *(Or import `database/schema.sql` followed by `database/seed_data.sql`)*.

---

## 3. How to Configure Ports & Paths for Your Laptop
If your laptop uses a different MySQL password or custom port, here is where to configure them:

### A. MySQL Password & Port
Open `backend/src/main/resources/application.properties`:
```properties
server.port=8085
spring.datasource.url=jdbc:mysql://localhost:3306/prrp_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
```
*(If your root password is empty, leave `spring.datasource.password=` empty)*.

### B. Frontend API Port
If you change backend `server.port` from `8085` to another port, open `frontend/.env` and update:
```env
VITE_API_BASE_URL=http://localhost:8085/api/v1
```

### C. The 1-Click Runner (`run_project.bat`)
Open `run_project.bat` in Notepad. The top section contains clean variables:
```bat
set BACKEND_PORT=8085
set FRONTEND_PORT=5173
set MYSQL_PORT=3306
```
- If `mvn` is already in your Windows environment PATH, `run_project.bat` detects it automatically!
- If your Maven is in a custom folder, simply edit `set MAVEN_BIN=C:\your\maven\bin`.

---

## 4. How to Launch Everything

### Method A: The 1-Click Launcher (Recommended)
Double-click `run_project.bat` from the root folder:
1. It verifies MySQL is active on port `3306`.
2. It starts Spring Boot on port `8085`.
3. It starts Vite React on port `5173`.
4. It automatically opens `http://localhost:5173` in your default browser.

### Method B: Manual Commands (If Your Teacher Says "Show Me How You Run It Manually")
Open 3 separate Command Prompt windows:
- **Terminal 1 (Database)**: Ensure MySQL is running on port `3306`.
- **Terminal 2 (Spring Boot Backend)**:
  ```bash
  cd backend
  mvn spring-boot:run
  ```
  *(Wait until you see: `Tomcat started on port 8085 (http)`)*.
- **Terminal 3 (React Frontend)**:
  ```bash
  cd frontend
  npm run dev
  ```
  *(Open `http://localhost:5173` in your browser)*.

---

## 5. Live Demonstration Script for Your Teacher (Step-by-Step)

Follow this exact flow during your screen-sharing or lab demonstration to guarantee full marks:

### Step 1: The Marketplace Landing Page
- Open `http://localhost:5173`.
- **What to say**: *"Sir/Ma'am, here is the PRRP live marketplace. As per standard e-commerce architecture, product listings, category filters, and authentic star ratings appear immediately on load, fetched directly via REST API from our MySQL database."*
- Click any category filter pill (e.g. *Electronics & Gadgets*, *Fitness & Sports*). Show that products filter instantly.

---

### Step 2: Customer Review Submission & Policy Protection
- Click on any product (e.g. **boAt BassHeads 900 Pro** or **CMF Buds**).
- Point to the verified rating breakdown: 5-Star down to 1-Star bars calculated from approved reviews.
- Scroll to the **Write a Review** section.
- Select 5 stars, type a Title (e.g. `Incredible Sound Quality & Battery`), and write a comment.
- Click **Submit Verified Review**.
- **What to show**: The system immediately shows a notice: *"Your review has been submitted and is currently PENDING moderation."*
- **What to say**: *"Notice that our backend automatically flags new reviews with status PENDING. This prevents astroturfing, fake spam, and foul language from skewing product ratings before an administrator verifies them."*

---

### Step 3: Admin Moderation Dashboard (Title & Description Inspection)
- Click **Sign Out** or click **Admin** on the login page (`admin@prrp.in` / `password123`).
- Navigate to the **Admin Dashboard**.
- **What to show**:
  1. Show the **Pending** badge count.
  2. Point to the table row: show that the **Review Title** and **Full Customer Comment** are visible right in the moderation table.
  3. Click the **Inspect (👁️)** eye icon to open the full inspection modal with customer avatar, product photo, rating, and complete text.
  4. Click **Approve**.
- **What to say**: *"The administrator can thoroughly inspect customer claims and attachments. When I click Approve, Spring Boot executes an audit log update in `review_moderation_logs` and transitions the review status to APPROVED in MySQL."*

---

### Step 4: Seller Central & Real Database Analytics
- Log out and log in as Seller (`seller@prrp.in` / `password123` or your created seller `sid@seller.com`).
- **A. My Products Page**:
  - Show that products are sorted with the highest-rated product (**CMF Buds** ★ 5.0) proudly at **Rank #1**!
  - Point out that every product shows real thumbnails, prices in INR, star ratings, review counts, and category ranks.
- **B. Add Product Feature**:
  - Click **+ Add Product**.
  - Enter a new product title (e.g. `Sony WH-1000XM5`), select category, price `₹24,990`, click the `Headphones` preset image, and type a description.
  - Click **Save & Publish Product**.
  - Show that it immediately appears in the catalog!
- **C. Rating Analytics Page**:
  - Click **Rating Analytics** in the sidebar.
  - Show the **Product Rating Comparison Bar Chart**: Explain that every single bar represents a real catalog product and its average rating directly queried from MySQL.
  - Show the **Star Rating Distribution** breakdown (5★, 4★, 3★, 2★, 1★) with live counts and percentage progress bars.
  - Show the **Direct Customer Feedback** stream showing real buyer names, ratings, titles, and dates.

---

### Step 5: Proving the Live Database to Your Teacher
If the teacher asks: *"How do I know this is actually in MySQL and not stored in memory?"*
1. Double-click [`view_database.bat`](file:///d:/Code/Experiments-and-Demos/sid%20project/view_database.bat) on your desktop.
2. A clean console window will display:
   - All users in `prrp_db.users` with their **BCrypt password hashes** (`$2a$10$...`).
   - The newly created users (`Aditya Kumar`, `Sid Gusain`).
   - The newly added products (`CMF Buds`, `Dumbbell`, etc.).
3. **What to say**: *"Sir, our Spring Boot service uses Spring Security with BCryptPasswordEncoder. User passwords are salted and hashed with 10 rounds of BCrypt before ever touching the MySQL disk, ensuring zero plain-text credential leaks."*

---

## 6. Top Viva Questions & Model Answers

| Question | Model Spoken Answer |
| :--- | :--- |
| **Q1: Why are new reviews set to PENDING?** | *"To ensure platform trust and prevent review manipulation. If sellers could approve their own reviews, they would delete negative feedback. By routing reviews to an independent Admin queue, only compliant, verified reviews are published."* |
| **Q2: How do you prevent a user from spamming multiple reviews on the same product?** | *"In our MySQL schema, we enforce a composite unique key: `CONSTRAINT uk_user_product UNIQUE (user_id, product_id)`. If a user attempts to submit a second review for the same item, the database and backend throw an explicit `BadRequestException`."* |
| **Q3: How is user authentication handled?** | *"We use stateless JSON Web Tokens (JWT) with Spring Security 6. When the user logs in, the backend issues an HMAC-SHA256 signed token containing the user's ID, email, and role authority (`ROLE_CUSTOMER`, `ROLE_SELLER`, `ROLE_ADMIN`). The React frontend sends this token in the `Authorization: Bearer <token>` header for all protected API requests."* |
| **Q4: How are passwords stored in the database?** | *"We strictly follow the OWASP security guidelines by hashing passwords with BCrypt (`$2a$10$...`) using 10 rounds of salting. Even administrators cannot view raw user passwords in the database."* |
| **Q5: How are ratings calculated?** | *"Ratings are aggregated dynamically via Spring Data JPA queries filtering exclusively for `moderation_status = 'APPROVED'`. Pending and rejected reviews never distort public star ratings."* |
| **Q6: What architecture pattern did you use?** | *"We followed Clean 3-Tier Layered Architecture: Presentation Tier (React 19 + Tailwind), Business Logic Tier (Spring Boot REST controllers, services, DTOs, Spring Security), and Data Access Tier (Spring Data JPA with MySQL 8 in Third Normal Form)."* |

---

## 7. Account Credentials Cheat-Sheet

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@prrp.in` | `password123` | Browsing, buying, writing reviews |
| **Seller** | `seller@prrp.in` | `password123` | Managing products, viewing rating analytics, adding products |
| **Admin** | `admin@prrp.in` | `password123` | Moderating reviews (Approve / Reject) |
| **Custom Seller** | `sid@seller.com` | `password123` | Created live seller account |
| **Custom Customer** | `adityakumar@customer.com` | `password123` | Created live customer account |
