import { Router } from 'express';
import {
  getProjects,
  getProjectBuildings,
  getProjectUnits,
  createProject,
  createBuilding,
  createUnit,
} from '../controllers/projects.controller.js';

const router = Router();

router.get('/projects', getProjects);
router.post('/projects', createProject);

router.get('/projects/:projectId/buildings', getProjectBuildings);
router.post('/buildings', createBuilding);

router.get('/projects/:projectId/units', getProjectUnits);
router.post('/units', createUnit);

export default router;
