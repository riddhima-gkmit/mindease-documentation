# MindEase – Mood Tracking & Therapy Booking System

> A Progressive Web App (PWA) that helps users track emotional wellbeing, receive mindful recommendations, and book therapy sessions—with role-based access, analytics, and admin oversight.

!!! tip "What this project demonstrates"
    - Modern **Django + DRF** backend with **JWT** auth  
    - **React PWA** front-end with charts and offline-first UX  
    - **Role-based** flows for Patient, Therapist, Admin  
    - **Analytics**: weekly mood trends, positive/negative ratio  
    - **Book** sessions, manage availability, post-session notes

## Tech Stack

| **Layer**     | **Technology / Tools**                                  | **Purpose** |
|----------------|----------------------------------------------------------|--------------|
| **Frontend**   | React (PWA), Recharts / Chart.js                        | Interactive UI, charts, mood visualization |
| **Backend**    | Django, Django REST Framework (DRF), SimpleJWT           | RESTful APIs, authentication, and business logic |
| **Database**   | PostgreSQL                                              | Data storage for users, moods, appointments, and content |
| **Email**      | SMTP (Mailtrap / Gmail)                                 | Email verification, password reset, appointment notifications |
| **Docs**       | MkDocs Material                                         | Project documentation with themes and navigation |
| **Deployment** | Render (Backend API), Netlify (Frontend PWA)            | Cloud hosting and CI/CD deployment |


## Requirements

### Functional Requirements
- Secure user authentication (JWT, email verification, password reset)  
- Mood tracking with weekly analytics and trends  
- Rule-based mindfulness content recommendations  
- Therapist profiles, availability, and session notes  
- Appointment booking and email confirmations  
- Admin dashboard for content and user management  

### Non-Functional Requirements
- Responsive and user-friendly PWA interface  
- Secure data handling (HTTPS, JWT tokens)  
- Fast API responses (<500ms average)  
- Scalable Django–React–PostgreSQL architecture  
- Reliable email notifications and smooth deployment  





## Quick Overview
=== "Patient"
    - Register/login (email verification, reset password)  
    - Log daily mood (1–5), view trends  
    - Browse therapists, book/cancel appointments  
    - Receive mindful tips based on mood patterns

=== "Therapist"
    - Create profile (specialization, experience, slots)  
    - See upcoming and past appointments  
    - Add session notes (visible to that Patient)

=== "Admin"
    - Manage Patients/therapists  
    - Approve mindfulness content  
    - Platform analytics dashboard


