# API Design

The **MindEase API** follows RESTful architecture, offering clear, resource-based endpoints for authentication, user management, mood tracking, therapy sessions, and recommendations.  
All responses are in **JSON**, and endpoints use **JWT authentication** for secure access.

---

## Authentication Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| All Users | **POST** | `/api/v1/auth/register/` | Register a new user (Patient or Therapist). Admin role cannot be registered through API. |
| All Users | **GET**  | `/api/v1/auth/verify-email/<uidb64>/<token>/` | Verify user email after registration. Token expires after configured timeout (default: 1 hour 40 minutes). |
| All Users | **POST** | `/api/v1/auth/login/` | Log in and receive JWT access and refresh tokens. Requires email verification. Optional role selection for users with multiple roles. |
| Authenticated Users | **POST** | `/api/v1/auth/logout/` | Log out and blacklist refresh token. |
| All Users | **POST** | `/api/v1/token/refresh/` | Refresh JWT access token using a refresh token. |
| All Users | **POST** | `/api/v1/auth/password-reset/` | Send password reset email to the user. Requires email to be verified. |
| All Users | **POST** | `/api/v1/auth/password-reset-confirm/<uidb64>/<token>/` | Confirm and set new password. Token expires after configured timeout (default: 1 hour 40 minutes). |
| Authenticated Users | **GET** | `/api/v1/auth/profile/` | Retrieve current user's profile information. |
| Authenticated Users | **PUT** | `/api/v1/auth/profile/` | Update profile details (first_name, last_name, username). Email cannot be updated. |
| Authenticated Users | **POST** | `/api/v1/auth/add-role/` | Add additional role to user (patient can add therapist role, therapist can add patient role). Admin role cannot be added through API. |

---

## Mood Tracker Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| Patient | **GET**  | `/api/v1/mood/` | Retrieve all mood entries of the logged-in user (paginated). |
| Patient | **POST** | `/api/v1/mood/` | Add a new mood entry (mood score and note). Multiple entries per day allowed. |
| Patient | **PUT**  | `/api/v1/mood/<uuid:id>/` | Edit a specific mood entry. |
| Patient | **GET**  | `/api/v1/mood/chart-data/` | Get mood chart data with daily averages, trend analysis, and analytics for configurable date ranges (7 or 30 days). Query parameter: `days` (default: 7). |

---

## Therapist Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| Therapist | **GET**  | `/api/v1/therapists/profile/` | Retrieve therapist profile details for the authenticated therapist. |
| Therapist | **POST** | `/api/v1/therapists/profile/` | Create a therapist profile (specialization, experience_years, consultation_mode, about, clinic_address). |
| Therapist | **PUT**  | `/api/v1/therapists/profile/` | Update therapist profile information. Partial updates allowed. |
| All Users | **GET**  | `/api/v1/therapists/` | List all approved therapists (paginated). Query parameter: `specialization` (optional filter). |
| All Users | **GET**  | `/api/v1/therapists/availability/<uuid:therapist_id>/` | View a specific therapist's availability slots by day of week and time range. |
| Therapist | **POST** | `/api/v1/therapists/availability/create/` | Add therapist availability slot (day_of_week, start_time, end_time). |
| Therapist | **DELETE** | `/api/v1/therapists/availability/delete/<int:id>/` | Delete a therapist availability slot (soft delete). |

---

## Appointment Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| Patient, Therapist | **GET**  | `/api/v1/appointments/` | View all appointments for the logged-in user (paginated, filtered by role). Query parameters: `page`, `page_size`, `status` (optional). |
| Patient | **POST** | `/api/v1/appointments/` | Book a new appointment with a therapist. Requires: `therapist_id`, `date`, `time_slot`. Validates against past dates/times and double-booking. |
| Patient | **PATCH** | `/api/v1/appointments/<uuid:id>/cancel/` | Cancel a specific appointment (status updated to 'cancelled'). Only pending or confirmed appointments can be cancelled. |
| Therapist | **PATCH** | `/api/v1/appointments/<uuid:id>/notes/` | Add or update therapist session notes. Only therapists can add notes to their appointments. |
| Therapist | **PATCH** | `/api/v1/appointments/<uuid:id>/approve-reject/` | Approve or reject a pending appointment. Requires: `action` ('approve' or 'reject'). Only pending appointments can be approved/rejected. |
| All Users | **GET** | `/api/v1/appointments/therapist/<uuid:therapist_id>/booked-slots/` | Get all booked time slots for a specific therapist on a given date. Query parameter: `date` (YYYY-MM-DD format). Prevents double booking on frontend. |

---

## Recommendation Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| Patient | **GET** | `/api/v1/recommendations/` | Fetch recommended mindfulness content based on 7-day average mood trends (average of daily averages). Returns category, average mood score, and 3 random content items. |

---

## Response Status Codes

All API endpoints follow REST best practices for HTTP status codes:

- **200 OK**: Successful GET, PUT, or PATCH request
- **201 Created**: Successful POST request creating a new resource
- **204 No Content**: Successful DELETE or update with no response body
- **400 Bad Request**: Validation error or malformed request
- **401 Unauthorized**: Authentication required or token invalid/expired
- **403 Forbidden**: Authenticated but insufficient permissions
- **404 Not Found**: Resource does not exist
- **409 Conflict**: Duplicate entry or constraint violation
- **500 Internal Server Error**: Unexpected server error

---
