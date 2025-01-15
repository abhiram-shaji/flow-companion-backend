import express from 'express';
import { addTask, getTasksByProject, editTask, deleteTask, getTasksByAssignedTo, getAllTasks } from '../controllers/taskController';

const router = express.Router();

router.post('/', addTask); // Add Task
router.post('/assigned-to', getTasksByAssignedTo);
router.get('/get-all', getAllTasks);
router.get('/project/:projectId', getTasksByProject); // Get Tasks by Project
router.put('/:id', editTask); // Edit Task
router.delete('/:id', deleteTask); // Delete Task

export default router;
