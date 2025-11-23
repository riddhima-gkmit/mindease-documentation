# Tech Stack

## Frontend

| Technology | Purpose |
|-------------|----------|
| **React.js (18+)** | Build interactive and responsive UI with TypeScript. |
| **TypeScript** | Type-safe development with strict type checking. |
| **PWA (Progressive Web App)** | Enable mobile-like experience with offline support and installability. |
| **Vite** | Fast React build tool and dev environment with HMR. |
| **React Router** | Handle client-side page navigation. |
| **Tailwind CSS** | Utility-first CSS framework for responsive design. |
| **Recharts** | Display mood analytics, trends, and chart visualizations. |
| **Axios** | Manage API calls with interceptors for token refresh. |
| **Lucide React** | Modern icon library for UI components. |

---

## Backend

| Technology | Purpose |
|-------------|----------|
| **Python** | Core backend language. |
| **Django** | Backend framework for logic and routing. |
| **Django REST Framework (DRF)** | Build RESTful APIs. |
| **PostgreSQL** | Store users, moods, and appointments. |
| **JWT (SimpleJWT)** | Secure authentication and authorization. |
| **SMTP (Gmail)** | Send verification and booking emails. |
| **pytest Tests** | Run automated backend tests. |

---

## DevOps & Deployment

| Technology | Purpose |
|-------------|----------|
| **Vercel** | Deploy and host frontend. |
| **AWS** | Cloud hosting and storage. |
| **GitHub Actions** | Automate testing and deployment. |
| **GitHub** | Version control and collaboration. |
| **Docker** | Containerize and manage environments. |

---

## Documentation

| Technology | Purpose |
|-------------|----------|
| **MkDocs (Material Theme)** | Build and publish project docs. |
| **Mermaid.js** | Create architecture and data flow diagrams. |

---

## Key Integrations

- **JWT Authentication with Token Refresh** → Secure token-based login with automatic token refresh on 401 errors.  
- **Email System** → Django email backend for verification and appointment confirmations.  
- **PWA Support** → Full PWA capabilities with custom logo and caching.  
- **Charts with Daily Averages** → Recharts visualization showing mood trends with intelligent daily averaging.  
- **Timezone Handling** → IST (Asia/Kolkata) timezone for consistent mood data aggregation.
- **Role-Based Access Control** → Flexible role system with many-to-many user-role relationships.
- **Soft Delete Pattern** → All models support soft deletion for data integrity.

---

## Data Models

- **UUID Primary Keys** → All main models use UUID for better security and scalability.
- **Soft Delete Implementation** → SoftDeleteModel base class with deleted_at timestamps.
- **Custom User Manager** → Extends Django's BaseUserManager with soft delete support.
- **Junction Tables** → UserRole table for many-to-many user-role relationships.
- **Unique Constraints** → Database-level constraints for data integrity (e.g., active appointments only).

---

