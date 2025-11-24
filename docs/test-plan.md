

# **Test Plan**

## **1. Document Details**

**Project Name:** MindEase – Mental Wellness Platform

**Document Version:** 2.0

**Prepared By:** Developer

---

## **2. Objective**

The objective of this test plan is to validate all functional and non-functional requirements of the MindEase application. This includes verifying the correctness, stability, usability, and reliability of features such as user authentication, therapist management, appointment booking, mood tracking, recommendations, and admin functionalities across both web and mobile (PWA) interfaces.

---

## **3. Scope**

### **In Scope**

* User registration, login, and email verification
* Role-based authentication (User, Therapist, Admin)
* Multi-role support (users can have multiple roles)
* Therapist profile creation and approval flow
* Therapist availability management (create, update, delete)
* Appointment booking, cancellation, approval/rejection, and session notes
* Mood tracking (create, view, update)
* Recommendation engine (based on mood trends)
* Admin operations (user/therapist/content management)
* Form validation (password, name, email)
* Email verification and password reset token expiration (10 minutes)
* Password reset restrictions (only for verified emails)
* PWA responsiveness and offline support
* API testing with Postman
* Validation of JWT authentication and authorization
* Default role initialization (patient, therapist, admin)

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

* Test all endpoints using Postman:
  * **Authentication** (`/api/v1/auth/`):
    * `POST /register/` - User registration
    * `GET /verify-email/<uidb64>/<token>/` - Email verification
    * `POST /login/` - User login with role selection
    * `POST /logout/` - User logout (blacklist refresh token)
    * `POST /password-reset/` - Request password reset (only if email verified)
    * `POST /password-reset-confirm/<uidb64>/<token>/` - Confirm password reset
    * `GET /profile/` - Get user profile
    * `PUT /profile/` - Update user profile
    * `POST /add-role/` - Add additional role to user
  * **Therapists** (`/api/v1/therapists/`):
    * `GET /` - List approved therapists
    * `GET /profile/` - Get therapist profile
    * `POST /profile/` - Create therapist profile
    * `PUT /profile/` - Update therapist profile
    * `GET /availability/<uuid:pk>/` - Get therapist availability
    * `POST /availability/create/` - Create availability slot
    * `DELETE /availability/delete/<int:pk>/` - Delete availability slot
  * **Appointments** (`/api/v1/appointments/`):
    * `GET /` - List appointments
    * `POST /` - Create appointment
    * `POST /<uuid:pk>/cancel/` - Cancel appointment
    * `POST /<uuid:pk>/notes/` - Add session notes
    * `POST /<uuid:pk>/approve-reject/` - Approve or reject appointment
    * `GET /therapist/<uuid:therapist_id>/booked-slots/` - Get booked slots for therapist and date
  * **Mood** (`/api/v1/mood/`):
    * `GET /` - List mood entries (paginated)
    * `POST /` - Create mood entry
    * `PUT /<uuid:pk>/` - Update mood entry
    * `GET /chart-data/` - Get mood chart data (daily averages)
  * **Recommendations** (`/api/v1/recommendations/`):
    * `GET /` - Get personalized recommendations
* Validate all HTTP status codes follow REST best practices (200, 201, 400, 401, 403, 404, 409, 500).
* Validate authentication with JWT and automatic token refresh on 401.
* Confirm unauthorized access is properly restricted.
* Test IST timezone handling for mood data.
* Verify error messages are user-friendly and meaningful (not generic 400 errors).

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
  * Validate first name and last name (letters and spaces only, no numbers or special symbols)
  * Validate email format and uniqueness
  * Validate password (minimum 8 characters, cannot be only spaces)
  * Validate password confirmation match
  * Role selection during registration (patient or therapist)
  * Default roles (patient, therapist, admin) auto-created if Role table is empty
* Email verification flow
  * Verification email sent after registration
  * Token expiration: 10 minutes (configurable via `PASSWORD_RESET_TIMEOUT` env variable)
  * Verify email link functionality
  * User cannot access protected routes until email is verified
