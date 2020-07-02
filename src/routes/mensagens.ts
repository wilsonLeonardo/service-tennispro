import { Router } from 'express';

import MessageController from '~/controllers/message';
import { authMiddleware } from '~/middlewares';

const router = Router();

router.post('/', authMiddleware, MessageController.create);
router.get('/minhas', authMiddleware, MessageController.messages);
router.post('/:id', authMiddleware, MessageController.update);
router.get('/:id', authMiddleware, MessageController.getMessageView);
router.patch(
  '/:id/updateStatus',
  authMiddleware,
  MessageController.updateStatus
);

export { router as MessageRouter };
