# How the Database Connects to the Website

The **website (frontend) never talks to the database directly**. It goes through your **backend API**, which connects to MongoDB.

```
Browser (your website)  →  Backend API (port 5000)  →  MongoDB
     Frontend                    Node.js + Mongoose      Database
```

---

## Step 1: Set the database connection (Backend)

Your backend reads the connection from **`Backend/.env`**:

**Local MongoDB:**
```env
DB=mongodb://localhost:27017/vulpine
```

**MongoDB Atlas (cloud):**
```env
DB=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/vulpine?retryWrites=true&w=majority
```

You already have this in `.env`. The `/vulpine` at the end is the database name.

---

## Step 2: Set the API URL (Frontend)

The frontend talks to the backend using **`Frontend/.env.local`**:

```env
VITE_API_URL=http://localhost:5000/api
```

So the website calls `http://localhost:5000/api` for products, auth, orders, etc. No change needed if your backend runs on port 5000.

---

## Step 3: Start everything in this order

### 1) Start MongoDB

- **Local:** Start the "MongoDB Server" service (e.g. `services.msc` → MongoDB Server → Start),  
  **or** use MongoDB Atlas (no local install).
- **Atlas:** No start step; ensure `DB=` in `.env` is your Atlas connection string.

### 2) Start the Backend

```bash
cd e:\Vulpine\Backend
npm start
```

Wait until you see:
- `Server is running on port 5000`
- `Database is connected successfully`

If you see "Database connection failed", MongoDB is not running or `DB` in `.env` is wrong.

### 3) (Optional) Add products to the database

```bash
cd e:\Vulpine\Backend
node seed.js
```

You should see: `Successfully added 22 products to the database!`

### 4) Start the Frontend

```bash
cd e:\Vulpine\Frontend
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## Step 4: Check that the database is connected to the website

1. Open **http://localhost:3000**
2. Go to **Products** (or Home).
3. If you see products, the flow is: **Website → Backend API → MongoDB** and the database is connected.

If the products page is empty:
- Backend must be running (`npm start` in Backend).
- MongoDB must be running and `DB` in `Backend/.env` must be correct.
- Run `node seed.js` in Backend if you haven’t added products yet.

---

## Summary

| Part        | File / Where        | Purpose                                      |
|------------|---------------------|----------------------------------------------|
| Database   | MongoDB (local or Atlas) | Stores products, users, orders              |
| Connection | `Backend/.env` → `DB=` | Tells backend how to connect to MongoDB     |
| Backend    | `npm start` in Backend  | Connects to DB and serves API on port 5000  |
| Frontend   | `Frontend/.env.local` → `VITE_API_URL` | Tells website where the API is |
| Website    | http://localhost:3000   | Uses API, so it uses the database indirectly |

The database is “connected” to the website when: **MongoDB is running**, **Backend is running** with the correct `DB` in `.env`, and **Frontend** is running with `VITE_API_URL=http://localhost:5000/api`.
