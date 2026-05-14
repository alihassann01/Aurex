import express from "express";
import { register, login, getProfile, logout } from '../controllers/auth.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.post('/logout', authMiddleware, logout);

export default router;