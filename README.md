# 📚 Text-to-Learn — AI Course Generator

<div align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.2-6DB33F?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?style=for-the-badge&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css)

**Transform any topic into a structured, AI-generated learning course — instantly.**

</div>

---

## ✨ Features

- 🤖 **AI-Powered Course Generation** — Enter any topic and get a complete, structured course with modules and lessons using OpenRouter AI
- 🎬 **YouTube Video Integration** — Each lesson is enriched with relevant YouTube videos fetched via YouTube Data API v3
- 🔐 **Authentication System** — Full user auth with local email/password login and simulated Google Sign-In
- 👤 **Guest Mode** — Try course generation without creating an account
- 📊 **Progress Tracking** — Track lesson completion and course progress per user
- 📄 **PDF Export** — Export any lesson as a PDF document
- 🏆 **Certificate Generation** — Earn a certificate upon completing a course
- 💾 **Persistent Storage** — PostgreSQL-backed data persistence for users, courses, modules, and lessons
- 🔄 **Session Management** — Secure cookie-based session with 7-day expiry

---

## 🏗️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Core language |
| Spring Boot | 4.0.2 | Application framework |
| Spring Security | — | Authentication & authorization |
| Spring AI | 2.0.0 | OpenRouter/OpenAI integration |
| Spring Data JPA | — | Database ORM |
| Spring WebFlux | — | Reactive HTTP client (YouTube API) |
| PostgreSQL | — | Primary database |
| Lombok | 1.18.30 | Boilerplate reduction |
| ModelMapper | 3.2.4 | DTO mapping |
| dotenv-java | 3.0.0 | Environment variable loading |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Vite | 5 | Build tool & dev server |
| React Router DOM | 7 | Client-side routing |
| Tailwind CSS | 4 | Utility-first styling |
| Framer Motion | 12 | Animations |
| Axios | — | HTTP client |
| Lucide React | — | Icon library |
| jsPDF + html2canvas | — | PDF export |
| React Syntax Highlighter | — | Code block rendering |

---

## 📁 Project Structure

```
Text-to-Learn-AI-Course-Generator/
│
├── 📄 pom.xml                          # Maven project descriptor
├── 📄 .env                             # Environment variables (not committed)
├── 📄 mvnw / mvnw.cmd                  # Maven wrapper scripts
│
├── 📂 src/main/
│   ├── 📂 java/com/example/backend/Text/to/Learn/
│   │   ├── TextToLearnApplication.java # Spring Boot entry point
│   │   ├── 📂 configuration/           # Security, CORS, AI, ModelMapper config
│   │   ├── 📂 controllers/             # REST API controllers
│   │   │   ├── AuthController.java     # Login, register, logout, session
│   │   │   ├── CourseController.java   # Course generation & retrieval
│   │   │   ├── LessonController.java   # Lesson management
│   │   │   ├── ModuleController.java   # Module management
│   │   │   └── HealthController.java   # Health check endpoint
│   │   ├── 📂 entities/                # JPA entities (User, Course, Module, Lesson)
│   │   ├── 📂 dto/                     # Data Transfer Objects
│   │   ├── 📂 repositories/            # Spring Data JPA repositories
│   │   └── 📂 services/                # Business logic layer
│   └── 📂 resources/
│       └── application.properties      # App configuration
│
└── 📂 client/                          # React frontend (Vite)
    ├── 📄 package.json
    ├── 📄 vite.config.js
    └── 📂 src/
        ├── App.jsx                     # Root app with routing
        ├── main.jsx                    # React entry point
        ├── 📂 pages/
        │   ├── HomePage.jsx            # Landing page with course generation
        │   ├── CoursePage.jsx          # Course overview & module list
        │   ├── LessonPage.jsx          # Individual lesson viewer
        │   ├── LoginPage.jsx           # Login/register page
        │   └── AboutPage.jsx           # About the project
        ├── 📂 components/              # Reusable UI components
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── AuthModal.jsx
        │   ├── PromptForm.jsx
        │   ├── LessonViewer.jsx
        │   ├── LessonRenderer.jsx
        │   ├── CourseGenerationLoader.jsx
        │   ├── CertificateModal.jsx
        │   ├── LessonPDFExporter.jsx
        │   └── blocks/                 # Lesson content block renderers
        ├── 📂 context/                 # React context (auth, course state)
        ├── 📂 hooks/                   # Custom React hooks
        ├── 📂 api/                     # Axios API service modules
        └── 📂 utils/                   # Helper utilities
```

---

## ⚙️ Prerequisites

Make sure the following are installed on your system:

