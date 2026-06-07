# CoreLab — Online Class Platform

A full-stack online learning platform built with the MERN stack, JWT authentication, and Zod validation.

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JSON Web Tokens, Zod
**Frontend:** React, Vite, React Router 6, React Hook Form, Zustand, Zod
**Testing:** Vitest, Testing Library

---

## Prerequisites

Before you start, make sure you have the following installed:

- **Node.js v20+** — [nodejs.org](https://nodejs.org). If you have an older version, use [nvm](https://github.com/nvm-sh/nvm) to upgrade:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  nvm install 20
  nvm use 20
  ```
- **npm v10+** — comes with Node 20
- **A MongoDB Atlas account** — [mongodb.com/atlas](https://mongodb.com/atlas) (free tier is enough)

---

## Project Structure

```
online-class-platform/
├── server/         # Express API
└── client/         # React frontend
```

Each folder is an independent Node project with its own `package.json` and `node_modules`. You install dependencies and run scripts separately in each.

---

## 1. Clone the repository

```bash
git clone https://github.com/your-username/corelab.git
cd corelab
```

---

## 2. Set up the database

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free account
2. Create a free **M0 cluster**
3. Under **Database Access**, create a user with a username and password
4. Under **Network Access**, add your IP address (or use `0.0.0.0/0` for development)
5. On your cluster, click **Connect → Drivers** and copy the connection string. It will look like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add your database name before the `?`:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/corelab?retryWrites=true&w=majority
   ```

---

## 3. Configure environment variables

Create a `.env` file inside the `server/` folder:

```bash
cd server
touch .env
```

Add the following variables:

```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/corelab?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production
NODE_ENV=development
```

> **Never commit your `.env` file.** Make sure `.env` is listed in your `.gitignore`.

---

## 4. Install server dependencies

```bash
cd server
npm install
```

This installs:

| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `dotenv` | Loads environment variables |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT creation and verification |
| `zod` | Schema validation |
| `cors` | Cross-origin request handling |
| `cookie-parser` | Reads cookies (refresh token) |
| `nodemon` | Auto-restarts server on file changes (dev) |
| `vitest` | Testing framework (dev) |

---

## 5. Install client dependencies

```bash
cd ../client
npm install
```

This installs:

| Package | Purpose |
|---|---|
| `react-router-dom` | Client-side routing |
| `zod` | Form validation schemas |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Connects Zod to React Hook Form |
| `zustand` | Global state management (auth) |
| `vitest` | Testing framework (dev) |
| `@testing-library/react` | Component testing utilities (dev) |
| `@testing-library/jest-dom` | DOM matchers for tests (dev) |
| `@testing-library/user-event` | Simulates user interactions in tests (dev) |
| `jsdom` | Simulates a browser environment for tests (dev) |

> React, React DOM, and Vite are already included if you set up the client manually or via `create-vite`.

---

## 6. Run the app

Open two terminal windows — one for the server, one for the client.

**Terminal 1 — Start the server:**
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB connected: cluster0.xxxxx.mongodb.net
```

**Terminal 2 — Start the client:**
```bash
cd client
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in Xms
  ➜  Local:   http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 7. Run tests

**Server tests:**
```bash
cd server
npm test
```

**Client tests:**
```bash
cd client
npm test
```

---

## API Overview

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PUT    /api/courses/:id
DELETE /api/courses/:id

POST   /api/courses/:id/enroll
GET    /api/courses/enrollments/me
PATCH  /api/courses/:id/progress

GET    /api/courses/:courseId/lessons
POST   /api/courses/:courseId/lessons
DELETE /api/courses/:courseId/lessons/:lessonId

GET    /api/courses/:courseId/quiz
POST   /api/courses/:courseId/quiz
POST   /api/courses/:courseId/quiz/submit
GET    /api/courses/:courseId/quiz/attempts
```

---

## User Roles

| Role | Permissions |
|---|---|
| `student` | Browse courses, enroll, track progress, take quizzes |
| `instructor` | All student permissions + create, edit, and delete their own courses and lessons |
| `admin` | All permissions |

---

## Common Issues

**`ENOENT: no such file or directory, package.json`**
You are running `npm install` from the wrong folder. Make sure you `cd` into either `server/` or `client/` before running any npm commands.

**Vite requires Node.js version 20.19+**
Your Node version is too old. Install Node 20 via nvm (see Prerequisites above).

**`Cannot find native binding`**
Your `node_modules` were installed under a different Node version. Delete them and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

**MongoDB connection refused**
Check that your Atlas cluster is running, your IP is whitelisted under Network Access, and your `MONGO_URI` in `.env` is correct.
