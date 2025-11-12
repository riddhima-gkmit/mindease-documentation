# AWS-Specific Architecture Diagram

The **MindEase** platform is deployed using a **hybrid cloud model** that leverages **Vercel** for the frontend and **Amazon Web Services (AWS)** for the backend infrastructure.  
This setup ensures scalability, performance, and continuous deployment through **GitHub Actions**.

---

## Deployment Overview

- **Frontend (Vercel):**  
  The **React (Next.js) Progressive Web App (PWA)** is hosted on **Vercel**, which provides automatic builds, caching, and edge network distribution for fast user access worldwide.

- **Backend (AWS EC2):**  
  The **Django REST Framework (DRF)** backend runs on an **Amazon EC2 instance** inside a **Virtual Private Cloud (VPC)** for secure and scalable API operations.

- **Database (Amazon RDS – PostgreSQL):**  
  Stores all persistent data such as users, therapists, appointments, moods, and recommendations.  
  The database resides within the same **VPC** for low-latency and secure communication.

- **Virtual Private Cloud (VPC):**  
  The EC2 and RDS instances are isolated inside a **VPC**, ensuring network-level security.  
  The EC2 instance resides in a **public subnet** to allow controlled API access.

- **Public Subnet:**  
  The **public subnet** enables internet access for the EC2 instance (backend), allowing Vercel-hosted frontend to communicate securely via HTTPS.

- **GitHub Actions (CI/CD):**  
  Automated deployment pipelines ensure smooth updates.  
  When code is pushed to the backend repository, **GitHub Actions** deploys the latest version to EC2 using SSH-based workflows.

- **User Access:**  
  Users access the MindEase web app via **Vercel**, which communicates with the **AWS backend APIs** hosted on EC2.  
  All data requests (authentication, mood logs, appointments, etc.) flow securely between Vercel → EC2 → RDS.

---

## Architecture Flow

1. **Users** interact with the **MindEase frontend** hosted on **Vercel**.  
2. The **frontend** sends API requests to the **backend** running on an **Amazon EC2 instance** inside a **VPC (Public Subnet)**.  
3. The **backend (EC2)** communicates with **Amazon RDS (PostgreSQL)** to store and retrieve application data.  
4. **GitHub Actions** automatically deploys backend code changes to EC2 whenever updates are pushed to the repository.

---

## Architecture Diagram

![AWS Architecture](../assets/images/architecture-diagram.png)

*Figure: Hybrid deployment of MindEase using Vercel for frontend and AWS (EC2 + RDS) for backend.*

---

## Deployment Summary

| Component | Platform / Service | Description |
|------------|--------------------|--------------|
| **Frontend** | **Vercel** | Hosts the React.js & PWA for user access |
| **Backend** | **Amazon EC2** | Runs Django REST Framework APIs |
| **Database** | **Amazon RDS (PostgreSQL)** | Stores persistent user and application data |
| **Networking** | **Amazon VPC (Public Subnet)** | Provides isolation and secure API communication |
| **CI/CD** | **GitHub Actions** | Automates testing and deployment to EC2 |
| **Users** | **Browser / Mobile (PWA)** | Access the MindEase app via Vercel frontend |
| **Repository** | **GitHub** | Maintains version control and triggers deployments |

---

## CI/CD Workflow

1. Developer commits changes to the **backend GitHub repository**.  
2. **GitHub Actions** workflow triggers automated build and test steps.  
3. If successful, the workflow deploys updates to the **EC2 instance** via SSH.  
4. The frontend (on Vercel) communicates with the updated API instantly.

---

## Scalability Recommendations

As traffic grows, the system can be scaled easily:

- **Add EC2 instances** behind a **Load Balancer** for horizontal scaling.  
- **Migrate frontend static files** to **S3 + CloudFront** for faster global delivery.  
- **Enable RDS Read Replicas** for improved database performance.  
- **Use AWS CloudWatch & SNS** for proactive monitoring and alerting.

---

![AWS Architecture](../assets/images/future-architecture-diagram.png)

> **Summary:**  
> MindEase’s architecture combines **Vercel’s high-performance frontend delivery** with **AWS’s secure and scalable backend infrastructure**, ensuring a balance between development agility and enterprise-grade reliability.

---


