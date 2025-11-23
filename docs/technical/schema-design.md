# Database Schema Documentation

This document describes the complete database schema for the **MindEase - Mood Tracking & Therapy Booking System**, including all tables, fields, relationships, indexes, and key constraints.

---

## 1. Tables and Fields

### 1.1 roles

| Field        | Type       | Description                                |
|--------------|------------|--------------------------------------------|
| id           | SERIAL PK  | Auto-increment role ID                     |
| name         | VARCHAR(20)| Role name (`admin`, `therapist`, `patient`), unique |
| description  | TEXT       | Short description of the role (nullable)   |
| created_at   | TIMESTAMPTZ| Timestamp of creation                      |
| updated_at   | TIMESTAMPTZ| Last updated timestamp                     |

**Indexes:**  
- `ix_role_name` on `(name)` - ensures each role name is unique and enables fast role lookups.

---

### 1.2 user_roles

| Field       | Type       | Description                                  |
|-------------|------------|----------------------------------------------|
| id          | SERIAL PK  | Auto-increment mapping ID                    |
| user_id     | UUID FK    | References `users.id` (user assigned the role) |
| role_id     | INT FK     | References `roles.id` (assigned role)        |
| assigned_at | TIMESTAMPTZ| When the role was assigned (auto-generated)   |
| revoked_at  | TIMESTAMPTZ| When the role was revoked (nullable)          |

**Indexes:**  
- `ix_user_role` on `(user_id, role_id)` - fast lookup of specific user-role combinations.  
- `ix_user_role_active` on `(user_id, revoked_at)` - fast lookup of active roles per user.

**Constraints:**
- Unique together on `(user, role)` to prevent duplicate role assignments for the same user.

> **Note:** `user_roles` is a junction table implementing a many-to-many relationship between users and roles. Each user can have multiple roles, and roles can be revoked by setting `revoked_at`. The `is_active` property checks if `revoked_at IS NULL`.

---

### 1.3 users

| Field       | Type        | Description |
|-------------|-------------|-------------|
| id          | UUID PK     | Primary key (UUID, auto-generated) |
| username    | VARCHAR(150)| Display username (nullable, blank allowed) |
| email       | VARCHAR     | User's email address (unique, used for login) |
| password    | VARCHAR     | Hashed password (Django managed) |
| first_name  | VARCHAR(150)| First name (only letters and spaces allowed) |
| last_name   | VARCHAR(150)| Last name (only letters and spaces allowed) |
| email_verified | BOOLEAN  | Whether email is verified (default: false) |
| is_active   | BOOLEAN     | Account active status |
| is_staff    | BOOLEAN     | Staff status for Django admin |
| is_superuser| BOOLEAN     | Superuser status |
| date_joined | TIMESTAMPTZ | Account creation timestamp |
| last_login  | TIMESTAMPTZ | Last login timestamp |
| deleted_at  | TIMESTAMPTZ | Soft delete timestamp (nullable) |

**Relationships:**
- Many-to-Many with `roles` through `user_roles` junction table

**Indexes:**  
- `ix_user_email_lower` on `LOWER(email)` - case-insensitive email lookup for faster login.  
- `deleted_at` indexed for soft delete filtering.

**Validation:**
- Email must be unique
- Password must be > 6 characters, contain at least 1 uppercase letter and 1 special character
- First name and last name can only contain letters and spaces

---

### 1.4 therapist_profiles

| Field            | Type         | Description |
|------------------|--------------|-------------|
| id               | UUID PK      | Therapist profile ID (auto-generated UUID) |
| user_id          | UUID FK      | Linked user account (OneToOne with `users.id`) |
| specialization   | VARCHAR(100) | Therapist's specialty |
| experience_years | POSITIVE INT | Years of experience (0-55) |
| consultation_mode| VARCHAR(10)  | `online`, `offline`, or `both` (default: `online`) |
| about            | TEXT         | Bio or description (nullable) |
| clinic_address   | TEXT         | Clinic location for offline appointments (nullable) |
| is_approved      | BOOLEAN      | Admin approval status (default: false) |
| created_at       | TIMESTAMPTZ  | Created timestamp (auto-generated) |
| deleted_at       | TIMESTAMPTZ  | Soft delete timestamp (nullable) |

