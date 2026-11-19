# Requirements Specification & Wireframe Blueprint
Project Code: J05 | Product Review and Rating Platform (PRRP)
Deliverable: D02 (Problem Statement, User Roles, and Screen Wireframes)

---

## 1. Problem Statement & Scope

E-commerce marketplaces require authentic and trustworthy consumer feedback mechanisms while protecting platform integrity against fake submissions, abusive feedback, and unauthorized merchant tampering. 

The **Product Review and Rating Platform (PRRP)** provides:
1. Structured review submissions with 1 to 5 star ratings, feedback titles, and detailed comments.
2. An administrative moderation queue where submitted reviews remain in `PENDING` status until an authorized Admin either `APPROVES` or `REJECTS` them.
3. Automated rating metric calculations (average rating and rating distribution breakdown) that strictly calculate metrics based on approved reviews.
4. Comprehensive multi-criteria product filtering, search, and dynamic ranking algorithms.
5. Dedicated seller dashboards enabling merchants to monitor their catalog reputation and track review moderation statuses.

---

## 2. User Roles & Access Matrix

| Role | Permissions & Functional Scope |
| :--- | :--- |
| **`ROLE_CUSTOMER`** | Register, login, browse catalog with search/filters, view product details and approved reviews, submit new reviews (enters `PENDING`), update/delete personal reviews, manage customer profile. |
| **`ROLE_SELLER`** | List products, view seller dashboard analytics, track reviews for owned products (view moderation statuses: `APPROVED`, `PENDING`, `REJECTED`), monitor overall seller rating metrics. |
| **`ROLE_ADMIN`** | Access central moderation queue, view all reviews across the platform, approve or reject pending reviews with audit remarks, manage platform integrity. |

---

## 3. UI Screen Blueprints & Wireframes

### Screen 1: Home & Product Discovery Page (`/`)
```text
+-----------------------------------------------------------------------------+
| [PRRP Logo]   [Search products, brands...]      [Categories] [Login/Signup] |
+-----------------------------------------------------------------------------+
| HERO BANNER: "Discover Authentic Indian Reviews & Ratings"                  |
| [Explore Catalog Button]                                                    |
+-----------------------------------------------------------------------------+
| FEATURED CATEGORIES:                                                        |
| [Electronics]  [Home & Kitchen]  [Fitness & Sports]  [Fashion & Apparel]   |
+-----------------------------------------------------------------------------+
| TOP RATED PRODUCTS:                                                         |
| +-------------------+  +-------------------+  +-------------------+         |
| | [Product Image]   |  | [Product Image]   |  | [Product Image]   |         |
| | boAt Headphones   |  | Noise Smartwatch  |  | Jaipuri Bedsheet  |         |
| | Rs. 1,499  ★★★★☆ |  | Rs. 2,999  ★★★★☆ |  | Rs. 899   ★★★★★ |         |
| | [View Details]    |  | [View Details]    |  | [View Details]    |         |
| +-------------------+  +-------------------+  +-------------------+         |
+-----------------------------------------------------------------------------+
```

### Screen 2: Product Details & Review Submission Page (`/products/:id`)
```text
+-----------------------------------------------------------------------------+
| [Back to Products]                                                          |
| +-------------------------+  +--------------------------------------------+ |
| |                         |  | boAt BassHeads 900 Pro Wired Headphones    | |
| |   [Primary Photo]       |  | Seller: Aarav Infotech Ltd                 | |
| |                         |  | Price: Rs. 1,499.00                        | |
| | [Thumb 1] [Thumb 2]     |  | Rating: ★★★★☆ 4.7 / 5.0 (3 Reviews)       | |
| +-------------------------+  +--------------------------------------------+ |
+-----------------------------------------------------------------------------+
| RATING BREAKDOWN:                                                           |
| 5 Stars: [====================] (2)                                         |
| 4 Stars: [==========          ] (1)                                         |
| 3 Stars: [                    ] (0)                                         |
| 2 Stars: [                    ] (0)                                         |
| 1 Stars: [                    ] (0)                                         |
+-----------------------------------------------------------------------------+
| WRITE A REVIEW (Requires Customer Login):                                   |
| Rating: [ ★ ★ ★ ★ ★ ]                                                      |
| Title:   [ E.g. Great sound quality and deep bass                          ] |
| Comment: [ Detailed feedback about build, comfort, and delivery...         ] |
| [ Submit Review Button ] -> Enters "PENDING" moderation status               |
+-----------------------------------------------------------------------------+
| CUSTOMER REVIEWS (Approved Only):                                           |
| • Rohan Verma (★★★★★) - "Paisa Vasool! Outstanding Bass for Indian Music"  |
| • Priya Sundaram (★★★★☆) - "Very good sound quality, wire could be longer" |
+-----------------------------------------------------------------------------+
```

### Screen 3: Admin Review Moderation Dashboard (`/admin`)
```text
+-----------------------------------------------------------------------------+
| [PRRP Admin] Review Moderation Dashboard                     [Admin Profile]|
+-----------------------------------------------------------------------------+
| TOTAL REVIEWS: 13  |  APPROVED: 10  |  PENDING: 2  |  REJECTED: 1           |
+-----------------------------------------------------------------------------+
| FILTER STATUS: [ All ]  [ Pending (2) ]  [ Approved (10) ]  [ Rejected (1) ]|
+-----------------------------------------------------------------------------+
| Moderation Queue Table:                                                     |
| Product            Customer     Rating  Review Title     Status    Actions  |
| boAt Headphones    Simran Kaur   4★     Awaiting approv  PENDING   [✔] [✖]  |
| Boldfit Yoga Mat   Rohan Verma   5★     Value for money  PENDING   [✔] [✖]  |
+-----------------------------------------------------------------------------+
```

### Screen 4: Seller Dashboard (`/seller/dashboard`)
```text
+-----------------------------------------------------------------------------+
| [Seller Hub] Aarav Infotech Ltd                                             |
+-----------------------------------------------------------------------------+
| METRICS OVERVIEW:                                                           |
| Active Products: 3  |  Avg Rating: 4.2★  |  Approved: 6  |  Pending: 1      |
+-----------------------------------------------------------------------------+
| REPUTATION ANALYTICS (Recharts Star Distribution Breakdown):                |
| [Bar Chart of 5★ down to 1★ review counts for Aarav Infotech products]      |
+-----------------------------------------------------------------------------+
| MY PRODUCT REVIEWS (With Live Moderation Status Badges):                    |
| boAt Headphones | Rohan Verma | 5★ | Paisa Vasool... | [APPROVED]           |
| boAt Headphones | Simran Kaur | 4★ | Balanced sound. | [PENDING (In Review)]|
| boAt Headphones | Kabir Mehta | 1★ | Abusive text... | [REJECTED (Policy)]  |
+-----------------------------------------------------------------------------+
```
