import { Router } from 'express';

import CamponatoController from '~/controllers/campeonato';
import { authMiddleware } from '~/middlewares';

const router = Router();

router.post('/', authMiddleware, CamponatoController.create);
router.get('/all', authMiddleware, CamponatoController.show);
router.post('/:campId/register', authMiddleware, CamponatoController.register);
router.post(
  '/:campId/cancel',
  authMiddleware,
  CamponatoController.cancelRegister
);
router.get('/myAtivos', authMiddleware, CamponatoController.findAtivo);
router.get(
  '/myFinalizados',
  authMiddleware,
  CamponatoController.findFinalizado
);
router.patch('/:id/done', authMiddleware, CamponatoController.done);

export { router as CampeonatoRouter };
