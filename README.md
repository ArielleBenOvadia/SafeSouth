# SafeSouth 🏠🤝

SafeSouth is a full-stack web platform designed to connect hosts with families who were evacuated from their homes due to the security situation.  
The system enables user registration, authentication, post publishing, image uploads, and automatic content generation using OpenAI.

---

## 🧱 Tech Stack

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication (Access Token + Refresh Token)
- Multer (file uploads)
- Swagger (API documentation)

### Frontend
- React
- TypeScript
- Vite
- Axios
- React Router
- Context API
- Bootstrap

### AI Integration
- OpenAI API (automatic post content generation)

---

## 📁 Project Structure

SafeSouth/
├── Back/                # Backend (API server)
│   ├── src/
│   ├── public/          # Uploaded images
│   ├── .env             # Environment variables (not committed)
│   └── package.json
│
├── Front/               # Frontend (React)
│   ├── src/
│   ├── .env             # Environment variables (not committed)
│   └── package.json
│
└── README.md

---

## ⚙️ Environment Variables

### Backend – Back/.env
DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/safesouth  
PORT=3001  
JWT_SECRET=your_jwt_secret  
JWT_REFRESH_SECRET=your_refresh_secret  
JWT_EXPIRATION=1h  
NODE_ENV=development  

### Frontend – Front/.env
VITE_OPENAI_API_KEY=your_openai_api_key  

⚠️ Important:  
.env files are intentionally excluded from GitHub via .gitignore.

---

## 🚀 Running the Project Locally

### Backend
cd Back  
npm install  
npm run dev  

Server runs on:  
http://localhost:3001  

Swagger API docs:  
http://localhost:3001/api-docs  

---

### Frontend
cd Front  
npm install  
npm run dev  

Frontend runs on:  
http://localhost:5173  

---

## 🔐 Authentication

- User registration and login using JWT
- Access Token + Refresh Token mechanism
- Authorization header format:

Authorization: Bearer <accessToken>

- Tokens are refreshed automatically when expired

---

## 🧠 AI-Generated Content (OpenAI)

The system supports automatic generation of post content using OpenAI.

Relevant file:  
Front/src/services/completions.ts  

The generated content is based on:
- Host name
- Location
- Hosting capacity

The response is returned as ready-to-publish text without system prefixes.

---

## 📸 Image Uploads

- Images are uploaded to the backend using Multer
- Stored under Back/public
- A public URL is returned to the frontend

---

## 🛡️ Security

- JWT secrets are stored in environment variables
- OpenAI API key is not hardcoded
- Sensitive files and folders are excluded from Git tracking

---

## 🧪 Development Scripts

Run tests:  
npm test  

Build for production:  
npm run build  

---

## ✨ Notes

- Developed as an academic and social-impact project
- Includes full authentication flow and AI integration
- Designed for scalability and future deployment

---

👩‍💻 Developed by Arielle Ben Ovadia
