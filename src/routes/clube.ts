import { Router } from 'express';

import ClubeController from '~/controllers/clube';
import { authMiddleware } from '~/middlewares';

const router = Router();

router.post('/', ClubeController.create);
router.get('/:CEP', ClubeController.findByCep);
router.get('/brasil/all', ClubeController.findAll);
router.get('/', authMiddleware, ClubeController.findByMyEndereco);
router.get('/associados/:id', authMiddleware, ClubeController.findAssociados);
router.patch('/update', authMiddleware, ClubeController.update);

export { router as ClubeRouter };
