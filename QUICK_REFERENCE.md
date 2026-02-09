# 🚀 VULPINE Quick Reference Card

## Start Servers (in separate terminals)

```bash
# Terminal 1 - Backend
cd Backend && npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend  
cd Frontend && npm run dev
# Runs on http://localhost:3000
```

## Default Test Account
```
Email: demo@example.com
Password: password123
```

## Test Payment Card
```
Card: 4111111111111111
Expiry: 12/25
CVV: 123
OTP: 123456
```

---

## File Locations

| Component | File |
|-----------|------|
| API Configuration | `/Frontend/src/services/api.js` |
| State Management | `/Frontend/src/store/store.js` |
| Home Page | `/Frontend/src/pages/Home.jsx` |
| Products Page | `/Frontend/src/pages/Products.jsx` |
| Checkout | `/Frontend/src/pages/Checkout.jsx` |
| Product Controller | `/Backend/controller/product.controller.js` |
| Order Controller | `/Backend/controller/order.controller.js` |
| Payment Controller | `/Backend/controller/payment.controller.js` |
| Auth Middleware | `/Backend/middleware/auth.middleware.js` |
| Product Routes | `/Backend/routes/product.route.js` |

---

## Environment Variables

### Backend .env
```
PORT=5000
DB=mongodb://localhost:27017/vulpine
JWT_SEC=your_secret_key
EMAIL=your_email@gmail.com
PASSWORD=app_password
RAZORPAY_KEY_ID=key
RAZORPAY_KEY_SECRET=secret
CORS_ORIGIN=http://localhost:3000
```

### Frontend .env.local
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=key
```

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/logout` | Logout user |
| GET | `/api/product` | Get all products |
| GET | `/api/product/:id` | Get single product |
| POST | `/api/product` | Create product |
| PUT | `/api/product/:id` | Update product |
| DELETE | `/api/product/:id` | Delete product |
| PUT | `/api/product/rating/:productId` | Rate product |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get all orders |
| GET | `/api/orders/find/:userId` | Get user orders |
| PUT | `/api/orders/:id` | Update order |
| POST | `/api/payment/create-order` | Create payment |
| POST | `/api/payment/verify` | Verify payment |
| GET | `/api/users` | Get all users |
| PUT | `/api/users/:id` | Update user |

---

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Lint code
npm run lint
```

---

## Page Routes

| Route | Page | Component |
|-------|------|-----------|
| `/` | Home | `Home.jsx` |
| `/products` | Products | `Products.jsx` |
| `/product/:id` | Product Detail | `ProductDetail.jsx` |
| `/cart` | Shopping Cart | `Cart.jsx` |
| `/checkout` | Checkout | `Checkout.jsx` |
| `/login` | Login | `Login.jsx` |
| `/register` | Register | `Register.jsx` |
| `/dashboard` | User Dashboard | `Dashboard.jsx` |
| `/order/:orderId` | Order Status | `OrderStatus.jsx` |

---

## Database Collections

### Users
```javascript
{
  name, email, password, phone, address,
  role, status, createdAt, updatedAt
}
```

### Products
```javascript
{
  title, desc, img, video, brand,
  originalNumber, discountedPrice,
  categories, skintype, concern,
  inStock, ratings, createdAt, updatedAt
}
```

### Orders
```javascript
{
  name, userId, products, total,
  phone, email, status,
  createdAt, updatedAt
}
```

---

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check if MongoDB is running |
| Port already in use | Kill process or change PORT |
| CORS error | Update CORS_ORIGIN in backend .env |
| Email not sending | Use Gmail App Password |
| Payment fails | Verify Razorpay keys |
| Login fails | Check user exists in DB |
| Cart empty | Check localStorage |

---

## Features Checklist

- [x] User Registration & Login
- [x] Product Browsing
- [x] Advanced Filtering
- [x] Shopping Cart
- [x] Payment Integration
- [x] Order Tracking
- [x] User Dashboard
- [x] Product Reviews
- [x] Wishlist
- [x] Responsive Design
- [x] Email Notifications
- [x] Error Handling
- [x] Security Features

---

## Useful Links

- MongoDB: https://www.mongodb.com
- Razorpay: https://razorpay.com
- Gmail App Password: https://myaccount.google.com/apppasswords
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Vercel: https://vercel.com
- Heroku: https://heroku.com

---

## Next Steps After Setup

1. ✅ Run both servers
2. ✅ Register a test account
3. ✅ Add sample products (see SAMPLE_PRODUCTS.md)
4. ✅ Test shopping flow
5. ✅ Test payment with test card
6. ✅ Check order tracking
7. ✅ Review in database
8. ✅ Deploy to production

---

## Tips & Tricks

💡 Use Redux DevTools browser extension for debugging state  
💡 Use MongoDB Compass for visual database management  
💡 Use Postman for API testing  
💡 Use VS Code REST Client extension for quick API tests  
💡 Enable debug mode in browser console  
💡 Check network tab for API requests  

---

## Production Checklist

Before deploying:
- [ ] Update JWT_SEC to strong random string
- [ ] Use production database URL
- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN to production domain
- [ ] Use production payment keys
- [ ] Setup email service properly
- [ ] Enable HTTPS
- [ ] Setup error logging
- [ ] Test all features thoroughly
- [ ] Backup database regularly
- [ ] Setup monitoring/alerts
- [ ] Configure DNS records

---

**Keep this handy while developing! 📌**

For detailed info, refer to:
- SETUP_GUIDE.md - Installation guide
- README.md - Full documentation
- SAMPLE_PRODUCTS.md - Database samples
- PROJECT_COMPLETION.md - Project summary
