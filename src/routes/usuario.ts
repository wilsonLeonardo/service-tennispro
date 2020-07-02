import { Router } from 'express';

import UsuarioController from '~/controllers/usuario';
import { authMiddleware, Foto } from '~/middlewares';

const router = Router();

router.get('/profile', authMiddleware, UsuarioController.profile);
router.post(
  '/avatar',
  Foto.single('file'),
  authMiddleware,
  UsuarioController.setAvatar
);
router.post('/', UsuarioController.create);
router.put('/update', authMiddleware, UsuarioController.update);
router.put('/updateClube', authMiddleware, UsuarioController.updateClube);
router.get('/campeonatos', authMiddleware, UsuarioController.meusCampeonatos);
router.get(
  '/campeonatosConcluidos',
  authMiddleware,
  UsuarioController.meusCampeonatosConcluidos
);
router.get('/email/:email', UsuarioController.findByEmail);
router.patch(
  '/device/:device',
  authMiddleware,
  UsuarioController.deviceIdentifier
);

export { router as UsuarioRouter };
