import express from 'express';
import { registerUser, loginUser, getAllUsers, updateUserStatus, deleteUser } from '../controllers/authController';
import authenticate from '../middleware/authentication';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/users', authenticate, getAllUsers);
router.put('/users/:id', authenticate, updateUserStatus);
router.delete('/users/:id', authenticate, deleteUser);

export default router;
