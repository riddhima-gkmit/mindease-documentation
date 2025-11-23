# Use Cases

## Primary Use Cases

---

### UC-01: User Registers and Verifies Account
**Actor:** Patient 

**Goal:** To create an account and verify email before using the system.
**Flow:**

1. User opens the registration page.  
2. Enters name, email, and password.  
3. Clicks **Register**.  
4. The system sends a verification email with a confirmation link.  
5. User opens email and clicks the verification link.  
6. System activates the account and user can log in.

**Alternative:**

- If the email already exists, the system shows an error.  
- If verification link expires, user can request a new one.

---

### UC-02: User Logs In
**Actor:** Patient / Therapist / Admin  
**Goal:** To log into the system securely.

**Flow:**

1. User goes to the login page.  
2. Enters email and password.  
3. Clicks **Login**.  
4. System verifies credentials and issues a JWT token.  
5. User is redirected to their role-based dashboard.

**Alternative:**

- If credentials are invalid, system shows an error message.  
- If the account is not verified, login is denied with prompt to verify email.

---

### UC-03: User Adds Mood Entry
**Actor:** Patient 
**Goal:** To log their emotional state at any time during the day.

**Flow:**

1. User logs into the system.  
2. Opens the **Mood Tracker** section.  
3. Selects a mood score (1-5 emoji scale: Very Sad 😢 to Very Happy 😄).  
4. Optionally adds a short note about their current feelings.  
5. Clicks **Save Entry**.  
6. System stores the entry with timestamp and updates analytics.

**Alternative:**

- User can submit **multiple entries per day** to track mood changes throughout the day.
- If mood score is not selected, form submission fails.
- Each entry is timestamped for accurate tracking.

---

### UC-04: User Views Mood History & Analytics
**Actor:** Patient 
**Goal:** To view their previous mood logs and trends with detailed analytics.

**Flow:**

1. User goes to the **Mood Tracker** page and selects **History & Trends** tab.  
2. System retrieves all mood entries from the database.  
3. **Recent Entries Section**: Displays list of recent mood entries with timestamps (date and time).
4. **Mood Trends Chart**: 
   - Toggle between 7 Days and 30 Days view.
   - Chart shows daily average mood scores (when multiple entries exist per day).
   - Y-axis clearly labeled as "Mood Score".
   - X-axis shows dates.
5. **Analytics Summary**: 
   - Shows average mood score calculated as average of daily averages.
   - Displays trend indicator with emoji (improving, stable, or declining).

**Alternative:**

- If no mood entries exist, show message: "No data available yet."
- If multiple entries exist for a day, that day's chart point represents the daily average.

---

### UC-05: System Suggests Mindfulness Content
**Actor:** System (triggered for User)  
**Goal:** To recommend personalized wellness content based on recent mood trends.

**Flow:** 

1. User navigates to **Daily Tips** or **Recommendations** page.
2. System calculates 7-day average mood using **average of daily averages** method:
   - Groups mood entries by date (IST timezone).
   - Calculates daily average for each date with entries.
   - Calculates overall average from daily averages.
3. Applies rule-based logic to determine category:  
   - Score ≤ 2 → Show "uplifting" content  
   - Score = 3 → Show "maintenance" content  
   - Score ≥ 4 → Show "calming" or "gratitude" content
4. Fetches 3 random content items from the matched category.
5. Displays:
   - Average mood score (7 days) with emoji
   - Recommended focus category
   - 3 wellness tips/exercises with titles and descriptions

**Alternative:**

- If user has no mood data in the last 7 days, display message: "No recent mood data available."
- If no content exists in the matched category, show fallback message.

---

### UC-06: User Browses Therapist Directory
**Actor:** Patient (User)  
**Goal:** To find a therapist for booking.

**Flow:**

1. User opens the **Therapist Directory** page.  
2. System lists all approved therapists.  
3. User filters by specialization, experience, or consultation mode (online/offline).  
4. Selects a therapist to view detailed profile and available slots.  

**Alternative:**

- If no therapists are available, show “No therapists found” message.  
- If user is not logged in, redirect to login page.

---

### UC-07: User Books an Appointment
**Actor:** Patient (User)  
**Goal:** To schedule a therapy session with proper validation.

**Flow:**

