# MindEase
**A simple, web-based system for mood tracking, therapist booking, and personalized wellness recommendations.**

---

## The Problem
People seeking mental wellness and small clinics face three main challenges:

1. **Fragmented Mood Tracking & No Context**  
   Users track feelings manually or not at all - no reliable daily history, making it hard to spot trends or triggers.

2. **Manual Appointment Scheduling**  
   Booking exchanges (calls/messages) are slow and error-prone. Therapists and patients lose time coordinating.

3. **No Personalized Guidance**  
   Users receive generic tips or none at all; clinicians lack quick insight-driven suggestions based on recent mood history.

---

## The Solution - MindEase
MindEase automates daily mood tracking, appointment booking, and delivers simple, rule-based recommendations. It consists of three main parts:

- **Mood Tracking:** Quick daily entries (emoji/score + note) stored as history.  
- **Appointment Booking:** Browse therapists, book confirmed slots, and receive email confirmations.  
- **Recommendations:** Rule-based tips delivered from recent 7-day mood trends.

### Key Features
- Email + JWT authentication and role-based access (patient / therapist / admin)  
- One-entry-per-day mood logging with a weekly analytics endpoint  
- Therapist profiles + availability and approval workflow for admins  
- Appointment booking with conflict prevention and session notes  
- Admin-managed content library and rule-based recommendations

---

## Quick Overview
=== "Patient"
    - Register/login (email verification, reset password)  
    - Log daily mood (1-5), view trends  
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


