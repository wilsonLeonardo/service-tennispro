import { Router } from 'express';

import UsuarioPerfilController from '../controllers/usuario.perfil';

const router = Router();

router.get('/', UsuarioPerfilController.show);

export { router as UsuarioPerfilRouter };
