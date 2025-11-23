# Functional Documentation

## User Roles

| Role | Access | What they can do |
|------|---------|------------------|
| **Admin** | Full | Manage users and therapists, approve therapist profiles, manage wellness content and recommendations, view analytics and reports. |
| **Therapist** | Limited | Create and manage their profile, set available slots, view and update appointments, add therapy session notes visible to patients. |
| **Patient (User)** | Limited | Register/login, track mood daily, view mood history and trends, get recommendations, browse therapists, book or cancel appointments. |

---

## System Modules Overview

MindEase consists of seven main modules that together support mental wellness tracking and therapy management.

---

## Module 1: Authentication & Authorization

### Purpose
To secure the system and ensure users access only the features permitted for their role.

### Features

#### 1.1 Patient Registration
- Patients can register using email and password.  
- Email verification link is sent before account activation.  
- Role is assigned automatically (patient by default).  

#### 1.2 Therapist & Admin Account Setup
- Therapists are created or approved by admin.  
- Admin can assign or change roles (patient ↔ therapist ↔ admin).  

#### 1.3 User Login
- Email + password-based login.  
- Returns JWT token for secure API calls.  
- Invalid credentials → proper error messages.

#### 1.4 Password Reset Flow
- Password reset request via email link.  
- Secure, token-based password reset with expiry.  

#### 1.5 Role-Based Access Control
- **Patient:** access only mood, booking, and self-data APIs.  
- **Therapist:** can view only their assigned appointments and notes.  
- **Admin:** has full CRUD access across all modules.  

---

## Module 2: Mood Tracking & Analytics

### Purpose
To help patients easily record their mood and view mental health trends over time with flexible, multi-entry logging.

### Features

#### 2.1 Add Mood Entry
- Input using 5-point emoji scale (😢 → 😄) representing mood levels.  
- Optional text notes for journaling and context.  
- **Multiple entries per day allowed** - users can log mood changes throughout the day.
- Each entry is timestamped with date and time for accurate tracking.

#### 2.2 Edit Mood Entry
- Users can edit their past mood notes or scores.  
- Each entry maintains its original timestamp.

#### 2.3 View Mood History
- Displays all mood entries with timestamps in a timeline view.  
- Shows multiple entries per day with their individual timestamps.
- Sorted by most recent first for easy access.

#### 2.4 Analytics & Trends
- **Daily Averages**: When multiple entries exist for a day, the system calculates the daily average.
- **7-Day & 30-Day Trends**: Chart visualization with configurable date ranges.
- **Average Mood Calculation**: Calculated as the average of daily averages (not simple average of all entries).
- **Trend Analysis**: Shows if mood is improving, declining, or stable over time.
- **Y-Axis Label**: Chart clearly shows "Mood Score" on the y-axis for better understanding.

#### 2.5 Data Integrity
- All entries are timestamped and preserved.  
- Updates maintain data consistency.
- Soft delete implementation - entries are never permanently deleted.

---

## Module 3: Therapist Management

### Purpose
To maintain verified therapist profiles with detailed availability and specialization.

### Features

#### 3.1 Therapist Profile Setup
- Fields: specialization, experience (0-55 years), consultation mode (online/offline/both), clinic address, about section.  
- Each profile is linked to a registered user account (OneToOne relationship).  
- Experience years validated on both frontend and backend (max 55 years).

#### 3.2 Profile Approval
- Admin verifies and approves therapist profiles before publishing.  
- Unapproved therapists are invisible to patients in the directory.  
- Only admins can change approval status.

#### 3.3 Availability Slots
- Therapists define recurring weekly availability (day of week + time ranges).  
- System checks slot availability in real-time during booking.
- Booked slots API endpoint prevents double-booking on the frontend.

#### 3.4 Profile Updates
- Therapists can update their details anytime.  
- Profile remains visible to patients during updates.  

---

## Module 4: Appointment Booking

### Purpose
To simplify therapist-patient scheduling and maintain accurate records of consultations with robust validation.

