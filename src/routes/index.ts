import { Router } from 'express';

import { AuthenticationRouter } from './authentication';
import { CampeonatoRouter } from './campeonato';
import { ClubeRouter } from './clube';
import { JogoRouter } from './jogo';
import { MessageRouter } from './mensagens';
import { UsuarioRouter } from './usuario';
import { UsuarioPerfilRouter } from './usuario.perfil';
import { ProfessorRouter } from './usuario.professor';

const router = Router();

router.use('/user', UsuarioRouter);
router.use('/auth', AuthenticationRouter);
router.use('/perfil', UsuarioPerfilRouter);
router.use('/professor', ProfessorRouter);
router.use('/campeonato', CampeonatoRouter);
router.use('/clube', ClubeRouter);
router.use('/mensagem', MessageRouter);
router.use('/jogo', JogoRouter);

export { router };
