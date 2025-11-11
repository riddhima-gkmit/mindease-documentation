# AWS-Specific Architecture Diagram

The **MindEase** platform is deployed on **Amazon Web Services (AWS)** using a secure and scalable **three-tier architecture**.  
It separates the application into layers — **presentation**, **application logic**, and **data storage** — all hosted within a protected **Virtual Private Cloud (VPC)**.

---

## AWS Deployment Overview

- **Amazon VPC (Virtual Private Cloud):**  
  Provides a logically isolated environment that hosts all MindEase components.  
  Both backend and database are shielded from direct internet access inside private subnets.

- **Public Subnet:**  
  Hosts the **Application Load Balancer (ALB)**, which serves as the single entry point for all user requests.  
  It forwards traffic to EC2 instances in private subnets while ensuring HTTPS security.

- **Application Load Balancer (ALB):**  
  Manages and distributes incoming requests from users to the EC2 instance running the MindEase application.  
  Ensures load distribution, fault tolerance, and secure SSL/TLS termination.

- **Private Subnet:**  
  Contains the **Amazon EC2** instance that runs both the **Django REST backend** and the **React frontend (PWA)**.  
  This subnet is not directly accessible from the internet, ensuring security of business logic and APIs.

- **Amazon EC2 Instance:**  
  Hosts both **frontend and backend** applications for simplicity in initial deployment.  
  Future scaling can separate these into independent services.  
  The instance interacts with Amazon RDS for database operations and S3 for static/media files.

- **Amazon RDS (PostgreSQL):**  
  Stores all persistent data — users, therapists, appointments, moods, and recommendations.  
  It resides in the same private subnet for secure, low-latency communication with the EC2 instance.

- **Amazon S3 Bucket:**  
  Used to store static assets such as images, therapist profile photos, and uploaded media files.

- **GitHub Actions (CI/CD):**  
  Automates deployment pipelines — when code is pushed to the frontend or backend repositories,  
  GitHub Actions builds and deploys to EC2 using secure SSH or configured runner.  
  This ensures continuous delivery and minimal downtime.

- **User Access:**  
  End users connect to MindEase through the **Application Load Balancer**, which securely routes requests to the EC2 instance.  
  The app is accessed via a web browser or mobile device (PWA) over HTTPS.

---

## Architecture Diagram

![AWS Architecture](../assets/images/architecture-diagram.png)

*Figure: AWS-based deployment architecture of the MindEase system.*

---

## Deployment Summary

| Component | AWS Service | Description |
|------------|--------------|--------------|
| **Frontend** | Amazon EC2 | Hosts the React PWA (web interface) |
| **Backend** | Amazon EC2 | Runs Django REST Framework APIs |
| **Database** | Amazon RDS (PostgreSQL) | Stores persistent user, therapist, and appointment data |
| **Networking** | VPC with Public & Private Subnets | Segregates frontend access and backend security layers |
| **Storage** | Amazon S3 | Stores static assets and media files |
| **Load Balancing** | Application Load Balancer (ALB) | Routes and balances user traffic securely |
| **CI/CD** | GitHub Actions | Automates testing and deployment to EC2 |
| **Users** | Browser / Mobile (PWA) | Access the platform via HTTPS endpoint |

---

> **Tip:**  
> The current setup supports both the **React frontend** and **Django backend** on the same EC2 instance for simplicity.  
> As the project scales, we can:  
> - Add **Auto Scaling Groups** for horizontal scaling  
> - Use **CloudFront CDN** for static content delivery  
> - Integrate **AWS SES** for sending transactional emails  
> - Move frontend to **S3 + CloudFront** for improved performance  

---

> **Scalability Insight:**  
> The architecture allows future migration toward a **multi-tier deployment**,  
> where frontend, backend, and database are scaled independently across multiple EC2 instances for enhanced performance and reliability.

---


