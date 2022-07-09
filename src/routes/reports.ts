import express from 'express';
import { verifyJWtToken } from '../middlewares/auth';
import { Request as JWTRequest } from "express-jwt";
import { getCountUserGames, getTopPlayers, getTopWords } from '../services/reports';

const router = express.Router();

router.get('/reports/top-players', async (req, res) => {
    const topPlayers = await getTopPlayers();
    res.send(topPlayers);
})

router.get('/reports/top-words', async (req, res) => {
    const topWords = await getTopWords();
    res.send(topWords);
})

router.get('/reports/user/:userId', verifyJWtToken, async (req: JWTRequest, res) => {
    
    const reqUserId = Number.parseInt(req.auth?.userid);
    const userId = Number.parseInt(req.params.userId);

    if(!!reqUserId && reqUserId !== userId) return res.status(403).send({
        error: "You don't have permission for use this resource"
    }); 

    if(!userId) return res.status(422).send({
        error: 'Missing or invalid userId'
    }); 

    const gamesCount = await getCountUserGames(userId);
    const wins = await getCountUserGames(userId, 'won');

    res.send({
        gamesCount: gamesCount?.count,
        wins: wins?.count
    })
})

export default router;