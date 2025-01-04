import express from 'express';
import { addUser, getAllWorkers } from '../controllers/userController';
import { simpleAuth } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', simpleAuth, addUser);
router.get('/workers', simpleAuth, getAllWorkers);

export default router;
