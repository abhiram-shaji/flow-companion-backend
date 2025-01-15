import express from 'express';
import { addEstimate, getEstimatesByProject, getAllEstimates, getEstimatesByAssignedUser } from '../controllers/estimateController';

const router = express.Router();

router.post('/', addEstimate); // Add Estimate
router.get('/project/:projectId', getEstimatesByProject); // Get Estimates by Project

// Route to fetch all estimates
router.get('/get-all', getAllEstimates);

// Route to fetch estimates for a specific user (using request body)
router.post('/assigned-to', getEstimatesByAssignedUser);

export default router;