* JWT-based login and logout
  * Login with email, password, and role selection
  * User-friendly error messages for invalid credentials
  * JWT access token (45 minutes) and refresh token (30 days)
  * Logout blacklists refresh token
  * Automatic token refresh on 401 responses
* Password reset via token
  * Password reset email only sent if user's email is verified
  * Token expiration: 10 minutes (configurable via `PASSWORD_RESET_TIMEOUT` env variable)
  * Password reset confirmation with new password
  * New password validation (cannot be only spaces)
* Access protected routes only after login
* Password validation: Passwords cannot consist solely of spaces (frontend and backend)

### **FR-02: Role-Based Authorization**

* Ensure User, Therapist, and Admin roles access only allowed endpoints
* Restrict admin-only features to non-admin users
* **Verify Role model and UserRole junction table implementation**
* Test multiple role assignment per user
  * Patient can add therapist role via `/api/v1/auth/add-role/`
  * Therapist can add patient role via `/api/v1/auth/add-role/`
  * Confirmation popup appears when role is successfully added (8 seconds duration)
  * Dashboard messages inform users about multi-role capabilities
* Validate active/revoked roles (revoked_at field)
* Verify Django Admin shows only User, Content, and TherapistProfile models
* Default roles (patient, therapist, admin) are automatically created if missing during user creation

### **FR-03: Therapist Module**

* Create/update therapist profile
  * Specialization selection
  * Experience years (0-55, validated frontend and backend)
  * Consultation mode (online, offline, both)
  * About section
  * Clinic address (required for offline/both modes)
* Verify clinic address, specialization, and experience fields
* **Validate experience years limited to 0-55 (frontend and backend)**
* Manage therapist availability slots (recurring weekly schedule)
  * Create availability slots for days of week
  * Update existing availability slots
  * Delete availability slots (soft delete)
  * Frontend tracks original vs current slots and syncs changes
* Admin approval workflow validation (is_approved flag)
* Verify unapproved therapists hidden from directory
* Test API endpoint for fetching booked slots by therapist and date
* Therapist profile view shows account settings and role management

### **FR-04: Appointment Booking**

* Select consultation mode (Video Call / In-Person) with auto-advance to next step
* Choose future date from calendar (past dates disabled)
* View available time slots based on therapist's weekly schedule
* Verify booked slots are disabled (fetched from API endpoint `/appointments/therapist/<therapist_id>/booked-slots/`)
* Verify past time slots filtered out for current date
* **Validate backend prevents booking appointments in the past**
* Confirm duplicate booking prevention at database level
* Booking confirmation via email to both patient and therapist
* Persistent success popup with manual close (no auto-dismiss)
* Cancel appointment (by user before session)
* Therapist approval/rejection workflow
  * Therapist can approve or reject appointments via `/appointments/<uuid:pk>/approve-reject/`
  * Status updates: pending → approved/rejected
* Therapist adds session notes post-appointment
* Self-booking prevention: Users cannot book appointments with themselves (if they are therapists)

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

### **FR-08: Multi-Role Support**

* Users can have multiple roles simultaneously
* Patient users can add therapist role from profile page
* Therapist users can add patient role from profile page
* Confirmation popup displays when role is successfully added (8 seconds, auto-dismiss)
* Dashboard messages guide users about multi-role capabilities
* Role addition API: `POST /api/v1/auth/add-role/` with role name
* Users can switch between roles during login
* Profile pages show available roles and allow role addition

### **FR-09: Form Validation**

* **Password Validation:**
  * Minimum 8 characters
  * Cannot consist solely of spaces (frontend and backend validation)
  * Leading/trailing spaces are trimmed
* **Name Validation:**
  * First name and last name can only contain letters and spaces
  * No numbers or special symbols allowed
  * Cannot be empty or contain only spaces
  * Real-time validation feedback in frontend
* **Email Validation:**
  * Valid email format
  * Unique email addresses
  * Leading spaces are automatically trimmed
  * Cannot be empty or contain only spaces
* **Error Messages:**
  * User-friendly error messages from backend (not generic "Request failed with status code 400")
  * Frontend displays specific error messages from API responses
  * Field-specific error messages for validation failures

### **FR-10: Token Management**

