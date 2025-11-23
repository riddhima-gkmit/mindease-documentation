# MindEase – AWS Architecture 

## Overview

MindEase uses a **hybrid deployment model**:

* **Frontend:** Hosted on **Vercel** (Next.js PWA)
* **Backend:** Hosted on **AWS** using EC2, RDS, and an Application Load Balancer
* **CI/CD:** Automated backend deployments via **GitHub Actions**

This setup provides scalability, security, and fast global performance.

---

## Architecture Diagram

![AWS Architecture](../assets/images/architecture-diagram.png)

---

## AWS Backend Architecture

### Region

**us-east-1 (N. Virginia)**

### VPC Structure

The backend infrastructure runs inside a dedicated **AWS Virtual Private Cloud (VPC)** containing:

#### Public Subnet

* **Application Load Balancer (ALB)**

  * Receives HTTPS traffic from Vercel
  * Routes requests to the EC2 backend

* **Amazon EC2 (Backend Server)**

  * Runs the Django REST Framework API
  * Handles all business logic
  * Communicates privately with RDS

* **Amazon RDS (PostgreSQL)**

  * Stores users, appointments, mood logs, therapist profiles, etc.
  * Accessible only within the VPC

---

## Request Flow

1. Users access the MindEase web app hosted on **Vercel**
2. Vercel sends API requests to the **Application Load Balancer**
3. ALB forwards requests to the **EC2 backend**
4. EC2 reads/writes data from/to **Amazon RDS**
5. Response returns back through EC2 → ALB → Vercel → User

---

## CI/CD (GitHub Actions)

* Backend source code lives in **GitHub**
* On new commits, **GitHub Actions**:

  * Runs tests and build steps
  * Deploys updates to the EC2 instance over SSH
* The frontend on Vercel updates automatically through its own deployment pipeline

---

## Architecture Summary

| Component     | Service                 | Role / Description           |
| ------------- | ----------------------- | ---------------------------- |
| Frontend      | Vercel                  | Hosts the Next.js PWA        |
| Load Balancer | AWS ALB                 | Routes external traffic      |
| Backend       | Amazon EC2              | Runs Django REST API         |
| Database      | Amazon RDS (PostgreSQL) | Stores persistent data       |
| Networking    | AWS VPC + Public Subnet | Isolates and secures backend |
| CI/CD         | GitHub Actions          | Automates backend deployment |

---

## Scalability

The architecture supports seamless scaling, including:

* Adding additional **EC2 instances** behind the Application Load Balancer
* Scaling **RDS** vertically or through read replicas
* Using **Multi-AZ RDS** for high availability
* Offloading static assets, media files, or large file storage to **Amazon S3**, improving performance and reducing server load
* Integrating S3 + CloudFront later for global content distribution

---