**Constraints:**
- `ux_therapist_user` UNIQUE(user_id) - ensures one profile per user (OneToOne relationship).

**Indexes:**  
- `ix_therapist_spec_approved` on `(specialization, is_approved)` - fast filtering for approved therapists.

**Validation:**
- experience_years must be between 0 and 55 (frontend and backend validation)

---

### 1.5 therapist_availabilities

| Field       | Type         | Description |
|-------------|--------------|-------------|
| id          | AUTO PK      | Availability slot ID (auto-increment) |
| therapist_id| UUID FK      | References `therapist_profiles.id` |
| day_of_week | VARCHAR(10)  | Day name (e.g., 'Monday', 'Tuesday', etc.) |
| start_time  | TIME         | Slot start time |
| end_time    | TIME         | Slot end time |
| deleted_at  | TIMESTAMPTZ  | Soft delete timestamp (nullable) |

**Indexes:**  
- `ix_slot_available` on `(therapist_id, day_of_week, start_time)` - efficient retrieval of slots for a therapist by day.

---

### 1.6 appointments

| Field            | Type         | Description |
|------------------|--------------|-------------|
| id               | UUID PK      | Appointment ID (auto-generated UUID) |
| therapist_id     | UUID FK      | References `therapist_profiles.id` |
| user_id          | UUID FK      | References `users.id` (patient) |
| date             | DATE         | Appointment date |
| time_slot        | TIME         | Time of session |
| status           | VARCHAR(20)  | `pending`, `confirmed`, `cancelled`, `completed` (default: `pending`) |
| therapist_note   | TEXT         | Therapist notes (visible to patient, nullable) |
| created_at       | TIMESTAMPTZ  | Created timestamp (auto-generated) |
| deleted_at       | TIMESTAMPTZ  | Soft delete timestamp (nullable) |

**Constraints:**
- `ux_appt_unique_active` UNIQUE(therapist_id, date, time_slot) WHERE status IN ('pending', 'confirmed') - prevents double-booking for active appointments only.

**Indexes:**  
- `ix_appt_user_date` on `(user_id, -date)` - fast retrieval of recent user appointments (descending order).

**Validation:**
- Appointment date and time cannot be in the past (server-side validation)
- Prevents booking if slot is already booked for the same therapist, date, and time

---

### 1.7 mood_entries

| Field       | Type         | Description |
|-------------|--------------|-------------|
| id          | UUID PK      | Mood entry ID (auto-generated UUID) |
| user_id     | UUID FK      | References `users.id` |
| mood_score  | INTEGER      | Mood rating (1–5): 1=Very Sad 😢, 2=Sad 🙁, 3=Neutral 😐, 4=Happy 🙂, 5=Very Happy 😄 |
| note        | TEXT         | Optional note (nullable) |
| created_at  | TIMESTAMPTZ  | Timestamp of entry creation (auto-generated) |
| deleted_at  | TIMESTAMPTZ  | Soft delete timestamp (nullable) |

**Indexes:**  
- `ix_mood_user_date_desc` on `(user_id, -created_at)` - quick retrieval of latest entries in descending order.

**Changes from Original:**
- **REMOVED** unique constraint on `(user_id, created_at)` - now allows **multiple mood entries per day**
- Mood chart data calculates **daily averages** when multiple entries exist for the same day
- Overall average mood is calculated as the **average of daily averages** (not simple average)

---

### 1.8 recommendations

| Field       | Type         | Description |
|-------------|--------------|-------------|
| id          | AUTO PK      | Content ID (auto-increment) |
| title       | VARCHAR(150) | Content title |
| description | TEXT         | Mindfulness tip or exercise description |
| category    | VARCHAR(50)  | Category: `uplifting`, `calming`, `maintenance`, or `gratitude` |
| created_at  | TIMESTAMPTZ  | Created timestamp (auto-generated) |
| deleted_at  | TIMESTAMPTZ  | Soft delete timestamp (nullable) |

