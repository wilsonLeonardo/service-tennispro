import { Router } from 'express';

import { AuthenticationRouter } from './authentication';
import { UsuarioRouter } from './usuario';
import { UsuarioPerfilRouter } from './usuario.perfil';
import { ProfessorRouter } from './usuario.professor';

const router = Router();

router.use('/user', UsuarioRouter);
router.use('/auth', AuthenticationRouter);
router.use('/perfil', UsuarioPerfilRouter);
router.use('/professor', ProfessorRouter);

export { router };
