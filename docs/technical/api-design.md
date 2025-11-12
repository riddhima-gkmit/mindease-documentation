# API Design

The **MindEase API** follows RESTful architecture, offering clear, resource-based endpoints for authentication, user management, mood tracking, therapy sessions, and recommendations.  
All responses are in **JSON**, and endpoints use **JWT authentication** for secure access.

---

## Authentication Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| All Users | **POST** | `/api/v1/auth/register/` | Register a new user (Admin, Therapist, or User). |
| All Users | **GET**  | `/api/v1/auth/verify-email/<uid>/<token>/` | Verify user email after registration. |
| All Users | **POST** | `/api/v1/auth/login/` | Log in and receive JWT access and refresh tokens. |
| All Users | **POST** | `/api/v1/token/refresh/` | Refresh JWT access token using a refresh token. |
| All Users | **POST** | `/api/v1/auth/password-reset/` | Send password reset email to the user. |
| All Users | **POST** | `/api/v1/auth/password-reset-confirm/<uid>/<token>/` | Confirm and set new password. |
| Authenticated Users | **GET** | `/api/v1/auth/profile/` | Retrieve current user's profile information. |
| Authenticated Users | **PUT** | `/api/v1/auth/profile/` | Update profile details (username, email, role). |

---

## Mood Tracker Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| Patient | **POST** | `/api/v1/mood/` | Add a new mood entry (mood score and note). |
| Patient | **GET**  | `/api/v1/mood/` | Retrieve all mood entries of the logged-in user. |
| Patient | **PUT**  | `/api/v1/mood/{id}/` | Edit a specific mood entry. |
| Patient, Admin | **GET**  | `/api/v1/mood/analytics/` | View mood analytics (weekly or monthly trends). |

---

## Therapist Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| Therapist | **POST** | `/api/v1/therapists/profile/` | Create a therapist profile (specialization, mode, experience). |
| Therapist | **GET**  | `/api/v1/therapists/profile/` | Retrieve therapist profile details. |
| Therapist | **PUT**  | `/api/v1/therapists/profile/` | Update therapist profile information. |
| All Users | **GET**  | `/api/v1/therapists/` | List all approved therapists (optional filters by specialization). |
| Therapist | **POST** | `/api/v1/therapists/availability/` | Add therapist availability slots. |
| Therapist, Admin | **GET**  | `/api/v1/therapists/availability/` | View therapist’s availability slots. |

---

## Appointment Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| Patient | **POST** | `/api/v1/appointments/` | Book a new appointment with a therapist. |
| Patient, Therapist, Admin | **GET**  | `/api/v1/appointments/` | View all appointments for the logged-in user. |
| Patient | **PATCH** | `/api/v1/appointments/{id}/cancel/` | Cancel a specific appointment. |
| Therapist | **PATCH** | `/api/v1/appointments/{id}/notes/` | Add or update therapist session notes. |

---

## Recommendation Endpoints

| Role | Method | Endpoint | Description |
|------|--------|----------|-------------|
| Patient | **GET** | `/api/v1/recommendations/` | Fetch recommended mindfulness content based on mood trends. |

---
