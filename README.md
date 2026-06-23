# Store Rating Application

A full-stack web application designed to allow users to search, view, and rate local stores while providing administrators and store owners with dedicated dashboards to manage listings, reviews, and metrics.

---

## 🚀 Tech Stack

### Backend
* **Framework:** NestJS (Node.js)
* **Language:** TypeScript
* **Database:** MySQL
* **Authentication:** JWT (JSON Web Tokens) with Role-Based Access Control (Admin, Owner, User)

### Frontend
* **Framework:** Vite + React.js
* **Styling:** Tailwind CSS
* **Build Tool:** Vite

---

## 📁 Repository Structure

The project is structured as a monorepo consisting of decoupled frontend and backend applications managed under a single root repository workspace:

```text
store-rating-app/
├── backend/          # NestJS backend application API
│   ├── src/          # Source files (Auth, Users, Stores, Ratings modules)
│   └── package.json
├── frontend/         # React.js frontend UI application
│   ├── src/          # Components (Dashboards, Login, Register)
│   └── package.json
└── .gitignore        # Master root gitignore rule file
