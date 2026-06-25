# Mini Task Management System

A sleek, minimalist Task Management System built with Python (FastAPI) and React (Vite + Tailwind CSS).

## 🚀 Features
- **Authentication**: JWT-based user login and registration.
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Drag and Drop**: Interactive Kanban board using `@dnd-kit/core`.
- **Search & Filter**: Search tasks by title and filter by status (Todo, In Progress, Done).
- **Modern UI**: Highly polished, responsive interface inspired by Linear and Vercel.

## 🛠️ Tech Stack
- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic, Passlib (bcrypt).
- **Frontend**: React 18, Vite, Tailwind CSS, React Router, Axios, dnd-kit, Lucide React.

## 📦 Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment.
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install all the required Python packages from requirements.txt.
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server.
   *(Make sure your virtual environment is activated before running this!)*
   ```bash
   .\venv\Scripts\activate
   python run.py
   ```
   The backend will run on `http://localhost:8000`. API Docs are available at `http://localhost:8000/docs`.

> **NOTE: Code editor once and for all**  
> If your editor shows "missing import" errors, you must select the correct interpreter:
> 1. Press `Ctrl + Shift + P`
> 2. Type and select `Python: Select Interpreter`
> 3. Choose the one that says `./backend/venv/Scripts/python.exe` (or explicitly browse to it).
> 
> *Without doing this, your editor will show errors because it won't be able to find the packages installed in the virtual environment.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install all the required Node packages.
   ```bash
   npm install
   ```
3. Run the Vite development server.
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## 🗄️ Database Schema
- **User**:
  - `id`: Integer, Primary Key
  - `email`: String, Unique
  - `hashed_password`: String
- **Task**:
  - `id`: Integer, Primary Key
  - `title`: String
  - `description`: String (Optional)
  - `status`: String (Default: 'Todo')
  - `due_date`: DateTime (Optional)
  - `created_at`: DateTime
  - `user_id`: Integer, Foreign Key -> `users.id`

## 📝 Assumptions Made
- The app uses SQLite for simplicity to avoid complex Docker/PostgreSQL setups.
- The `search` and `filter` requests hit the backend for accurate database-level filtering.
- OAuth2 Password Flow (with JSON body for ease of integration on the frontend) is used for authentication.
