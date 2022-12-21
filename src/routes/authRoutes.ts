import express from 'express';
import { login, profile, register } from '../controllers/authController';
import { isAuth } from '../middleware/isAuth';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/profile', isAuth, profile);

export default router;
