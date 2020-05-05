import { Router } from 'express';

import { AuthenticationRouter } from './authentication';
import { UsuarioRouter } from './usuario';
import { UsuarioPerfilRouter } from './usuario.perfil';

const router = Router();

router.use('/user', UsuarioRouter);
router.use('/auth', AuthenticationRouter);
router.use('/perfil', UsuarioPerfilRouter);

export { router };
