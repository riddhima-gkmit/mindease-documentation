# Functional Design Document  
**Project Name:** MindEase – Mood Tracking & Therapy Booking System  

---

## 1. Functional Overview
The functional design defines how MindEase implements its business requirements.  
It details the app modules, their key features, workflows, and user interactions.

---

## 2. Functional Modules

### 2.1 Authentication & Authorization
| Feature | Description |
|----------|--------------|
| Register / Login | JWT-based email & password authentication. |
| Email Verification | Users receive confirmation links post-registration. |
| Password Reset | Token/email-based password reset mechanism. |
| Role Management | Patient, Therapist, and Admin roles with role-based access control. |

**Workflow Summary:**  
1. User registers → receives email verification link.  
2. Upon verification → JWT token generated for secure API access.  
3. User logs in and accesses modules as per role permissions.  

---

### 2.2 Mood Tracker
| Feature | Description |
|----------|--------------|
| Add Mood Entry | Patients log daily mood (1–5 scale) with optional notes. |
| View Mood History | Visualize historical data in charts. |
| Edit Entry | Modify past logs if necessary. |
| Weekly Analytics | Display 7-day mood average and trends. |

**Workflow Summary:**  
- User submits mood entry → data stored in `MOOD_ENTRY`.  
- API calculates weekly mood average and trend.  
- Dashboard displays mood analytics with chart visuals.

---

### 2.3 Recommendation Engine (Rule-based)
| Feature | Description |
|----------|--------------|
| Content Suggestions | Display mindfulness tips based on mood trends. |
| Content Management | Admin adds, edits, or deletes mindfulness resources. |
| Feed Display | Patient sees motivational tips and exercises on dashboard. |

**Logic Example:**  
- If average mood < 3 → show uplifting content.  
- If average mood ≥ 3 → show maintenance or gratitude prompts.  

---

### 2.4 Therapist Module
| Feature | Description |
|----------|--------------|
| Profile Setup | Therapist adds specialization, experience, and availability. |
| View Appointments | View upcoming and completed sessions. |
| Add Session Notes | Document confidential feedback for users post-session. |

**Workflow Summary:**  
- Therapist updates profile → data reflected in the therapist directory.  
- Patients book sessions → visible in therapist dashboard.  
- Therapist adds session notes → visible only to the corresponding patient.

---

### 2.5 Appointment Booking
| Feature | Description |
|----------|--------------|
| Therapist Directory | Patients browse and filter therapists by specialization. |
| Book Appointment | Patient selects date/time → receives confirmation email. |
| Cancel Appointment | Cancellation allowed before consultation. |
| View Appointment History | Displays upcoming and past appointments. |

**Workflow Summary:**  
- Patient searches therapist → books available slot.  
- Email confirmation triggered via SMTP.  
- Appointment status managed as Pending/Confirmed/Cancelled/Completed.  

---

### 2.6 Admin Panel
| Feature | Description |
|----------|--------------|
| Manage Patients/Therapists | Admin performs CRUD on user accounts. |
| Content Approval | Admin reviews and approves mindfulness content. |
| Analytics Dashboard | Displays usage metrics and mood trends. |

**Admin Capabilities:**  
- Activate/deactivate users.  
- Approve or reject new content.  
- Generate reports for engagement and platform activity.

---

## 3. Functional Data Flow
```
User → Register → Email Verification → Login (JWT)
 → Add Mood Entry → Analytics Engine → Mood Insights
 → Recommendation Engine → Personalized Feed
 → Therapist Selection → Appointment Booking → Confirmation Email
 → Therapist Notes → User Dashboard
 → Admin Oversight → Reports & Analytics
```

---

## 4. Key Functional Interfaces
| Interface | Source | Destination | Description |
|------------|---------|-------------|--------------|
| Auth API | Frontend | Backend | Manages JWT token issuance and user login. |
| Mood API | Frontend | Backend | Handles CRUD for mood entries and analytics. |
| Email API | Backend | SMTP (Mailtrap/Gmail) | Sends verification and reset emails. |
| Appointment API | Frontend | Backend | Manages therapist booking operations. |
| Admin API | Backend | Database | Performs data management and analytics queries. |

---

## 5. Constraints & Assumptions
- Patients must verify their email before accessing main features.  
- Therapists are verified manually by Admins.  
- The rule-based recommendation engine will later evolve into an AI-powered model.  
- System uptime must remain above 99%.  

---

## 6. Dependencies
| Component | Description |
|------------|-------------|
| Django REST Framework | API development backbone. |
| PostgreSQL | Primary data store for user and mood data. |
| React.js | Frontend PWA interface. |
| SMTP (Mailtrap/Gmail) | Email sending service. |
| JWT | Secure authentication tokens. |

---

## 7. Future Enhancements
- AI-driven mood prediction and smart recommendations.  
- Integration with wearable devices for passive mood sensing.  
- Chatbot-based counseling assistance.  

---
