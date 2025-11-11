# API Design

The **MindEase API** follows RESTful architecture, offering clear, resource-based endpoints for authentication, user management, mood tracking, therapy sessions, and recommendations.  
All responses are in **JSON**, and endpoints use **JWT authentication** for secure access.

---

## Authentication Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| **POST** | `/api/v1/auth/register/` | Register a new user (Admin, Therapist, or User). |
| **GET** | `/api/v1/auth/verify-email/<uid>/<token>/` | Verify user email after registration. |
| **POST** | `/api/v1/auth/login/` | Log in and receive JWT access and refresh tokens. |
| **POST** | `/api/v1/token/refresh/` | Refresh JWT access token using a refresh token. |
| **POST** | `/api/v1/auth/password-reset/` | Send password reset email to the user. |
| **POST** | `/api/v1/auth/password-reset-confirm/<uid>/<token>/` | Confirm and set new password. |
| **GET** | `/api/v1/auth/profile/` | Retrieve user profile information. |
| **PUT** | `/api/v1/auth/profile/` | Update profile details (username, email, role). |

---

## Mood Tracker Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| **POST** | `/api/v1/mood/` | Add a new mood entry (mood score and note). |
| **GET** | `/api/v1/mood/` | Retrieve all mood entries of the logged-in user. |
| **PUT** | `/api/v1/mood/{id}/` | Edit a specific mood entry. |
| **GET** | `/api/v1/mood/analytics/` | View mood analytics (weekly or monthly trends). |

---

## Therapist Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| **POST** | `/api/v1/therapists/profile/` | Create a therapist profile (specialization, mode, experience). |
| **GET** | `/api/v1/therapists/profile/` | Retrieve therapist profile details. |
| **PUT** | `/api/v1/therapists/profile/` | Update therapist profile information. |
| **GET** | `/api/v1/therapists/` | List all approved therapists (optional filters by specialization). |
| **POST** | `/api/v1/therapists/availability/` | Add therapist availability slots. |
| **GET** | `/api/v1/therapists/availability/` | View therapist’s availability slots. |

---

## Appointment Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| **POST** | `/api/v1/appointments/` | Book a new appointment with a therapist. |
| **GET** | `/api/v1/appointments/` | View all appointments for the logged-in user. |
| **PATCH** | `/api/v1/appointments/{id}/cancel/` | Cancel a specific appointment. |
| **PATCH** | `/api/v1/appointments/{id}/notes/` | Add or update therapist session notes. |

---

## Recommendation Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| **GET** | `/api/v1/recommendations/` | Fetch recommended mindfulness content based on mood trends. |

---