- ☕ **Java 17** — [Download JDK 17](https://adoptium.net/)
- 📦 **Node.js 18+** — [Download Node.js](https://nodejs.org/)
- 🐘 **PostgreSQL** — Local instance or a cloud provider (e.g., [Neon](https://neon.tech), Supabase, Railway)
- 🔑 **OpenRouter API Key** — [Get one free at OpenRouter](https://openrouter.ai/)
- 📺 **YouTube Data API v3 Key** — [Google Cloud Console](https://console.cloud.google.com/)

---

## 🚀 Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/ShubhamShakyawal/Text-To-Learn-AI-Course-Generator.git
cd Text-To-Learn-AI-Course-Generator
```

### 2. Configure Environment Variables

Create a `.env` file in the **project root** (same level as `pom.xml`):

```env
# Database credentials (PostgreSQL)
DB_URL=jdbc:postgresql://<your-host>/<your-db>?sslmode=require
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

# AI API Key (OpenRouter)
AI_API_KEY=sk-or-v1-your-openrouter-key

# YouTube Data API v3
YOUTUBE_API_KEY=your-youtube-api-key

# JWT Secret (for session signing — use a strong random string)
JWT_SECRET=your_super_secret_value
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

### 3. Configure Frontend Environment

Create a `.env` file inside the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## ▶️ Running the Project

### Option A — Run Backend and Frontend Separately (Recommended for Development)

#### Backend (Spring Boot)

From the **project root**, run:

```bash
# On Linux / macOS
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```

The backend will start at **http://localhost:8080**

#### Frontend (React + Vite)

Open a second terminal and navigate to the `client/` directory:

```bash
cd client
npm install
npm run dev
```

The frontend will start at **http://localhost:5173**

---

### Option B — Build and Run as Single JAR

```bash
# Build the frontend first
cd client
npm install
npm run build
cd ..

# Then build and run the Spring Boot JAR
./mvnw clean package -DskipTests
java -jar target/Text-to-Learn-0.0.1-SNAPSHOT.jar
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email & password |
| `POST` | `/api/auth/logout` | Logout current user |
| `GET`  | `/api/auth/me` | Get current authenticated user |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/courses/generate` | Generate a new AI course |
| `GET`  | `/api/courses` | Get all courses for current user |
| `GET`  | `/api/courses/{id}` | Get a specific course |
| `DELETE` | `/api/courses/{id}` | Delete a course |

### Lessons
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/lessons/{id}` | Get lesson details |
| `POST` | `/api/lessons/{id}/complete` | Mark lesson as complete |

### Modules
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/modules/{id}` | Get module details |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/health` | Server health check |

---

## 🖥️ Usage Guide

1. **Open the app** at [http://localhost:5173](http://localhost:5173)
2. **Generate a course** — Enter any topic (e.g., *"Introduction to Machine Learning"*) in the prompt box and click **Generate**
3. **Browse modules** — The sidebar shows all modules generated for your course
4. **Read lessons** — Click any lesson to view its content, embedded YouTube videos, and code examples
5. **Track progress** — Mark lessons as complete to track your progress
6. **Export** — Use the PDF export button to save any lesson locally
7. **Certificate** — Complete all lessons to unlock and download your course certificate
8. **Account** — Register or login to persist your courses across sessions

---

## 🔧 Configuration Reference

Key settings in `src/main/resources/application.properties`:

| Property | Default | Description |
|---|---|---|
| `server.port` | `8080` | Backend server port |
| `spring.ai.openai.chat.options.model` | `nvidia/nemotron-nano-9b-v2:free` | AI model used for course generation |
| `spring.jpa.hibernate.ddl-auto` | `update` | Schema management (`update` auto-creates tables) |
| `server.servlet.session.timeout` | `7d` | Session expiry duration |
| `logging.file.name` | `logs/application.log` | Log file location |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| **Backend fails to start** | Verify `.env` is in the project root and all keys are set correctly |
| **Database connection error** | Check `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`. Ensure PostgreSQL is running or the cloud DB is accessible |
| **AI course generation fails** | Verify `AI_API_KEY` is a valid OpenRouter key with credits |
| **YouTube videos not loading** | Check `YOUTUBE_API_KEY` is enabled for the YouTube Data API v3 in Google Cloud Console |
| **Frontend can't reach backend** | Confirm the backend is running on port `8080` and `VITE_API_BASE_URL` is set in `client/.env` |
| **CORS error in browser** | The backend's CORS config allows `localhost:5173` by default — ensure you're running Vite on that port |

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
Built with ❤️ using Spring Boot & React
</div>
