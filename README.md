# VULPINE - Premium Skincare E-commerce Platform

A modern, fully-functional e-commerce platform for premium skincare products featuring user authentication, product catalog, shopping cart, payment integration with Razorpay, order tracking, and email notifications.

## 🌟 Features

### User Features
- ✅ User Registration & Authentication
- ✅ Secure Login/Logout with JWT
- ✅ Product Browsing & Search
- ✅ Product Filtering by Category, Skin Type, Concerns
- ✅ Product Ratings & Reviews
- ✅ Shopping Cart Management
- ✅ Wishlist
- ✅ Secure Checkout
- ✅ Payment Integration (Razorpay)
- ✅ Order Tracking
- ✅ User Dashboard
- ✅ Order History

### Technical Features
- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Email Notifications
- ✅ Real-time Order Updates
- ✅ Secure Payment Processing
- ✅ Database with MongoDB
- ✅ RESTful API
- ✅ Modern UI with Tailwind CSS
- ✅ State Management with Zustand

## 📋 Project Structure

```
Vulpine/
├── Backend/              # Node.js Express Backend
│   ├── controller/       # Route controllers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & Error handling
│   ├── util/            # Utilities
│   ├── app.js           # Express app
│   └── index.js         # Entry point
│
├── Frontend/            # React + Vite Frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Pages
│   │   ├── services/    # API services
│   │   └── store/       # State management
│   └── index.html       # HTML template
│
└── BackgroundServices/  # Email service
```

## 🚀 Quick Start

### Backend
```bash
cd Backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

Access the app at `http://localhost:3000`

## 📚 Configuration

### Backend .env
```
PORT=5000
DB=mongodb://localhost:27017/vulpine
JWT_SEC=your_secret_key
EMAIL=your_email@gmail.com
PASSWORD=app_password
RAZORPAY_KEY_ID=key
RAZORPAY_KEY_SECRET=secret
```

### Frontend .env.local
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=key
```

## 🛠 API Endpoints

**Auth**
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/logout`

**Products**
- GET `/api/product`
- GET `/api/product/:id`
- POST `/api/product`
- PUT `/api/product/:id`
- DELETE `/api/product/:id`
- PUT `/api/product/rating/:productId`

**Orders**
- POST `/api/orders`
- GET `/api/orders`
- GET `/api/orders/find/:userId`
- PUT `/api/orders/:id`

**Payment**
- POST `/api/payment/create-order`
- POST `/api/payment/verify`

**Users**
- GET `/api/users`
- GET `/api/users/find/:id`
- PUT `/api/users/:id`
- DELETE `/api/users/:id`

**Banners**
- GET `/api/banners`
- GET `/api/banners/random`
- POST `/api/banners`
- DELETE `/api/banners/:id`

## 💳 Payment Integration

Uses Razorpay for secure payment processing. Test card: 4111111111111111

## 📧 Email Service

Configured with Gmail SMTP for order notifications and promotions.

## 📱 Features

- Responsive design
- Mobile-optimized UI
- Product search & filters
- Shopping cart
- Secure checkout
- Order tracking
- User dashboard
- Product reviews
- Wishlist
- Email notifications

## 🔒 Security

- JWT authentication
- Password hashing
- Secure payment processing
- CORS protection
- Input validation

## 📝 License

MIT License

## 👨‍💻 Author

Created with ❤️ for skincare enthusiasts

---

**Happy Shopping with VULPINE!** 🌸
