import express from 'express';
import { register, login, logout, isAuth } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js'; // or adjust path accordingly

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/logout', authUser,logout);
userRouter.get('/is-auth', authUser, isAuth); // Protected route

export default userRouter;
