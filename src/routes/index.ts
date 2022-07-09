import {Router} from 'express';
import game from './game'
import user from './user'

const router = Router();
router.use(game);
router.use(user);

export default router;