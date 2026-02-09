# MongoDB Compass – Not Connecting? Fix It

Compass is only a **client**. It needs a **MongoDB server** running. If you see "connection refused" or "ECONNREFUSED 127.0.0.1:27017", the server is not running or not installed.

---

## Step 1: Check if MongoDB is installed

- **Windows:** Open **Services** (Win + R → `services.msc` → Enter). Look for **"MongoDB Server"**.
- Or in **PowerShell** or **CMD** run:
  ```bash
  mongod --version
  ```
  If you get "command not found", MongoDB is not installed.

---

## Step 2: Install MongoDB (if not installed)

1. Go to: https://www.mongodb.com/try/download/community  
2. Choose **Windows**, download the **MSI**.  
3. Run the installer.  
4. Choose **Complete** install.  
5. **Important:** Leave **"Install MongoDB as a Service"** checked so it starts automatically.  
6. Optionally uncheck "Install MongoDB Compass" if you already have Compass.  
7. Finish the install.

---

## Step 3: Start MongoDB (Windows)

**Option A – Service (recommended)**  
1. Press **Win + R**, type `services.msc`, Enter.  
2. Find **"MongoDB Server"**.  
3. Right‑click → **Start**. (Set **Startup type** to **Automatic** if you want it to start with Windows.)

**Option B – Command line**  
Open **CMD** or **PowerShell as Administrator** and run:
```bash
net start MongoDB
```

---

## Step 4: Connect in Compass

1. Open **MongoDB Compass**.  
2. In the connection box, use exactly:
   ```
   mongodb://localhost:27017
   ```
3. Click **Connect**.

You should see your databases (or an empty list). Then you can create/use the `vulpine` database.

---

## Step 5: If you prefer cloud (no local install)

Use **MongoDB Atlas** instead of local MongoDB:

1. Go to https://www.mongodb.com/cloud/atlas and sign up.  
2. Create a **free M0 cluster**.  
3. Create a **database user** (username + password).  
4. Under **Network Access**, add **"Allow Access from Anywhere"** (0.0.0.0/0).  
5. Click **Connect** on the cluster → **Connect using MongoDB Compass** → copy the connection string.  
6. Replace `<password>` in the string with your database user password.  
7. In Compass, paste that full string and click **Connect**.

Then in your Backend `.env` set:
```
DB=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/vulpine?retryWrites=true&w=majority
```
(Use your real user, password, and cluster URL.)

---

## Quick checklist

| Check | Action |
|-------|--------|
| MongoDB installed? | Run `mongod --version` in terminal. |
| MongoDB running? | Open `services.msc` → start **MongoDB Server**. |
| Compass connection string | Use `mongodb://localhost:27017` for local. |
| Still failing? | Use MongoDB Atlas (cloud) and connect with the Atlas URL in Compass. |
