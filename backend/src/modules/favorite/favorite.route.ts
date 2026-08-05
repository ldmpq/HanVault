import { Router } from 'express';
import { FavoriteController } from './favorite.controller';
import { authenticateJwt } from '../../shared/middlewares/auth.middleware';

const router = Router();

// Yêu cầu đăng nhập cho mọi thao tác Favorites
router.use(authenticateJwt);

router.post('/toggle', FavoriteController.toggle);
router.get('/ids', FavoriteController.getMyFavorites);

export default router;