# ExpenseMate — A Daily Expense Tracker

ExpenseMate is a comprehensive full-stack personal finance management application built to help users efficiently track daily expenses, manage multiple account types, monitor balances, and gain meaningful financial insights through interactive analytics.

## Project Overview

ExpenseMate combines a modern React frontend with a scalable Node.js backend and MongoDB database, delivering a secure, responsive, and production-ready financial management experience.

### 1. Architecture & Tech Stack

**Frontend**

* React 18 + TypeScript
* Vite
* Tailwind CSS
* Recharts
* Lucide Icons
* Axios with interceptors

**Backend**

* Node.js + Express.js
* TypeScript
* Mongoose ODM
* MongoDB Atlas
* RESTful APIs

**Security**

* JWT-based stateless authentication
* 6-digit email OTP-based 2FA
* Helmet with CSP headers
* NoSQL injection protection
* Authentication rate limiting
* Strict CORS validation

### 2. Core Features

* Bank, Cash, Credit, Investment, and FD account management
* Centralized balance and financial calculation engine
* Customizable drag-and-drop dashboard widgets
* Interactive Pie, Bar, Line, and Cumulative Area charts
* Financial summaries and analytics

### 3. Engineering Standards

The project follows strict code-quality and maintainability standards:

* **Ln 300:** Every project file is maintained below 300 lines
* **Col 120:** Code is maintained within a 120-character line width
* **Zero Magic Values:** Routes, colors, labels, messages, and reusable constants are centrally managed

### 4. Deployment & Configuration

* Unified full-stack deployment using the root-level `vercel.json`
* Environment-specific configuration
* Sanitized `CLIENT_URL` handling
* `.env.example` templates for frontend and backend
* Production-ready monorepo architecture

### 5. Key Principles

**Security • Maintainability • Scalability • Consistency • Production Readiness**

For detailed architecture, project structure, API documentation, security implementation, development standards, and deployment instructions, refer to the **Project Overview Document**.
