# Personal Expense Tracker

A modern, full-stack expense tracking application built with React, Node.js, Express, and MongoDB. Features a beautiful dark-themed UI with comprehensive transaction management and analytics.

## 🚀 Features

### 🔐 Authentication
- User registration with profile pictures based on gender
- Secure login/logout with JWT tokens
- Protected routes and automatic session management
- Password change functionality

### 💰 Transaction Management
- **CRUD Operations**: Create, Read, Update, Delete transactions
- **Categories**: Expense, Saving, Investment
- **Payment Methods**: Cash, Card, UPI
- **Search & Filter**: Find transactions by description, category, or payment type
- **Pagination**: Efficient handling of large transaction lists

### 📊 Analytics & Statistics
- Category-wise spending breakdown with visual progress bars
- Payment method analysis
- Monthly spending trends
- Transaction count and averages
- Beautiful data visualization

### 👤 Profile Management
- Update personal information (name, gender)
- Change password with validation
- Profile picture based on gender selection

### 🎨 Modern UI/UX
- **Dark Theme**: Professionally designed dark interface
- **Responsive**: Works perfectly on desktop and mobile
- **Modern Components**: Clean cards, buttons, and forms
- **Smooth Animations**: Loading states and transitions
- **Intuitive Navigation**: Sidebar with breadcrumbs

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Tailwind CSS 4** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client with interceptors
- **Date-fns** - Date formatting utilities
- **Vite** - Fast development build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
TypeFace Assignment/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout.jsx      # Main layout with navigation
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx       # Authentication pages
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx   # Main dashboard
│   │   │   ├── Transactions.jsx # Transaction list
│   │   │   ├── AddTransaction.jsx
│   │   │   ├── Statistics.jsx  # Analytics page
│   │   │   └── Profile.jsx     # User profile
│   │   ├── api.js              # API configuration & calls
│   │   ├── AuthContext.jsx     # Authentication context
│   │   └── App.jsx             # Main app component
│   └── package.json
├── backend/                     # Express backend API
│   ├── controllers/            # Route handlers
│   │   ├── user.controller.js
│   │   └── transaction.controller.js
│   ├── models/                 # Database schemas
│   │   ├── user.model.js
│   │   └── transaction.model.js
│   ├── routes/                 # API routes
│   │   ├── user.route.js
│   │   └── transaction.route.js
│   ├── middleware/             # Custom middleware
│   │   └── auth.middleware.js
│   ├── db/                     # Database connection
│   │   └── connectDB.js
│   ├── constants.js            # App constants
│   └── index.js                # Server entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd "TypeFace Assignment"
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Navigate to backend directory
cd backend

# Create .env file with the following variables:
# MONGODB_URI=mongodb://localhost:27017/TypeFace
# ACCESS_TOKEN_SECRET=your-secret-key-here
# REFRESH_TOKEN_SECRET=your-refresh-secret-here
# ACCESS_TOKEN_SECRET_EXPIRY=1d
# REFRESH_TOKEN_SECRET_EXPIRY=7d
# CORS_ORIGIN=http://localhost:5173
# PORT=8000

# Start the backend server
npm start
```

### 3. Frontend Setup
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/TypeFace
ACCESS_TOKEN_SECRET=your-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-secret-here
ACCESS_TOKEN_SECRET_EXPIRY=1d
REFRESH_TOKEN_SECRET_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173
PORT=8000
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## 📋 API Endpoints

### Authentication
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout
- `GET /api/v1/user/refresh-token` - Refresh access token
- `GET /api/v1/user/info` - Get user profile
- `PUT /api/v1/user/update` - Update user profile
- `PUT /api/v1/user/change-password` - Change password

### Transactions
- `GET /api/v1/transaction` - Get all transactions (paginated)
- `POST /api/v1/transaction/add` - Create new transaction
- `GET /api/v1/transaction/:id` - Get transaction by ID
- `PUT /api/v1/transaction/:id` - Update transaction
- `DELETE /api/v1/transaction/:id` - Delete transaction

### Statistics
- `GET /api/v1/transaction/stats/category` - Category statistics
- `GET /api/v1/transaction/stats/payment-type` - Payment type statistics
- `GET /api/v1/transaction/stats/monthly` - Monthly statistics

## 🎨 Design Features

### Color Scheme
- **Background**: Gray-900 (#0f172a)
- **Cards**: Gray-800 (#1e293b)
- **Borders**: Gray-700 (#374151)
- **Text**: White/Gray variants
- **Accents**: 
  - Expenses: Red-400 (#f87171)
  - Savings: Green-400 (#4ade80)
  - Investments: Blue-400 (#60a5fa)

### UI Components
- **Modern Cards**: Rounded corners with subtle borders
- **Gradient Buttons**: Beautiful color transitions
- **Loading States**: Smooth spinners and skeleton loading
- **Form Validation**: Real-time error messages
- **Icons**: Consistent Lucide icons throughout
- **Responsive Grid**: Adapts to all screen sizes

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Both frontend and backend validation
- **Protected Routes**: Authenticated route protection
- **Automatic Token Refresh**: Seamless session management

## 📱 Responsive Design

The application is fully responsive and tested on:
- **Desktop**: 1920x1080 and above
- **Laptop**: 1366x768
- **Tablet**: 768x1024
- **Mobile**: 375x667 and above

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy with start script: `node index.js`
3. Ensure MongoDB connection is accessible

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for TypeFace Assignment

## 🐛 Known Issues & Solutions

### Login/Register Auto-submission
If you experience automatic form submission on refresh:
- Clear browser cookies and localStorage
- The updated code includes fixes for token refresh on auth pages

### CORS Issues
Ensure the backend CORS_ORIGIN matches your frontend URL:
```env
CORS_ORIGIN=http://localhost:5173
```

### MongoDB Connection
For local development, ensure MongoDB is running:
```bash
mongod --dbpath /path/to/your/db
```
