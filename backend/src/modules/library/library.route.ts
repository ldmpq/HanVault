import { Router } from 'express';
import { getDeckDetails, getLibraryDecks } from './library.controller';
import { authenticateJwt } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.get('/decks', authenticateJwt, getLibraryDecks);
router.get('/decks/:id', authenticateJwt, getDeckDetails);

export default router;