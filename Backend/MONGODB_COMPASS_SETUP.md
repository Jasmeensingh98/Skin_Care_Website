# Connect MongoDB Compass and Add Products

Follow these steps **in order**. Products are added only when you run the seed script (Step 4).

---

## Step 1: Install and run MongoDB

- **Option A – Local:** Install [MongoDB Community](https://www.mongodb.com/try/download/community) and start the MongoDB service.
- **Option B – Cloud:** Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and get a connection string.

---

## Step 2: Connect with MongoDB Compass

1. Open **MongoDB Compass**.
2. In the connection box, use one of these:

   **Local MongoDB:**
   ```
   mongodb://localhost:27017
   ```

   **MongoDB Atlas:**  
   Use the connection string from Atlas (e.g. `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net`).

3. Click **Connect**.
4. After connecting, you’ll see your databases (or an empty list). The `vulpine` database will appear **after** you run the seed script in Step 4.

---

## Step 3: Set the same connection in the Backend

1. In the Backend folder, open or create `.env` (copy from `.env.example` if needed).
2. Set `DB` to the **full** connection string including the database name:

   **Local (database name = vulpine):**
   ```
   DB=mongodb://localhost:27017/vulpine
   ```

   **Atlas (replace with your real URL and password):**
   ```
   DB=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/vulpine?retryWrites=true&w=majority
   ```

3. Save the file.

Now both **Compass** (when you connect) and the **Backend/seed script** use the same database.

---

## Step 4: Run the seed script to add products

Only after Compass is connected and `DB` is set in `.env`:

1. Open a terminal in the project.
2. Go to the Backend folder:
   ```bash
   cd e:\Vulpine\Backend
   ```
3. Install dependencies if you haven’t:
   ```bash
   npm install
   ```
4. Run the seed script:
   ```bash
   node seed.js
   ```

You should see:

- `Connected to MongoDB`
- `Cleared existing products`
- `✅ Successfully added 22 products to the database!`

---

## Step 5: Confirm in Compass

1. In Compass, click **Refresh** (or reconnect).
2. Open the **vulpine** database.
3. Open the **products** collection.
4. You should see the 22 skincare products.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Install/start MongoDB (local or Atlas). |
| 2 | Connect Compass using `mongodb://localhost:27017` or your Atlas URL. |
| 3 | Set `DB=mongodb://localhost:27017/vulpine` (or your Atlas URL with `/vulpine`) in `Backend/.env`. |
| 4 | Run `node seed.js` in `Backend` – **this is when products are added**. |
| 5 | Refresh Compass and open `vulpine` → `products` to see the data. |

Products are **only** added when you run `node seed.js`. The backend server does not insert them automatically.
