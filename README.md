# MERN Task Management App

A full-stack Task Management application built with the MERN stack (MongoDB, Express, React, Node.js), featuring a modern UI with Tailwind CSS v4 and complete authentication.

## 🚀 Tech Stack

### Frontend

- **React (Vite)**: Fast, modern bundler and component library.
- **Tailwind CSS (v4)**: Utility-first CSS framework for premium, responsive styling.
- **React Hook Form**: Efficient form handling and validation.
- **Axios**: Promise-based HTTP client for API requests.
- **React Hot Toast**: Beautiful toast notifications.
- **Lucide React**: Modern, lightweight icons.

### Backend

- **Node.js & Express**: High-performance server environment.
- **MongoDB & Mongoose**: NoSQL database with strict schema modeling.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Bcrypt**: Password hashing for security.
- **Cors**: Cross-Origin Resource Sharing handling.

---

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js (v14+ installed)
- MongoDB (Running locally or Atlas URI)

### 2. Installation

The project is set up to run both frontend and backend from the root directory using `concurrently`.

```bash
# Clone the repository
git clone <repository-url>
cd assignment

# Install Root Dependencies
npm install

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the `server/` directory. You can copy the example:

```bash
cp server/.env.example server/.env
```

**Required Variables (`server/.env`):**

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/assignment_app_db
JWT_SECRET=your_super_secret_key_change_me
```

### 4. Running the App

From the **root** directory:

```bash
npm start
```

This command runs both the backend (port 5000) and frontend (port 5173/3000) simultaneously.

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 🧪 Demo Data / Seeding (Optional)

To quickly populate the database with test users and tasks, run the seed script:

```bash
# From the root directory
node server/seed.js
```

**Demo Credentials (after seeding):**

1.  **User**: `alice@example.com` / `password123`
2.  **User**: `bob@example.com` / `password123`

---

## 📑 API Documentation

A Postman collection is included in the root directory: `postman_collection.json`.
Import this file into Postman to test all API endpoints (Auth, Tasks, Profile).

---

## 📈 Scaling for Production

To scale this application for a production environment like AWS/GCP, I would implement:

1.  **Deployment**: Dockerize both frontend (Nginx) and backend (Node-Alpine) containers and orchestrate with Kubernetes (EKS/GKE) for auto-scaling. Use CI/CD (GitHub Actions) for automated testing and deployment.
2.  **Database**: Migrate to MongoDB Atlas (Replica Sets) for high availability. Implement Indexing on frequently queried fields (user.\_id, status) and use Redis for caching frequent read operations (e.g., getting user profile).
3.  **Security**: Move `JWT_SECRET` and DB Credentials to a secret manager (AWS Secrets Manager). Tighten CORS policies to allow only the production frontend domain. Set up Rate Limiting (express-rate-limit) to prevent abuse.
4.  **Load Balancing**: Use a Load Balancer (valid SSL/TLS) to distribute traffic across multiple backend instances.
