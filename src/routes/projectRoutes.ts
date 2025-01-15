import express from 'express';
import {
  addProject,
  getAllProjects,
  getProjectDetails,
  editProject,
  deleteProject,
  getProjectsByAssignedUser,
} from '../controllers/projectController';

const router = express.Router();

router.post('/', addProject); // Add Project
router.get('/', getAllProjects); // Get All Projects
router.get('/:id', getProjectDetails); // Get Project Details
router.put('/:id', editProject); // Edit Project
router.delete('/:id', deleteProject); // Delete Project

// Route to fetch projects assigned to a specific user
router.post('/assigned-to', getProjectsByAssignedUser);

export default router;
