import { Router } from 'express';

import UsuarioController from '~/controllers/usuario';
import { authMiddleware } from '~/middlewares';

const router = Router();

router.get('/profile', authMiddleware, UsuarioController.profile);
router.put('/avatar', UsuarioController.setAvatar);
router.post('/', UsuarioController.create);
router.put('/:id', UsuarioController.update);

export { router as UsuarioRouter };
