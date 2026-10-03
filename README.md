# MediAI Backend 🚀

MediAI is an AI-powered healthcare information platform designed to provide users with accessible health information, AI-assisted conversations, health journaling, reminders, and document management.

This repository contains the **Node.js and Express.js backend** of the MediAI application. It provides RESTful APIs, authentication, database management, AI integration, and secure user-specific data handling.

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Google Gemini API
* REST API
* Multer
* CORS
* dotenv

## ✨ Key Features

* 🔐 User Registration & Login
* 👤 User Profile Management
* 🤖 AI-powered Health Assistant
* 💬 AI Chat Management
* 📝 Health Journal CRUD Operations
* ⏰ Reminder Management
* 📄 Document Upload & Management
* 🔒 JWT-based Authentication & Authorization
* 🗄️ MongoDB Database Integration
* 🌐 RESTful API Architecture

## 📁 Project Structure

```text
mediai-backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── index.js
├── package.json
└── .env
```

## 🔑 API Modules

| Module         | Description                                     |
| -------------- | ----------------------------------------------- |
| Authentication | Registration, login and authentication          |
| Profile        | User profile management                         |
| AI Assistant   | AI-powered health information responses         |
| Chat           | Conversation and chat history management        |
| Health Journal | Create, update, view and delete journal entries |
| Reminders      | Manage personal reminders                       |
| Documents      | Upload and manage health-related documents      |

## 🤖 AI Integration

The backend integrates with the **Google Gemini API** to provide AI-assisted responses through a secure server-side implementation.

The API key is stored securely using environment variables and is not exposed to the frontend.

## 🔐 Security

* JWT-based authentication
* Password hashing
* Protected API routes
* Environment variable configuration
* User-specific data access
* Sensitive credentials excluded from version control

## ⚙️ Environment Variables

Create a `.env` file in the backend root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Never commit your `.env` file or API keys to GitHub.

## ▶️ Run Locally

Clone the repository:

```bash
git clone https://github.com/himayahict/mediai-backend.git
```

Navigate to the project:

```bash
cd mediai-backend
```

Install dependencies:

```bash
npm install
```

Create your `.env` file and configure the required environment variables.

Start the development server:

```bash
npm run dev
```

The backend will run locally on:

```text
http://localhost:5000
```

## 📌 Project Purpose

MediAI was developed as a full-stack AI application project to explore:

* Backend development
* REST API design
* AI API integration
* Authentication and authorization
* Database management
* CRUD operations
* File handling
* Cloud deployment

> **Note:** MediAI provides general health information and educational assistance. It is not intended to diagnose medical conditions or replace professional medical advice.
