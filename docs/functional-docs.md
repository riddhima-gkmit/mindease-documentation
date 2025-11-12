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
To help patients easily record their mood and view mental health trends over time.

### Features

#### 2.1 Add Mood Entry
- Daily input using 5-point emoji scale (😢 → 😄).  
- Optional text notes for journaling.  
- Restriction: one entry per day per user.

#### 2.2 Edit Mood Entry
- Users can edit their past mood notes or score (but not delete).  

#### 2.3 View Mood History
- Displays previous moods in timeline or chart view.  
- Filters: weekly, monthly, or custom date range.  

#### 2.4 Analytics Summary
- Computes average mood for last 7 days.  
- Shows trend line (improving, declining, neutral).  
- Quick visualization for therapists and admins.

#### 2.5 Data Integrity
- Duplicate date entries are blocked.  
- Updates preserve data consistency.

---

## Module 3: Therapist Management

### Purpose
To maintain verified therapist profiles with detailed availability and specialization.

### Features

#### 3.1 Therapist Profile Setup
- Fields: specialization, experience, consultation mode (online/offline), clinic address, about, availability slots.  
- Each profile is linked to a registered user account.  

#### 3.2 Profile Approval
- Admin verifies therapist identity before publishing.  
- Unapproved therapists are invisible to patients.  

#### 3.3 Availability Slots
- Therapists define available days and time slots.  
- Slots auto-marked unavailable when booked.  

#### 3.4 Profile Updates
- Therapists can update their details anytime.  
- Changes are subject to admin reapproval (optional).  

---

## Module 4: Appointment Booking

### Purpose
To simplify therapist-patient scheduling and maintain accurate records of consultations.

### Features

#### 4.1 Browse Therapist Directory
- Patients can view all approved therapists.  
- Filters by specialization, experience, or mode (online/offline).  

#### 4.2 Book Appointment
- Patient selects therapist, date, and available time slot.  
- System checks for conflicts (no double bookings).  
- Sends confirmation email to both patient and therapist.  

#### 4.3 Appointment Status Tracking
- Status values: `pending`, `confirmed`, `cancelled`, `completed`.  
- Patients can cancel before session start.  
- Admin can manually override or reassign status if needed.

#### 4.4 Therapist Notes
- After each session, therapist adds private notes visible only to that patient.  
- Notes are editable until the appointment is marked `completed`.  

#### 4.5 Appointment History
- Both therapist and patient can view past and upcoming appointments.  
- Sorted by date/time, filterable by status.  

---

## Module 5: Recommendation Engine

### Purpose
To provide personalized wellness tips based on recent mood trends.

### Features

#### 5.1 Rule-Based Recommendation
- Uses last 7-day average mood score to pick category:  
  - 1-2: “Calming / Gratitude”  
  - 3: “Maintenance / Neutral”  
  - 4-5: “Uplifting / Motivational”  
- Pulls matching content from approved library.

#### 5.2 Content Management
- Admin adds, edits, or deletes mindfulness tips, exercises, or motivational posts.  
- Each piece of content is categorized and timestamped.  

#### 5.3 Delivery
- Patients receive recommendations on dashboard and via email.  
- New suggestions appear daily or when mood trend shifts.  

#### 5.4 Admin Approval Workflow
- Only approved content is used by the recommender.  
- Admin reviews pending items before publishing.

---

## Module 6: Admin Dashboard & Reports

### Purpose
To give administrators full system oversight with real-time analytics.

### Features

#### 6.1 User and Therapist Management
- List all users with filters by role and activity status.  
- CRUD operations: create, update, deactivate accounts.  

#### 6.2 Appointment Insights
- View total bookings, completed sessions, and cancellations.  
- Identify most active therapists and busiest days.  

#### 6.3 Mood Trends Overview
- Displays common moods, average mood score distribution.  
- Track engagement (how many users log moods daily).  

#### 6.4 Recommendation Analytics
- Shows content engagement and delivery count per category.  

#### 6.5 System Reports
- Export reports to CSV or PDF for presentation.  

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

