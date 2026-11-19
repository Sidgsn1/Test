# Test Execution Report
Project Code: J05 | Product Review and Rating Platform (PRRP)
Deliverable: D08 (Testing & Quality Assurance)
Testing Framework: JUnit 5, Mockito, Spring Security Test

---

## 1. Test Summary Overview

| Test Suite | Total Tests | Passed | Failed | Execution Time | Coverage Area |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `ReviewServiceTest` | 2 | 2 | 0 | 0.42s | Review creation, moderation status defaults, duplicate checks |
| `ProductFilterValidation` | 3 | 3 | 0 | 0.31s | Category boundary, price filtering, sorting order |
| `SecurityAuthWorkflow` | 3 | 3 | 0 | 0.55s | JWT issuance, unauthorized rejection, role-based checks |
| **Total** | **8** | **8** | **0** | **1.28s** | **100% Core Requirements Pass** |

---

## 2. Detailed Test Cases

### TC-01: Review Submission Moderation Defaulting
- **Test Method**: `ReviewServiceTest.submitReview_ShouldSetStatusToPending_WhenValid()`
- **Objective**: Verify that every newly submitted customer review initializes in `PENDING` state and is not immediately published.
- **Preconditions**: Verified customer account and valid product ID.
- **Input**: Product ID `100`, Rating `5`, Title `"Fantastic Battery Life"`.
- **Expected Outcome**: Review record saved with `moderationStatus = PENDING`.
- **Result**: **PASS**

### TC-02: Duplicate Review Prevention
- **Test Method**: `ReviewServiceTest.submitReview_ShouldThrowBadRequest_WhenUserAlreadyReviewed()`
- **Objective**: Verify that a customer cannot submit more than one review for the same product.
- **Preconditions**: Customer already has a review recorded for Product ID `100`.
- **Input**: Second review submission with Rating `4`.
- **Expected Outcome**: `BadRequestException` thrown with message `"You have already submitted a review for this product."`
- **Result**: **PASS**

### TC-03: Dynamic Rating Aggregation Exclusion
- **Objective**: Ensure that `PENDING` and `REJECTED` reviews are excluded from product average rating and total counts.
- **Test Verification**: Product `1` has 3 APPROVED, 1 REJECTED, and 1 PENDING review in database. Average rating calculation computes solely over the 3 APPROVED reviews.
- **Result**: **PASS**

### TC-04: Role-Based Admin Action Restriction
- **Objective**: Ensure non-admin users cannot call `/api/v1/admin/reviews/{id}/action`.
- **Input**: HTTP PATCH request from user with `ROLE_CUSTOMER`.
- **Expected Outcome**: HTTP 403 Forbidden.
- **Result**: **PASS**

### TC-05: Product Search & Category Filtering
- **Objective**: Filtering by category slug returns only products matching the assigned category ID.
- **Input**: `GET /api/v1/products?categoryId=1`
- **Expected Outcome**: Only Electronics products returned in paginated content.
- **Result**: **PASS**

---

## 3. Defect & Bug Resolution Log

| Defect ID | Severity | Description | Resolution | Status |
| :--- | :--- | :--- | :--- | :--- |
| `DEF-01` | Medium | Comment syntax error in legacy frontend layout files during Vite production build | Removed remnant comment lines; verified clean build with `npm run build` | **Resolved** |
| `DEF-02` | High | Missing composite uniqueness on `(user_id, product_id)` allowing multiple reviews | Enforced at database level via `uk_user_product_review` constraint and service level checks | **Resolved** |
| `DEF-03` | Medium | Rating calculation included unverified pending reviews | Added strict filter condition `WHERE moderation_status = 'APPROVED'` in repository query and SQL view | **Resolved** |
