import { Router } from 'express';
import cron from 'node-cron';

import RankingCommunityController from '~/controllers/ranking.community';
import { authMiddleware } from '~/middlewares';

const router = Router();

router.post('/criarRanking', authMiddleware, RankingCommunityController.create);
cron.schedule('0 2 1,16 * *', RankingCommunityController.resultadoPartidas);
router.get(
  '/meuRanking',
  authMiddleware,
  RankingCommunityController.meuRanking
);
router.get(
  '/meusOutrosRankings',
  authMiddleware,
  RankingCommunityController.otherRankings
);
router.get('/:id', authMiddleware, RankingCommunityController.index);
router.get(
  '/gerenciar/ranking',
  authMiddleware,
  RankingCommunityController.gerenciarRanking
);
router.post(
  '/inscreverRanking',
  authMiddleware,
  RankingCommunityController.subscribe
);
router.delete('/:id', authMiddleware, RankingCommunityController.removeJogador);
router.patch(
  '/partida/:id',
  authMiddleware,
  RankingCommunityController.updateGanhador
);

export { router as RankingCommunityRouter };
