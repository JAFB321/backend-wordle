import {Router} from 'express';
import game from './game'
import user from './user'
import reports from './reports'

const router = Router();
router.get('/ping', (req, res) => {res.send('pong')})
router.use(game);
router.use(user);
router.use(reports);

export default router;