import {Router} from 'express'
import { getActiveUserGame, getUserGame } from '../services/games';

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

router.post('/game/:gameId/attemp', async (req, res) => {
    const {gameId} = req.params;
    const {word} = req.body;

    const nGameId = Number.parseInt(gameId, 10);
    if(!word || !nGameId) return res.status(422).send({
        error: 'Missing parameters'
    });

    const game = await getUserGame(nGameId);
    if(!game) return res.status(500).send({
        error: 'The game does not exists'
    });

    const {state, attemps, word: gameWord } = game;

    if(state !== 'progress') return res.status(400).send({
        error: `The game is over. ${state === 'won' ? 'You have won this game!' : 'You have lost this game'}`
    });

    if(word.length !== 5) return res.status(422).send({
        error: 'The word must have 5 letters'
    });

    // Compare words
    const letters = (word+'').toLowerCase().split('');
    const coincidences = letters.map((char, i) => {
        if(char === gameWord[i]) return {
            letter: char,
            value: 1
        };
        else if(gameWord.includes(char)) return {
            letter: char,
            value: 2
        };
        else return {
            letter: char,
            value: 3
        };
    });
});

export default router;