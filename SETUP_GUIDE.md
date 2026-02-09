# VULPINE Ecommerce Platform - Complete Setup Guide

## 📦 Installation & Setup

### System Requirements
- Node.js 14+ 
- MongoDB 4.4+
- npm or yarn
- Git
- Modern web browser

---

## BACKEND SETUP

### Step 1: Initialize Backend
```bash
cd Backend
npm install
```

### Step 2: Environment Configuration
Create `.env` file in Backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB=mongodb://localhost:27017/vulpine

# JWT
JWT_SEC=your_super_secret_jwt_key_change_this_in_production

# Email (Gmail with App Password)
EMAIL=your-email@gmail.com
PASSWORD=your-app-password-16-chars

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Database Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# Verify connection
mongo
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Replace in .env:
```env
DB=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/vulpine?retryWrites=true&w=majority
```

### Step 4: API Keys Setup

#### Razorpay Setup
1. Sign up at https://razorpay.com
2. Go to Settings → API Keys
3. Copy Key ID and Secret
4. Update `.env`

#### Gmail Setup (for emails)
1. Go to myaccount.google.com
2. Enable 2-factor authentication
3. Go to Security → App passwords
4. Select Mail & Windows Computer
5. Copy 16-character password
6. Update `.env`

### Step 5: Run Backend
```bash
npm run dev
# Server runs on http://localhost:5000
```

---

## FRONTEND SETUP

### Step 1: Initialize Frontend
```bash
cd Frontend
npm install
```

### Step 2: Environment Configuration
Create `.env.local` in Frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### Step 3: Run Frontend
```bash
npm run dev
# App runs on http://localhost:3000
```

---

## QUICK TEST

### Test User Account
```
Email: demo@example.com
Password: password123
```

### Test Payment
```
Card: 4111111111111111
Expiry: 12/25
CVV: 123
OTP: 123456
```

---

## ADDING SAMPLE PRODUCTS

### Using MongoDB Compass:
```javascript
db.products.insertMany([
  {
    title: "Vitamin C Brightening Serum",
    desc: "20% Vitamin C serum for instant glow and brightening",
    img: "https://via.placeholder.com/300",
    Brand: "VULPINE",
    originalNumber: 1499,
    discountedPrice: 999,
    categories: ["skincare", "serums"],
    skintype: ["all"],
    concern: ["dullness", "brightening"],
    inStock: true,
    ratings: []
  },
  {
    title: "Hyaluronic Acid Moisturizer",
    desc: "Ultra hydrating moisturizer with 3% HA complex",
    img: "https://via.placeholder.com/300",
    Brand: "VULPINE",
    originalNumber: 999,
    discountedPrice: 649,
    categories: ["skincare", "moisturizer"],
    skintype: ["dry", "sensitive"],
    concern: ["dryness"],
    inStock: true,
    ratings: []
  }
])
```

### Using API (POST http://localhost:5000/api/product):
```json
{
  "title": "Niacinamide Face Mask",
  "desc": "Pore-minimizing face mask with 5% Niacinamide",
  "img": "https://via.placeholder.com/300",
  "Brand": "VULPINE",
  "originalNumber": 899,
  "discountedPrice": 599,
  "categories": ["skincare", "masks"],
  "skintype": ["oily", "combination"],
  "concern": ["acne", "pores"],
  "inStock": true
}
```

---

## COMMON ISSUES & SOLUTIONS

### Issue: MongoDB Connection Error
**Solution:**
```bash
# Check if MongoDB is running
# For Windows: Services → MongoDB → Start
# For Mac: brew services start mongodb-community
# For Linux: sudo systemctl start mongod
```

### Issue: Email Not Sending
**Solution:**
- Use Gmail App Password (16 chars), NOT regular password
- Enable "Less secure app access" if not using App Password
- Check .env email format
- Verify SMTP settings

### Issue: Payment Not Working
**Solution:**
- Verify Razorpay keys in .env
- Check Razorpay script in index.html
- Use test credentials for testing
- Check browser console for errors

### Issue: CORS Error
**Solution:**
- Ensure CORS_ORIGIN in backend .env matches frontend URL
- Clear browser cache
- Check browser console for exact error

### Issue: Port Already in Use
**Solution:**
```bash
# Find process using port
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000

# Kill process
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```

---

## FEATURES WALKTHROUGH

### 1. User Registration
- Go to http://localhost:3000/register
- Fill in details
- Password must be 6+ characters
- Account created with JWT token

### 2. Product Browsing
- Home page shows featured products
- /products page with filters
- Filter by category, skin type, concerns
- Search functionality available

### 3. Shopping
- Add products to cart
- Update quantities
- View cart summary
- Free shipping for all orders

### 4. Checkout
- Fill delivery details
- Review order
- Proceed to Razorpay
- Complete payment securely

### 5. Order Tracking
- View order status
- Track delivery
- 5-step order timeline
- Delivery address & details

### 6. User Dashboard
- View order history
- Edit profile
- Manage addresses
- View wishlist

---

## DEPLOYMENT

### Backend (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create vulpine-api

# Set environment variables
heroku config:set PORT=5000
heroku config:set DB=your_mongodb_url
# ... set all other env vars

# Deploy
git push heroku main
```

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://vulpine-api.herokuapp.com/api
# VITE_RAZORPAY_KEY_ID=key
```

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Create database user
3. Get connection string
4. Whitelist IP addresses
5. Use in .env files

---

## PRODUCTION CHECKLIST

### Backend
- [ ] Change JWT_SEC to strong random string
- [ ] Use production MongoDB URL
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Configure email service
- [ ] Setup Razorpay production keys
- [ ] Enable database backups
- [ ] Setup error logging
- [ ] Setup monitoring/alerts

### Frontend
- [ ] Build for production: `npm run build`
- [ ] Set correct API URL
- [ ] Use production Razorpay keys
- [ ] Optimize images
- [ ] Enable caching
- [ ] Setup analytics
- [ ] Configure SEO
- [ ] Test on multiple devices
- [ ] Setup error tracking
- [ ] Enable PWA features

---

## USEFUL COMMANDS

```bash
# Backend
npm run dev           # Start development
npm run build         # Build for production
npm test             # Run tests
npm run lint         # Lint code

# Frontend
npm run dev          # Start development
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code

# Database
mongosh             # MongoDB CLI
# Use database vulpine; db.products.find() # Query products
# db.products.deleteMany({}) # Clear products
```

---

## SUPPORT & DOCUMENTATION

- **API Docs**: Check Backend/routes/
- **Component Docs**: Check Frontend/src/components/
- **Database Schema**: Check Backend/models/
- **Service APIs**: Check Frontend/src/services/

---

## Next Steps

1. ✅ Complete setup above
2. ✅ Add sample products
3. ✅ Test user registration & login
4. ✅ Test shopping & checkout
5. ✅ Deploy backend & frontend
6. ✅ Setup production databases
7. ✅ Configure email service
8. ✅ Monitor & maintain

---

**Happy Building! 🚀**

For issues: Check console logs, error messages, and documentation.
