import express from 'express';
import {
  addProject,
  getAllProjects,
  getProjectDetails,
  editProject,
  deleteProject,
} from '../controllers/projectController';

const router = express.Router();

router.post('/', addProject); // Add Project
router.get('/', getAllProjects); // Get All Projects
router.get('/:id', getProjectDetails); // Get Project Details
router.put('/:id', editProject); // Edit Project
router.delete('/:id', deleteProject); // Delete Project

export default router;
