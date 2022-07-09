import {Router} from 'express'
import { getUserGame } from '../services/games';

const router = Router(); 

router.get('/:userId/game', async (req, res) => {

    const userId = Number.parseInt(req.params.userId);

    if(!userId) return res.status(422).send({
        error: 'Missing or invalid userId'
    });

    
    
})