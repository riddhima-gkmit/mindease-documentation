# Database Schema Documentation

This document describes the complete database schema for the **MindEase – Mood Tracking & Therapy Booking System**, including all tables, fields, relationships, types, and indexes.

---

## 1. Tables and Fields

### 1.1 users

| Field | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Unique user ID |
| username | VARCHAR | Username for display |
| email | VARCHAR UNIQUE | User’s email address |
| password_hash | VARCHAR | Hashed password |
| first_name | VARCHAR | First name |
| last_name | VARCHAR | Last name |
| role | VARCHAR | Defines role: `admin`, `therapist`, or `patient` |
| is_active | BOOLEAN | Active account status |
| is_staff | BOOLEAN | Admin/staff flag |
| created_at | TIMESTAMPTZ | Account creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp |

**Indexes:**  
- `ux_users_email_lower` on `lower(email)` → Fast login and uniqueness check  

---

### 1.2 therapist_profiles

| Field | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Therapist profile ID |
| user_id | INT FK(users.id) | Linked user |
| specialization | VARCHAR | Area of expertise |
| experience_years | INT | Years of experience |
| consultation_mode | VARCHAR | Online / In-person |
| about | TEXT | Therapist bio |
| clinic_address | TEXT | Clinic or contact address |
| is_approved | BOOLEAN | Approved by admin |
| created_at | TIMESTAMPTZ | Profile creation time |
| updated_at | TIMESTAMPTZ | Last profile update |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp |

**Indexes:**  
- `ux_therapist_user` UNIQUE(user_id) → One profile per therapist  
- `ix_therapist_specialization_approved` on `(specialization, is_approved)` → Filter by specialization & approval  

---

### 1.3 availability_slots

| Field | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Slot ID |
| therapist_id | INT FK(therapist_profiles.id) | Associated therapist |
| day_of_week | INT | Day number (0–6) |
| start_time | TIME | Start time |
| end_time | TIME | End time |
| status | VARCHAR | `available` or `booked` |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp |

**Indexes:**  
- `ix_slots_therapist_day_available` on `(therapist_id, day_of_week, start_time)` → Fast fetch of available slots  

---

### 1.4 appointments

| Field | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Appointment ID |
| therapist_id | INT FK(therapist_profiles.id) | Therapist handling session |
| user_id | INT FK(users.id) | User (patient) booking |
| slot_id | INT FK(availability_slots.id) | Linked slot |
| appointment_date | DATE | Date of appointment |
| time_slot | TIME | Time of appointment |
| status | VARCHAR | `pending`, `confirmed`, `cancelled`, `completed` |
| therapist_note | TEXT | Session notes |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Updated timestamp |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp |

**Indexes:**  
- `ux_appt_therapist_date_time` UNIQUE(therapist_id, appointment_date, time_slot) → Prevents double booking  
- `ix_appt_user_date` on `(user_id, appointment_date DESC)` → Lists recent appointments  

---

### 1.5 mood_entries

| Field | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Mood entry ID |
| user_id | INT FK(users.id) | Linked user |
| mood_score | INT | Rating from 1–5 |
| note | TEXT | Optional mood note |
| created_at | DATE | Entry creation date |
| updated_at | TIMESTAMPTZ | Last modification |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp |

**Indexes:**  
- `ux_mood_user_date` UNIQUE(user_id, created_at) → One entry per user per day  
- `ix_mood_user_date_desc` on `(user_id, created_at DESC)` → Fast recent mood history  

---

### 1.6 contents

| Field | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Content ID |
| title | VARCHAR | Tip or content title |
| description | TEXT | Content body |
| category | VARCHAR | Content category (e.g., uplifting, calming) |
| is_approved | BOOLEAN | Approved for recommendation |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Updated timestamp |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp |

**Indexes:**  
- `ix_content_approved_category` on `(is_approved, category)` → Fetch approved content quickly  

---

### 1.7 recommendation_rules

| Field | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Rule ID |
| rule_name | VARCHAR | Rule name |
| condition_expr | TEXT | Logic condition expression |
| category_to_show | VARCHAR | Recommended category |
| is_active | BOOLEAN | Active/inactive status |
| created_at | TIMESTAMPTZ | Created timestamp |
| updated_at | TIMESTAMPTZ | Updated timestamp |
| deleted_at | TIMESTAMPTZ | Soft delete timestamp |

**Indexes:**  
- `ix_recommendation_rules_active` on `(is_active)` → Fetch only active rules  

---


## 2. ER Diagram

![Database Schema](../assets/images/database-schema.png)

---

## 3. Relationship Table

| Source Table         | Target Table       | Relationship | Description                            |
| -------------------- | ------------------ | ------------ | -------------------------------------- |
| **users**                | **therapist_profiles** | 1 → 0..1     | A user may have one therapist profile  |
| **therapist_profiles**   | **availability_slots** | 1 → N        | Therapist publishes many slots         |
| **therapist_profiles**   | **appointments**       | 1 → N        | Therapist handles many appointments    |
| **users**                | **appointments**       | 1 → N        | A user books multiple appointments     |
| **availability_slots**   | **appointments**       | 1 → N        | Slot can link to multiple appointments |
| **users**                | **mood_entries**       | 1 → N        | User logs multiple moods               |
| **users**                | **contents**           | 1 → N        | Admin creates multiple contents        |
| **recommendation_rules** | **contents**           | Logical      | Rules filter or suggest contents       |

---

## 4. Index Summary

| Index Name | Table | Fields | Purpose |
|-------------|--------|---------|----------|
| `ux_users_email_lower` | users | lower(email) | Fast login lookup |
| `ux_therapist_user` | therapist_profiles | user_id | One profile per therapist |
| `ix_therapist_specialization_approved` | therapist_profiles | specialization, is_approved | Filter therapists |
| `ix_slots_therapist_day_available` | availability_slots | therapist_id, day_of_week, start_time | Fetch available slots |
| `ux_appt_therapist_date_time` | appointments | therapist_id, appointment_date, time_slot | Prevent double booking |
| `ix_appt_user_date` | appointments | user_id, appointment_date | Retrieve recent appointments |
| `ux_mood_user_date` | mood_entries | user_id, created_at | One entry per day |
| `ix_content_approved_category` | contents | is_approved, category | Fast content fetch |
| `ux_email_token` | email_tokens | token | Token validation |

---

## 5. Triggers

**set_updated_at()**  
Automatically updates the `updated_at` field on every row modification.  

**Applied On:**  
- `users`  
- `therapist_profiles`  
- `availability_slots`  
- `appointments`  
- `contents`  
- `mood_entries`

**Why:** Ensures consistent timestamps without backend logic repetition.

---

## 6. Views (Future Enhancements)

| View Name | Description |
|------------|--------------|
| `active_therapists_view` | Lists all approved therapists with available slots. |
| `mood_trend_view` | Aggregates last 7-day average moods per user. |
| `upcoming_appointments_view` | Displays all confirmed appointments for current week. |

---

