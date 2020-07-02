import { Router } from 'express';

import ProfessorController from '~/controllers/usuario.professor';
import { authMiddleware } from '~/middlewares';

const router = Router();

router.post('/', ProfessorController.create);
router.get('/', authMiddleware, ProfessorController.show);

export { router as ProfessorRouter };