* Email verification tokens expire after 10 minutes (configurable via `PASSWORD_RESET_TIMEOUT` env variable)
* Password reset tokens expire after 10 minutes (configurable via `PASSWORD_RESET_TIMEOUT` env variable)
* Password reset emails only sent if user's email is verified
* Token expiration handled gracefully with appropriate error messages
* Environment variable `PASSWORD_RESET_TIMEOUT` in `.env` and `.env.example` files

### **FR-11: PWA Features**

* App install prompt on supported browsers
* Offline mode availability (cached assets)
* Verify responsiveness across devices
* Mobile-first design with Tailwind CSS

---

## **6. Entry Criteria**

* Backend and frontend features deployed and stable
* Database seeded with test data
* All API endpoints accessible
* Required environment variables configured:
  * `BASE_URL` - Frontend URL
  * Database connection settings
  * JWT secrets (`SECRET_KEY`)
  * `PASSWORD_RESET_TIMEOUT` - Token expiration in seconds (default: 600 for 10 minutes)
  * Email settings (SMTP configuration)
  * `CSRF_TRUSTED_ORIGINS` - Allowed origins for CSRF
* QA access to admin credentials
* Default roles (patient, therapist, admin) exist in database

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
| Token expiration during testing       | Use shorter test windows or adjust timeout |
| Multi-role complexity                 | Test each role combination separately   |
| Availability slot sync issues         | Verify frontend-backend state synchronization |

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

---

## **12. Complete API Endpoints Reference**

### **Authentication Endpoints** (`/api/v1/auth/`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/register/` | Register new user | No | - |
| GET | `/verify-email/<uidb64>/<token>/` | Verify email address | No | - |
| POST | `/login/` | Login with email, password, and role | No | - |
| POST | `/logout/` | Logout (blacklist refresh token) | Yes | Any |
| POST | `/password-reset/` | Request password reset (email must be verified) | No | - |
| POST | `/password-reset-confirm/<uidb64>/<token>/` | Confirm password reset | No | - |
| GET | `/profile/` | Get user profile | Yes | Any |
| PUT | `/profile/` | Update user profile | Yes | Any |
| POST | `/add-role/` | Add additional role to user | Yes | Any |

### **Therapist Endpoints** (`/api/v1/therapists/`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/` | List all approved therapists | Yes | Patient |
| GET | `/profile/` | Get therapist profile | Yes | Therapist |
| POST | `/profile/` | Create therapist profile | Yes | Therapist |
| PUT | `/profile/` | Update therapist profile | Yes | Therapist |
| GET | `/availability/<uuid:pk>/` | Get therapist availability slots | Yes | Any |
| POST | `/availability/create/` | Create availability slot | Yes | Therapist |
| DELETE | `/availability/delete/<int:pk>/` | Delete availability slot | Yes | Therapist |

### **Appointment Endpoints** (`/api/v1/appointments/`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/` | List user's appointments | Yes | Any |
| POST | `/` | Create new appointment | Yes | Patient |
| POST | `/<uuid:pk>/cancel/` | Cancel appointment | Yes | Patient |
| POST | `/<uuid:pk>/notes/` | Add session notes | Yes | Therapist |
| POST | `/<uuid:pk>/approve-reject/` | Approve or reject appointment | Yes | Therapist |
| GET | `/therapist/<uuid:therapist_id>/booked-slots/` | Get booked slots for therapist and date | Yes | Any |

### **Mood Endpoints** (`/api/v1/mood/`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/` | List mood entries (paginated) | Yes | Any |
| POST | `/` | Create mood entry | Yes | Any |
| PUT | `/<uuid:pk>/` | Update mood entry | Yes | Any |
| GET | `/chart-data/` | Get mood chart data (daily averages) | Yes | Any |

### **Recommendation Endpoints** (`/api/v1/recommendations/`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/` | Get personalized recommendations | Yes | Patient |

### **Token Refresh Endpoint**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/token/refresh/` | Refresh JWT access token | Yes (refresh token) |

---

### **End of Document**

---

**Note:** This test plan should be reviewed and updated as new features are added to the application. All API endpoints should be tested for proper authentication, authorization, validation, and error handling.
