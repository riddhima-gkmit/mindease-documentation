# Use Cases

## Primary Use Cases

---

### UC-01: User Registers and Verifies Account
**Actor:** Patient (User)  

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

### UC-03: User Adds Daily Mood Entry
**Actor:** Patient (User)  
**Goal:** To log their emotional state for the day.

**Flow:**

1. User logs into the system.  
2. Opens the **Mood Tracker** section.  
3. Selects a mood score (1–5 emoji scale).  
4. Optionally adds a short note about their day.  
5. Clicks **Save Entry**.  
6. System stores the entry and updates 7-day analytics.

**Alternative:**

- If user already submitted an entry today, system prevents duplicate entry.  
- If mood score is not selected, form submission fails.

---

### UC-04: User Views Mood History & Analytics
**Actor:** Patient (User)  
**Goal:** To view their previous mood logs and trends.

**Flow:**

1. User goes to the **Mood History** page.  
2. System retrieves mood entries from the database.  
3. Displays data as a list and chart view (weekly/monthly).  
4. Shows 7-day average mood trend (improving, stable, or declining).  

**Alternative:**

- If no mood entries exist, show message: “No data available yet.”

---

### UC-05: System Suggests Mindfulness Content
**Actor:** System (triggered for User)  
**Goal:** To recommend wellness content based on mood history.

**Flow:** 

1. System checks the user’s average mood score for the last 7 days.  
2. Applies rule-based logic:  
   - Score ≤ 2 → Show uplifting content.  
   - Score = 3 → Show neutral/maintenance tips.  
   - Score ≥ 4 → Show calming or gratitude exercises.  
3. Fetches relevant approved content from the content library.  
4. Displays the tips on the user’s dashboard.  

**Alternative:**

- If no approved content exists in that category, display fallback message: “No new recommendations today.”

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
**Goal:** To schedule a session with a therapist.

**Flow:**

1. User views a therapist’s profile.  
2. Selects an available date and time slot.  
3. Clicks **Book Appointment**.  
4. System checks slot availability.  
5. System creates an appointment record and sends email confirmation to both user and therapist.  

**Alternative:**

- If slot is already booked, system shows: “This slot is no longer available.”  
- If email fails to send, system still confirms booking in dashboard and retries email later.

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
**Goal:** To upload and manage mindfulness content.

**Flow:**

1. Admin goes to **Content Management**.  
2. Clicks **Add New Content**.  
3. Enters title, description, and selects category (Calming / Uplifting / Maintenance / Gratitude).  
4. Clicks **Save**.  
5. Content appears in “Pending Approval” until approved.

**Alternative:**

- If the content title already exists, system shows a duplicate error.  

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

