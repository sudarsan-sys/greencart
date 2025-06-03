import express from 'express';
import { addAddress, getAddress } from '../controllers/addressController.js';
import authUser from '../middlewares/authUser.js';
// Import your authentication middleware if you have one
// import { authenticateUser } from '../middleware/auth.js';

const addressRouter = express.Router();

// Add address route
addressRouter.post('/add',authUser, addAddress);

// Get addresses route
addressRouter.get('/get',authUser, getAddress);
// Alternative: GET request with userId as query parameter
// addressRouter.get('/get/:userId', getAddress);

export default addressRouter;