### Features

#### 4.1 Browse Therapist Directory
- Patients can view all approved therapists in a paginated list.  
- Filters by specialization and consultation mode (online/offline/both).
- View detailed therapist profiles including experience, about section, and availability.

#### 4.2 Book Appointment
- **Consultation Mode Selection**: Choose between Video Call or In-Person (auto-advances to next step).
- **Date Selection**: Calendar view with only future dates enabled.
- **Time Slot Selection**: Shows only available slots based on therapist's weekly schedule.
- **Real-time Validation**:
  - Prevents booking appointments in the past (server-side validation).
  - Disables already booked time slots (fetched via API).
  - Filters out time slots that have passed for the current day.
- **Confirmation**: Sends confirmation email to both patient and therapist with appointment details.
- **Success Popup**: Persistent confirmation message with email notification info (manual close required).

#### 4.3 Appointment Status Tracking
- Status values: `pending`, `confirmed`, `cancelled`, `completed`.  
- Patients can cancel appointments before the session.
- Unique constraint on active appointments prevents therapist double-booking.

#### 4.4 Therapist Notes
- After each session, therapist adds session notes visible to that patient.  
- Notes are editable and visible in appointment history.

#### 4.5 Appointment History
- Both therapist and patient can view past and upcoming appointments.  
- Paginated list sorted by date and time (most recent first).
- Filterable by status for easy management.  

---

## Module 5: Recommendation Engine

### Purpose
To provide personalized wellness tips based on recent mood trends using intelligent averaging.

### Features

#### 5.1 Rule-Based Recommendation
- Analyzes last 7-day mood data with **average of daily averages** calculation.
- Categorizes recommendations based on mood score:  
  - ≤ 2: "Uplifting" content  
  - = 3: "Maintenance" content  
  - ≥ 4: "Calming" or "Gratitude" content
- Returns 3 random content items from the matched category.
- Displays average mood score (rounded to 2 decimals) and recommended category.

#### 5.2 Content Management
- Admin creates, edits, or deletes mindfulness tips, exercises, and wellness content.  
- Categories: `uplifting`, `calming`, `maintenance`, `gratitude`.
- Direct publishing - no approval workflow needed.
- Content visible immediately after creation.

#### 5.3 Delivery
- Patients view recommendations on their "Daily Tips" page.
- Displays personalized content based on recent 7-day mood trend.
- Shows average mood score with emoji indicator.

---

## Module 6: Admin Dashboard

### Purpose
To give administrators system management capabilities for users, therapists, and content.

### Features

#### 6.1 User and Therapist Management
- Manage users with role assignment using Role model and UserRole junction table.
- View and edit user profiles, email verification status, and account status.
- Multiple roles per user supported through many-to-many relationship.
- List view shows: ID, username, email, roles, activity status, verification status, and timestamps.

#### 6.2 Therapist Profile Management
- Approve or reject therapist profiles.
- View therapist details: specialization, experience, consultation mode, about, clinic address.
- Manage therapist visibility to patients.

#### 6.3 Content Management
- Create, edit, and delete recommendation content.
- Categorize content: uplifting, calming, maintenance, gratitude.
- Direct publishing without approval workflow.

#### 6.4 Visible Admin Models
Django Admin interface shows only:
- **User**: Complete user management with inline role assignment
- **Content** (RecommendationContent): Wellness content management  
- **TherapistProfile**: Therapist profile approval and management  

---

## Module 7: Email Notification System

### Purpose
To automate user notifications for important actions.

### Features

#### 7.1 Verification Emails
- Sent automatically upon registration.  
- Includes secure, time-limited token link.  

#### 7.2 Appointment Confirmation
- Sends email after booking or cancellation.  
- Includes therapist name, time, and session link (if online).  

#### 7.3 Password Reset
- Secure token sent for forgotten passwords.  
- Link expires automatically after set duration.  

#### 7.4 Admin Alerts
- Optional notifications when new therapists register or new content is added.

---

