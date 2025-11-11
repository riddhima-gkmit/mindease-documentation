# Authentication & Authorization

## Authentication Flow

- User enters **email** and **password** on the login page.  
- The backend verifies credentials and email verification status.  
- If valid, a **JWT token** is issued and the user is redirected to their **role-specific dashboard**.  
- If invalid, an error message is shown.

### Sequence Diagram

![Authentication Flow](../assets/images/auth-flow.png)



---

## Authorization Rules (Role-Based Access Control)

MindEase uses **RBAC (Role-Based Access Control)** to ensure users can only perform actions allowed for their role.

| Action | Patient | Therapist | Admin |
|--------|:-------:|:----------:|:-----:|
| Register / Login | ✅ | ✅ | ✅ |
| Verify Email / Reset Password | ✅ | ✅ | ✅ |
| View / Edit Own Profile | ✅ | ✅ | ✅ |
| Add / Edit Mood Entry | ✅ | ❌ | ❌ |
| View Mood Analytics | ✅ (own) | ❌ | ✅ (global) |
| Browse Therapist Directory | ✅ | ✅ | ✅ |
| Book / Cancel Appointment | ✅ | ✅ (own only) | ✅ |
| Manage Availability / Slots | ❌ | ✅ | ✅ |
| Add Session Notes | ❌ | ✅ | ✅ |
| View Session Notes | ✅ (own) | ✅ (their patients) | ✅ |
| Manage Users & Therapists | ❌ | ❌ | ✅ |
| Approve Content / Therapists | ❌ | ❌ | ✅ |
| View Platform Analytics | ❌ | ❌ | ✅ |

---

### Summary

- **Patients** → Can log moods, book appointments, and view personal analytics.  
- **Therapists** → Can manage availability, view their sessions, and add notes.  
- **Admins** → Have complete access to manage users, therapists, content, and analytics.

---

