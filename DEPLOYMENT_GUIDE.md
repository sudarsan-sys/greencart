# Deployment Guide - Fix "Failed to fetch products" Error

## **Step 1: Environment Variables Setup**

### **Frontend (Vercel)**
Add these environment variables in your Vercel dashboard:

```
VITE_BACKEND_URL=https://your-backend-url.vercel.app
VITE_CURRENCY=$
```

### **Backend (Vercel)**
Add these environment variables in your Vercel dashboard:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## **Step 2: Update CORS Origins**

Replace `your-frontend-domain.vercel.app` in `server/server.js` with your actual frontend domain.

## **Step 3: Test the API**

1. Test your backend API: `https://your-backend-url.vercel.app/api/test`
2. Test products endpoint: `https://your-backend-url.vercel.app/api/product/list`

## **Step 4: Check Console Logs**

Open browser developer tools and check the console for:
- The actual URL being called
- Any CORS errors
- Network request failures

## **Common Issues:**

1. **Wrong Backend URL**: Make sure `VITE_BACKEND_URL` points to your actual backend
2. **CORS Issues**: Update the allowed origins in server.js
3. **Environment Variables**: Ensure all required env vars are set in Vercel
4. **Database Connection**: Check if MongoDB connection is working

## **Quick Fix:**

If you're still having issues, temporarily allow all origins in development:

```javascript
// In server.js - for testing only
app.use(cors({ 
  origin: true, // Allow all origins temporarily
  credentials: true 
}));
``` 