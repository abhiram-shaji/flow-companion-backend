import express from 'express';
import { addWorker, getAllWorkers, editWorker, deleteWorker, loginUser } from '../controllers/userController';

const router = express.Router();

router.post('/', addWorker); // Add Worker
router.get('/workers', getAllWorkers); // Get All Workers
router.put('/:id', editWorker); // Edit Worker
router.delete('/:id', deleteWorker); // Delete Worker
router.post('/login', loginUser); // User Login

export default router;
