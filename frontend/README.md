# Frontend Setup & Installation Guide

## 📋 Prerequisites
- Node.js 16+ and npm/yarn installed
- Local SQL Server instance running in SSMS (`SQLEXPRESS`)
- Backend services running locally in Visual Studio

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with your local backend URLs:
```
VITE_API_URL=http://localhost:5178
VITE_IDENTITY_URL=http://localhost:5284
VITE_CATALOG_URL=http://localhost:5142
VITE_BOOKING_URL=http://localhost:5100
```

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
npm run preview
```

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── HotelCard.jsx
│   │   ├── RoomCard.jsx
│   │   ├── CartItem.jsx
│   │   ├── Alert.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── HotelDetailsPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   └── BookingConfirmationPage.jsx
│   ├── services/           # API service layer
│   │   ├── api.js          # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── hotelService.js
│   │   └── bookingService.js
│   ├── context/            # Global state management
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── App.jsx             # Main app component
│   ├── main.jsx
│   └── index.css
├── public/
│   └── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

## 🎨 Features Implemented

### ✅ Authentication
- User registration with validation
- JWT-based login
- Token storage in localStorage
- Automatic token refresh in API interceptors
- Protected routes

### ✅ Hotel Browsing
- Display list of hotels
- Search functionality
- Filter by location, price, rating
- Hotel details page with rooms

### ✅ Booking Flow
- Date selection (check-in/check-out)
- Add rooms to cart
- View and manage cart
- Quantity adjustment
- Checkout with payment info

### ✅ Order Management
- Booking confirmation page
- Receipt download
- Order summary

### ✅ UI/UX
- Responsive design (mobile + desktop)
- Loading states
- Error handling
- Success notifications
- Reusable components

## 🔧 API Integration

### Authentication Service
```javascript
authService.login(email, password)
authService.register(userData)
authService.logout()
authService.getCurrentUser()
```

### Hotel Service
```javascript
hotelService.getAllHotels()
hotelService.getHotelById(id)
hotelService.getRoomsByHotelId(hotelId)
```

### Booking Service
```javascript
bookingService.addToCart(roomId, quantity)
bookingService.checkout()
bookingService.getUserBookings()
```

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Admin service base URL |
| VITE_IDENTITY_URL | Identity service URL |
| VITE_CATALOG_URL | Catalog service URL |
| VITE_BOOKING_URL | Booking service URL |

## 🧪 Testing

The app includes:
- Form validation
- Error handling
- Loading states
- Protected routes
- Token refresh on 401 responses

## 📦 Dependencies

- **react**: UI library
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **tailwindcss**: Utility-first CSS
- **lucide-react**: Icon library

## 🚀 Deployment

### Build Optimization
```bash
npm run build
```

### Docker (Optional)
Create a `Dockerfile` in the frontend directory:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
```

## 🐛 Troubleshooting

### CORS Issues
- Ensure backend has CORS enabled
- Check API URLs in `.env`

### 401 Unauthorized
- Clear localStorage and login again
- Check if token is expired
- Verify backend is returning valid JWT

### Cart Not Working
- Ensure CartProvider wraps the app
- Check browser console for errors

### API Connection Failed
- Verify local backend services are running in Visual Studio
- Check network tab in DevTools
- Ensure correct API URLs in `.env`

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Axios Documentation](https://axios-http.com)

## 📝 Notes

- JWT tokens are stored in `localStorage`
- Cart data is stored in React Context (session-based)
- All API calls include JWT token in headers automatically
- The app redirects to login if token expires (401 response)

## 🎯 Next Steps

1. Update backend API URLs in `.env`
2. Run `npm install`
3. Start with `npm run dev`
4. Test authentication flow
5. Test hotel browsing
6. Complete a test booking

---

**Happy Coding! 🎉**
