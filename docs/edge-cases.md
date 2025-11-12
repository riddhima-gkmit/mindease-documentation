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

**Problem:** Duplicate mood entry for the same day.  
**Solution:** Show “Mood for today already logged.” → **Status Code: 409 Conflict**

**Problem:** Invalid mood score (not 1–5).  
**Solution:** Show “Mood score must be between 1 and 5.” → **Status Code: 400 Bad Request**

**Problem:** User tries to delete a mood entry.  
**Solution:** Deletion not allowed — only edits permitted. → **Status Code: 405 Method Not Allowed**

**Problem:** Not enough data for analytics.  
**Solution:** Show “Not enough data to display insights.” → **Status Code: 204 No Content**

---

## 3. Therapist Profile & Availability

**Problem:** Missing required fields in profile.  
**Solution:** Show “Please fill all required fields.” → **Status Code: 400 Bad Request**

**Problem:** Overlapping time slots.  
**Solution:** Show “Time slots overlap. Please adjust.” → **Status Code: 409 Conflict**

**Problem:** Therapist not approved.  
**Solution:** Hide from directory until admin approval. → **Status Code: 403 Forbidden**

---

## 4. Appointment Booking

**Problem:** Booking unapproved therapist.  
**Solution:** Show “Therapist not available for booking.” → **Status Code: 403 Forbidden**

**Problem:** Two users book the same slot.  
**Solution:** Show “Selected slot already booked.” → **Status Code: 409 Conflict**

**Problem:** Cancellation too close to session time.  
**Solution:** Show “Cancellations allowed up to 2 hours before.” → **Status Code: 400 Bad Request**

**Problem:** Invalid or unavailable time slot.  
**Solution:** Show “Slot not available.” → **Status Code: 404 Not Found**

**Problem:** Network or server issue during booking.  
**Solution:** Retry or prompt “Booking failed. Try again.” → **Status Code: 500 Internal Server Error**

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

**Problem:** No content found for mood category.  
**Solution:** Show “No recommendations available.” → **Status Code: 204 No Content**

**Problem:** Invalid or missing content category.  
**Solution:** Show “Category required.” → **Status Code: 400 Bad Request**

**Problem:** Recommendation rule misconfigured.  
**Solution:** Log error and show generic “Daily wellness tip.” → **Status Code: 500 Internal Server Error**

---

## 7. Admin & Management

**Problem:** Admin deletes content in use.  
**Solution:** Prevent deletion — show “Content in use.” → **Status Code: 409 Conflict**

**Problem:** Admin tries to deactivate self.  
**Solution:** Show “You can’t deactivate your own account.” → **Status Code: 400 Bad Request**

**Problem:** Last admin deactivation attempt.  
**Solution:** Show “Add another admin before deactivating.” → **Status Code: 403 Forbidden**

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
