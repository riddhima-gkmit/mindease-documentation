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
| **Authentication** |
| Register / Login | ✅ | ✅ | ✅ |
| Verify Email | ✅ | ✅ | ✅ |
| Request Password Reset | ✅ | ✅ | ✅ |
| Reset Password | ✅ | ✅ | ✅ |
| **Profile Management** |
| View Own User Profile | ✅ | ✅ | ✅ |
| Edit Own User Profile | ✅ | ✅ | ✅ |
| Create Therapist Profile | ❌ | ✅ | ❌ |
| Edit Therapist Profile | ❌ | ✅ (own) | ❌ |
| View Therapist Profile | ✅ | ✅ | ✅ |
| **Mood Tracking** |
| Add Mood Entry | ✅ | ❌ | ❌ |
| Edit Mood Entry | ✅ (own) | ❌ | ❌ |
| View Mood Entries | ✅ (own) | ❌ | ❌ |
| View Mood Analytics | ✅ (own) | ❌ | ❌ |
| **Therapist Directory** |
| Browse Approved Therapists | ✅ | ✅ | ✅ |
| Filter by Specialization | ✅ | ✅ | ✅ |
| **Appointments** |
| Book Appointment | ✅ | ❌ | ❌ |
| View Appointments | ✅ (own) | ✅ (their patients) | ✅ (all) |
| Cancel Appointment | ✅ (own) | ❌ | ❌ |
| View Booked Slots | ✅ | ✅ | ✅ |
| **Therapist Session Management** |
| Add Session Notes | ❌ | ✅ (their sessions) | ❌ |
| View Session Notes | ✅ (own) | ✅ (their patients) | ❌ |
| Manage Availability Slots | ❌ | ✅ | ❌ |
| View Availability | ✅ | ✅ | ✅ |
| **Admin Functions** |
| Approve Therapist Profiles | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| View All Data | ❌ | ❌ | ✅ |
| Platform Analytics | ❌ | ❌ | ✅ |

### Implementation Notes

**Permission Classes:**
- `AllowAny` - Public endpoints (register, login, password reset, therapist directory)
- `IsAuthenticated` - All protected endpoints require valid JWT token
- Role-specific checks are performed in view logic using `request.user.role.name`

**Key Authorization Rules:**

1. **Mood Entries**: No explicit permission class, but enforced via `filter(user=request.user)` - users only see their own data
2. **Appointments**: 
   - Patients can book and cancel their own appointments
   - Therapists can view appointments for their patients and add session notes
   - Admin can view all appointments
3. **Therapist Profiles**:
   - Only users with `therapist` role can create/update profiles
   - Anyone can view approved therapist profiles (public directory)
4. **Therapist Availability**:
   - Only therapists can manage their own availability
   - Anyone (authenticated) can view availability for booking purposes
5. **Email Verification**:
   - Therapists remain inactive until admin approval even after email verification
   - Patients become active immediately after email verification

---

### Summary

- **Patients** → Can log moods, book appointments, and view personal analytics.  
- **Therapists** → Can manage availability, view their sessions, and add notes.  
- **Admins** → Have complete access to manage users, therapists, content, and analytics.

---

