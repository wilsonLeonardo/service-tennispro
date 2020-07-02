import { Router } from 'express';

import JogoController from '~/controllers/jogo';
import { authMiddleware } from '~/middlewares';

const router = Router();

router.post('/:id', authMiddleware, JogoController.create);
router.get('/aceitos', authMiddleware, JogoController.findAceitos);
router.get('/pendentes', authMiddleware, JogoController.findPendentes);
router.get('/finalizados', authMiddleware, JogoController.findFinalizados);
router.get('/meuStatus', authMiddleware, JogoController.meuStatus);
router.patch(
  '/:id/updateGanhador',
  authMiddleware,
  JogoController.updateGanhador
);
router.patch('/:id/updateStatus', authMiddleware, JogoController.updateStatus);

export { router as JogoRouter };
