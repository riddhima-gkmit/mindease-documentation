

# **Test Plan**

## **1. Document Details**

**Project Name:** MindEase – Mental Wellness Platform
**Document Version:** 1.0
**Prepared By:** Developer


---

## **2. Objective**

The objective of this test plan is to validate all functional and non-functional requirements of the MindEase application. This includes verifying the correctness, stability, usability, and reliability of features such as user authentication, therapist management, appointment booking, mood tracking, recommendations, and admin functionalities across both web and mobile (PWA) interfaces.

---

## **3. Scope**

### **In Scope**

* User registration, login, and email verification
* Role-based authentication (User, Therapist, Admin)
* Therapist profile creation and approval flow
* Therapist availability management
* Appointment booking, cancellation, and session notes
* Mood tracking (create, view, update)
* Recommendation engine (based on mood trends)
* Admin operations (user/therapist/content management)
* PWA responsiveness and offline support
* API testing with Postman
* Validation of JWT authentication and authorization

### **Out of Scope**

* Payment gateway or transaction testing
* AI chatbot or n8n integration
* Load, stress, or performance testing
* Third-party service integration testing
* Multi-language and accessibility testing

---

## **4. Test Strategy / Approach**

### **Manual Testing**

* Execute all functional user flows manually through the browser.
* Validate UI components, role-based access, form validations, and navigation.
* Verify email verification and password reset flows.

### **API Testing**

* Test all endpoints (`/auth/`, `/therapists/`, `/appointments/`, `/mood/`, `/recommendations/`) using Postman.
* **New endpoint**: `/appointments/therapist/{therapist_id}/booked-slots/` - verify returns booked slots for date.
* **New endpoint**: `/mood/chart-data/` - verify returns daily averages with configurable days parameter.
* Validate all HTTP status codes follow REST best practices (200, 201, 400, 401, 403, 404, 409, 500).
* Validate authentication with JWT and automatic token refresh on 401.
* Confirm unauthorized access is properly restricted.
* Test IST timezone handling for mood data.

### **Unit Testing**

* Django REST framework unit tests for models, serializers, and APIs.
* Vitest for frontend UI components.

### **Environment**

| Layer          | Technology                           |
| -------------- | ------------------------------------ |
| **Frontend**   | React (Vite + TypeScript + Tailwind) |
| **Backend**    | Django REST Framework (Python)       |
| **Database**   | PostgreSQL                           |
| **Deployment** | Vercel                               |
| **Browsers**   | Chrome, Edge, Firefox                |
| **Devices**    | Desktop and Mobile (PWA)             |

---

## **5. Features to be Tested**

### **FR-01: User Authentication**

* Register new users with valid/invalid data
* Email verification flow
* JWT-based login and logout
* Password reset via token
* Access protected routes only after login

### **FR-02: Role-Based Authorization**

* Ensure User, Therapist, and Admin roles access only allowed endpoints
* Restrict admin-only features to non-admin users
* **Verify Role model and UserRole junction table implementation**
* Test multiple role assignment per user
* Validate active/revoked roles (revoked_at field)
* Verify Django Admin shows only User, Content, and TherapistProfile models

### **FR-03: Therapist Module**

* Create/update therapist profile
* Verify clinic address, specialization, and experience fields
* **Validate experience years limited to 0-55 (frontend and backend)**
* Manage therapist availability slots (recurring weekly schedule)
* Admin approval workflow validation (is_approved flag)
* Verify unapproved therapists hidden from directory
* Test API endpoint for fetching booked slots by therapist and date

### **FR-04: Appointment Booking**

* Select consultation mode (Video Call / In-Person) with auto-advance to next step
* Choose future date from calendar (past dates disabled)
* View available time slots based on therapist's weekly schedule
* Verify booked slots are disabled (fetched from API)
* Verify past time slots filtered out for current date
* **Validate backend prevents booking appointments in the past**
* Confirm duplicate booking prevention at database level
* Booking confirmation via email to both patient and therapist
* Persistent success popup with manual close (no auto-dismiss)
* Cancel appointment (by user before session)
* Therapist adds session notes post-appointment

### **FR-05: Mood Tracker**

* Log mood entry (1–5 scale with note) - **multiple entries per day allowed**
* Each entry timestamped with date and time
* Edit previous mood entries
* Validate mood history displays all entries with timestamps
* Verify 7-day and 30-day mood analytics with daily average calculation
* Confirm chart shows daily averages when multiple entries exist per day
* Validate overall average calculated as average of daily averages (not simple average)
* Verify Y-axis labeled as "Mood Score" on chart

### **FR-06: Recommendation Engine**

* Generate recommendations based on last 7-day **average of daily averages**
* Verify IST timezone used for consistent date calculations
* Fetch 3 random content items from matched category
* Display average mood score (rounded to 2 decimals) with emoji
* Categories: uplifting (≤2), maintenance (=3), calming/gratitude (≥4)
* Verify "No recent mood data available" message when no data exists
* Admin can create, edit, and delete wellness content (direct publishing, no approval workflow)

### **FR-07: Admin Panel**

* CRUD operations for users with inline role management
* Approve therapist profiles (is_approved flag)
* Create, edit, delete recommendation content (direct publishing)
* Verify soft delete implementation (deleted_at timestamps)
* Test UUID primary keys across all models
* Validate visible models: User, Content, TherapistProfile only

### **FR-08: PWA Features**

* App install prompt on supported browsers
* Offline mode availability (cached assets)
* Verify responsiveness across devices

---

## **6. Entry Criteria**

* Backend and frontend features deployed and stable
* Database seeded with test data
* All API endpoints accessible
* Required environment variables configured (`BASE_URL`, DB, JWT secrets)
* QA access to admin credentials

---

## **7. Exit Criteria**

* All test cases executed successfully
* No open critical or major defects
* Regression completed after bug fixes
* QA/Tester's sign-off received

---

## **8. Risks & Mitigation**

| **Risk**                              | **Mitigation Strategy**                 |
| ------------------------------------- | --------------------------------------- |
| Unclear requirements or scope changes | Regular syncs with developer/mentor     |
| Inconsistent backend responses        | Maintain version-controlled API schema  |
| Data conflicts between user roles     | Use isolated test accounts              |
| Tight testing timelines               | Prioritize high-impact user flows first |
| Email services unavailable in testing | Use mock/stub email verification        |

---

## **9. Test Deliverables**

* Test case document (functional + API)
* Test execution report
* Bug/defect report
* Regression testing report
* Final test summary document

---

## **10. Timeline**

| Task                   | Duration |
| ---------------------- | -------- |
| Test Case Design       | 1–2 Days |
| Test Execution         | 3 Days   |
| Bug Reporting & Fixing | 2 Days   |
| Regression Testing     | 1 Day    |
| Final Sign-off         | 1 Day    |

---

## **11. Team & Responsibilities**

| Role                  | Responsibility                                           |
| --------------------- | -------------------------------------------------------- |
| **Tester (QA)**       | Write & execute test cases, perform manual & API testing |
| **Developer**         | Fix reported bugs and support QA                         |
| **Reviewer / Mentor** | Approve test plan, validate quality of deliverables      |

---

### **End of Document**

---

Would you like me to also create a **“Test Case Document Template”** (in Markdown or Excel format) for this — listing all features like Auth, Appointment, Mood Tracker, etc., with sample test case structure (`Test ID`, `Preconditions`, `Steps`, `Expected Result`)?
That’s the next natural deliverable after this Test Plan.
