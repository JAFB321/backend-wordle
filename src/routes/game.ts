import {Router} from 'express'
import { getActiveUserGame } from '../services/games';

const router = Router(); 

router.get('/:userId/game', async (req, res) => {

    const userId = Number.parseInt(req.params.userId);

    if(!userId) return res.status(422).send({
        error: 'Missing or invalid userId'
    });

    let activeGame = await getActiveUserGame(userId);

    if(!activeGame) return res.status(500).send({
        error: 'Not able to create a new game'
    });

    // Send active game
    const {id, attemps, state} = activeGame;
    res.json({
        gameId: id,
        attemps,
        state
    });
});