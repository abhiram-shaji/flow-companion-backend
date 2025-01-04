import express from 'express';
import { addEstimate, getEstimatesByProject } from '../controllers/estimateController';

const router = express.Router();

router.post('/', addEstimate); // Add Estimate
router.get('/project/:projectId', getEstimatesByProject); // Get Estimates by Project

export default router;
