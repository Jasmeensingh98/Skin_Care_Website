# How to Run the Vulpine Project

## The problem you might see

- **Backend:** `Error: spawn EPERM` when running `npm run dev`
- **Frontend:** `Error: spawn EPERM` when running `npm run dev`

This usually happens when Node tries to start a subprocess (file watcher or esbuild) and Windows or your environment blocks it (e.g. Cursor sandbox, antivirus).

---

## Fix: Run in your own terminal

Use **Windows Terminal**, **CMD**, or **PowerShell** (outside Cursor). Run the commands below from a **new** terminal window.

### 1. Start the Backend

```bash
cd e:\Vulpine\Backend
npm start
```

You should see: `Server is running on port 5000` and `Database is connected successfully` (if MongoDB is running).

- If you see **database connection failed**, start MongoDB (see `Backend/MONGODB_COMPASS_NOT_CONNECTING.md`) or use MongoDB Atlas and set `DB=` in `.env`.

### 2. Start the Frontend (second terminal)

Open another terminal window, then:

```bash
cd e:\Vulpine\Frontend
npm run dev
```

You should see something like: `Local: http://localhost:3000/`

### 3. Open the app

In your browser go to: **http://localhost:3000**

---

## Summary

| What        | Command              | Where to run        |
|------------|----------------------|---------------------|
| Backend    | `cd Backend` then `npm start` | Your own terminal   |
| Frontend   | `cd Frontend` then `npm run dev` | Second terminal     |
| App in browser | —                | http://localhost:3000 |

Using **`npm start`** for the backend avoids the `--watch` subprocess that can trigger `spawn EPERM`. Running both from a **normal Windows terminal** (not inside Cursor) often fixes the frontend `spawn EPERM` as well.
