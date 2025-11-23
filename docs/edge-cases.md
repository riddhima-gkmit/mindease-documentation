# Edge Cases & Error Handling

This document explains how **MindEase** handles common issues and unexpected situations across key modules like authentication, mood tracking, therapist management, and appointment booking.

---

## 1. Authentication & Account Access

**Problem:** User leaves email or password empty.  
**Solution:** Show “Email and password are required.” → **Status Code: 400 Bad Request**

**Problem:** Invalid email or password.  
**Solution:** Show “Invalid credentials.” → **Status Code: 401 Unauthorized**

**Problem:** Email not verified.  
**Solution:** Show “Email not verified. Please verify to continue.” → **Status Code: 403 Forbidden**

**Problem:** Duplicate email registration.  
**Solution:** Show “Account with this email already exists.” → **Status Code: 409 Conflict**

**Problem:** Expired or invalid token.  
**Solution:** Show “Invalid or expired token.” → **Status Code: 401 Unauthorized**

---

## 2. Mood Tracker

**Problem:** Invalid mood score (not 1–5).  
**Solution:** Show "Mood score must be between 1 and 5." → **Status Code: 400 Bad Request**

**Problem:** User tries to delete a mood entry.  
**Solution:** Soft delete implemented - entries marked with deleted_at timestamp. → **Status Code: 204 No Content**

**Problem:** Not enough mood data for analytics or trends.  
**Solution:** Show "No recent mood data available." on recommendations page. → **Status Code: 200 OK** (with message in response)

**Problem:** Multiple entries for the same day.  
**Solution:** **Allowed** - System calculates daily average when multiple entries exist. Chart shows one data point per day representing the daily average. → **Status Code: 201 Created** (for each entry)

**Problem:** Analytics calculation with multiple entries per day.  
**Solution:** System groups entries by date (IST timezone), calculates daily averages, then calculates overall average as the average of daily averages (not simple average of all entries).

---

## 3. Therapist Profile & Availability

**Problem:** Missing required fields in profile.  
**Solution:** Show "Please fill all required fields." → **Status Code: 400 Bad Request**

**Problem:** Experience years exceeds limit.  
**Solution:** Frontend limits input to max 55 years. Backend validation also enforces 0-55 range. Show validation error if exceeded. → **Status Code: 400 Bad Request**

**Problem:** Invalid specialization or consultation mode.  
**Solution:** Validation on both frontend and backend. Show error message. → **Status Code: 400 Bad Request**

**Problem:** Therapist not approved.  
**Solution:** Hide from directory until admin approves (is_approved=True). Only approved therapists visible in public listing. → **Preventive measure**

**Problem:** Availability slots not matching appointment requests.  
**Solution:** System stores recurring weekly availability (day_of_week). When booking, system checks if the selected date's day matches available days and times.

---

## 4. Appointment Booking

**Problem:** Booking unapproved therapist.  
**Solution:** Unapproved therapists are hidden from the directory (not shown to patients). → **Preventive measure (no API call made)**

**Problem:** Booking appointment in the past.  
**Solution:** Backend validation prevents booking past dates/times. Show "Cannot book appointments in the past. Please select a future date and time." → **Status Code: 400 Bad Request**

**Problem:** Two users book the same slot simultaneously.  
**Solution:** Database constraint prevents double-booking (unique constraint on therapist, date, time_slot for active appointments). Show "This time slot is already booked." → **Status Code: 400 Bad Request**

**Problem:** User selects time slot that has already passed today.  
**Solution:** Frontend filters out past time slots for current date. Backend validation also prevents booking. → **Preventive measure + 400 Bad Request**

**Problem:** Invalid or unavailable time slot.  
**Solution:** Frontend fetches booked slots and disables them. Show visual indicator for booked slots. → **Preventive measure (no API call made)**

**Problem:** Confirmation email fails to send.  
**Solution:** Appointment is still created successfully. Email sending happens after appointment creation. → **Status Code: 201 Created** (appointment created even if email fails)

---

## 5. Session Notes & Privacy

**Problem:** Therapist views another patient’s notes.  
**Solution:** Show “Access denied.” → **Status Code: 403 Forbidden**

**Problem:** Patient tries to view someone else’s session.  
**Solution:** Show “You don’t have permission.” → **Status Code: 403 Forbidden**

**Problem:** Session note not saved due to timeout.  
**Solution:** Auto-save drafts periodically. → **Status Code: 408 Request Timeout**

---

## 6. Recommendation Engine

**Problem:** No mood data in the last 7 days.  
**Solution:** Show "No recent mood data available." → **Status Code: 200 OK** (with message in response)

**Problem:** No content found for mood category.  
**Solution:** Show message in response. Admin should create content for that category. → **Status Code: 200 OK** (with empty recommendations array)

**Problem:** Timezone differences in mood data aggregation.  
**Solution:** All mood data is calculated using IST (Asia/Kolkata) timezone for consistency between recommendations and chart data.

---

## 7. Admin & Management

**Problem:** Admin deletes content.  
**Solution:** Soft delete implemented - content marked with deleted_at timestamp, not permanently deleted. → **Status Code: 204 No Content**

**Problem:** Admin tries to access hidden models in Django admin.  
**Solution:** Only User, Content (RecommendationContent), and TherapistProfile models are visible in Django admin. Other models (appointments, mood entries, availability) are hidden. → **Preventive measure**

**Problem:** Role assignment and management.  
**Solution:** Users can have multiple roles through UserRole junction table. Admin can assign/revoke roles. Active roles are determined by revoked_at field (NULL = active).

---

## 8. Email & Token Handling

**Problem:** Verification email not received.  
**Solution:** Allow resend — show “Didn’t get it? Resend link.” → **Status Code: 202 Accepted**

**Problem:** Expired or reused verification link.  
**Solution:** Show “Link expired. Request a new one.” → **Status Code: 410 Gone**

**Problem:** Email service error.  
**Solution:** Retry and log for admin alert. → **Status Code: 502 Bad Gateway**

---

## Summary

MindEase ensures a smooth experience by:

- Validating all inputs.  
- Preventing duplicate or invalid actions.  
- Handling errors gracefully with clear messages.  
- Maintaining data safety through transactions and rollbacks.  
- Alerting admins for recurring or system-level issues.  

**Goal:** To provide a secure, reliable, and user-friendly experience even when errors occur.
