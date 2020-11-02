import { Router } from 'express';
import cron from 'node-cron';

import RankingController from '~/controllers/ranking';
import { authMiddleware } from '~/middlewares';

const router = Router();

router.post('/inscrever/:id', authMiddleware, RankingController.create);
cron.schedule('0 2 1,16 * *', RankingController.resultadoPartidas);
router.get('/meusRankings', authMiddleware, RankingController.meusRankings);
router.get('/', authMiddleware, RankingController.indexClube);
router.get('/:id', authMiddleware, RankingController.index);
router.delete('/:id', authMiddleware, RankingController.clubeRemoveJogador);
router.patch('/partida/:id', authMiddleware, RankingController.updateGanhador);

export { router as RankingRouter };