1. User views a therapist's profile in the directory.
2. Clicks **Book Appointment** button.
3. **Step 1 - Consultation Mode**: Selects Video Call or In-Person (auto-advances to next step).
4. **Step 2 - Schedule Selection**:
   - Selects a future date from the calendar.
   - System fetches therapist's availability for that day of the week.
   - System fetches already booked slots for that specific date.
   - Displays available time slots (filtering out past times if today, and booked slots).
   - User selects an available time slot.
5. Clicks **Book Appointment**.
6. **Backend Validation**:
   - Checks if appointment date/time is in the past (rejects if true).
   - Checks for double-booking (rejects if slot already booked).
7. System creates appointment record (status: 'pending').
8. Sends confirmation email to both patient and therapist with appointment details.
9. Displays success popup with confirmation message and email notification info.
10. User manually closes the popup.

**Alternative:**

- If appointment is in the past, system shows: "Cannot book appointments in the past."
- If slot is already booked, system shows: "This time slot is already booked."
- If current hour equals or passes the slot time on current day, slot is not shown.
- Success popup persists until user manually closes it.

---

### UC-08: Therapist Views Upcoming Appointments
**Actor:** Therapist  
**Goal:** To see upcoming and completed sessions.

**Flow:**

1. Therapist logs in.  
2. Opens **My Appointments** section.  
3. System shows all upcoming and past sessions sorted by date.  
4. Therapist can filter by status (`Pending`, `Confirmed`, `Completed`).  

**Alternative:**

- If there are no bookings, system displays “No appointments scheduled.”

---

### UC-09: Therapist Adds Session Notes
**Actor:** Therapist  
**Goal:** To add follow-up notes after a therapy session.

**Flow:**

1. Therapist opens the appointment details page.  
2. Adds private notes summarizing the session.  
3. Clicks **Save Notes**.  
4. System stores notes linked to the appointment.  
5. Patient can view notes from their appointment history.  

**Alternative:**

- Notes cannot be added after session is marked `Completed`.  
- Notes are visible only to the patient and therapist.

---

### UC-10: Admin Approves Therapist Profile
**Actor:** Admin  
**Goal:** To review and approve a therapist’s profile before it’s visible to users.

**Flow:**

1. Admin logs into the admin dashboard.  
2. Opens **Therapist Management**.  
3. Reviews pending therapist profiles.  
4. Clicks **Approve** to verify or **Reject** to deny.  
5. System updates profile status and sends email notification to therapist.  

**Alternative:**

- If profile is incomplete, system blocks approval and prompts therapist to update required fields.

---

### UC-11: Admin Manages Users
**Actor:** Admin  
**Goal:** To manage platform user accounts.

**Flow (Create):**

1. Admin navigates to **User Management**.  
2. Clicks **Add New User**.  
3. Enters details like email, password, and role.  
4. Clicks **Create User** → account created.  

**Flow (Deactivate):**

1. Admin finds a user in the list.  
2. Clicks **Deactivate**.  
3. User can no longer log in.  

**Alternatives:**

- Email must be unique.  
- Admin cannot deactivate their own account or the last admin user.

---

### UC-12: Admin Adds Mindfulness Content
**Actor:** Admin  
**Goal:** To create and manage wellness content for recommendations.

**Flow:**

1. Admin logs into Django Admin panel.
2. Navigates to **Content** section.  
3. Clicks **Add Content**.  
4. Enters:
   - Title (max 150 characters)
   - Description (mindfulness tip or exercise)
   - Category: uplifting, calming, maintenance, or gratitude
5. Clicks **Save**.  
6. Content is immediately available for recommendations (no approval workflow).

**Alternative:**

- Admin can edit or delete existing content at any time.
- Deleted content uses soft delete (deleted_at timestamp).  

---

### UC-13: Admin Views System Analytics
**Actor:** Admin  
**Goal:** To view overall platform usage and performance metrics.

**Flow:**

1. Admin opens **Analytics Dashboard**.  
2. System displays data such as:  
   - Total users (active/inactive)  
   - Number of therapists  
   - Total appointments and cancellations  
   - Average mood scores  
3. Admin filters data by date range.  

**Alternative:**

- If no data exists for the selected period, display “No analytics available.”

---

### UC-14: User Resets Password
**Actor:** Patient / Therapist / Admin  
**Goal:** To regain access to their account after forgetting the password.

**Flow:**

1. User clicks **Forgot Password** on login page.  
2. Enters registered email address.  
3. System sends a password reset link.  
4. User clicks the link, enters a new password, and confirms it.  
5. System updates password and allows login with the new credentials.

**Alternative:**

- If token is expired or invalid, system shows an error and allows re-request.  

---

