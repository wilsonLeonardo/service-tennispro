import { Router } from 'express';

import AuthenticationController from '~/controllers/authentication';
import { authMiddleware } from '~/middlewares';

const router = Router();

router.post('/login', AuthenticationController.login);
router.post('/change', authMiddleware, AuthenticationController.change);

export { router as AuthenticationRouter };