**Simplified Model:**
- Removed `is_approved` field - content is managed directly by admins
- Removed `created_by` field - simplified content management
- Content is accessible immediately after creation by admin

---

### 1.9 password_reset_tokens (Django built-in)

Password reset and email verification are handled using Django's built-in token generation system:
- Tokens are generated using `default_token_generator` from Django
- Tokens are time-limited and single-use
- User ID is encoded in the URL using `urlsafe_base64_encode`
- No separate database table needed - tokens are cryptographically generated and validated

---

## 2. ER Diagram

![Database Schema](../assets/images/database-schema.png)

---

## 3. Relationships

| Source Table       | Target Table        | Relationship | Description |
|--------------------|---------------------|--------------|-------------|
| **roles**          | **user_roles**      | 1 → N        | A role (admin/therapist/patient) can be assigned to many users (historical or concurrent assignments). |
| **users**          | **user_roles**      | 1 → N        | A user can have multiple role assignment records (current or historical). |
| **users**          | **therapist_profiles** | 1 → 0..1  | A user may have one therapist profile (or none). |
| **therapist_profiles** | **therapist_availabilities** | 1 → N  | A therapist publishes many availability slots (recurring weekly patterns). |
| **therapist_profiles** | **appointments**  | 1 → N        | A therapist handles many appointments. |
| **users**          | **appointments**    | 1 → N        | A user (patient) can book many appointments. |
| **users**          | **mood_entries**    | 1 → N        | Users log multiple mood entries over time (multiple entries per day allowed). |
| N/A                | **recommendations** | N/A  | Content is managed by admins, no direct user relationship. |

> **Clarification:** `user_roles` is the mapping table between `users` and `roles`. Use constraints (unique partial indexes or `revoked_at IS NULL`) to enforce single active role per user.

---

## 4. Index Summary

| Index Name | Table | Fields | Purpose |
|------------|-------|--------|---------|
| `ix_role_name` | roles | name | Fast role name lookups |
| `ix_user_role` | user_roles | (user_id, role_id) | Fast lookup of specific user-role combinations |
| `ix_user_role_active` | user_roles | (user_id, revoked_at) | Fast lookup of active roles per user |
| `ix_user_email_lower` | users | LOWER(email) | Case-insensitive email lookup for faster login |
| `ux_therapist_user` | therapist_profiles | user_id | Ensure one profile per user (unique constraint) |
| `ix_therapist_spec_approved` | therapist_profiles | (specialization, is_approved) | Filter approved therapists quickly |
| `ix_slot_available` | therapist_availabilities | (therapist_id, day_of_week, start_time) | Fast slot retrieval |
| `ux_appt_unique_active` | appointments | (therapist_id, date, time_slot) WHERE status IN ('pending', 'confirmed') | Prevent double booking for active appointments |
| `ix_appt_user_date` | appointments | (user_id, -date) | Fetch recent user appointments (descending order) |
| `ix_mood_user_date_desc` | mood_entries | (user_id, -created_at) | Fast recent mood retrieval (descending order) |

---

## 5. Triggers (Future Enhancements)

**set_updated_at()**  
Functionality: automatically sets `updated_at = now()` on row updates.

**Applied On:**  
- `users`  
- `therapist_profiles`  
- `therapist_availabilities`  
- `appointments`  
- `recommendations`  
- `mood_entries`

**Purpose:** Ensures consistent `updated_at` timestamps without requiring explicit updates in application code.

---

## 6. Views (Future Enhancements)

| View Name | Description |
|-----------|-------------|
| `active_therapists_view` | Lists approved therapists with available slots |
| `mood_trend_view` | 7-day average mood per user (for analytics) |
| `upcoming_appointments_view` | Confirmed appointments for the next 7 days |
| `user_activity_view` | Combined recent activity for dashboards (mood, appointments, content interactions) |

---

> **Note:**  
> The MindEase schema follows normalization best practices (3NF) and separates static role definitions (`roles`) from assignment records (`user_roles`) so you can track role history or support multi-role users in the future. Use partial unique indexes or constraints to enforce business rules (for example: a single active role per user).

