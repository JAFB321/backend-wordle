import {Router} from 'express'
import { Request as JWTRequest } from 'express-jwt';
import { verifyJWtToken } from '../middlewares/auth';
import { getActiveUserGame, getLastUserGame, getUserGame, setUserGameAttemps, setUserGameState, startUserGame } from '../services/games';
import { getCurrentWord } from '../services/words';

const router = Router(); 

router.get('/user/:userId/game', verifyJWtToken, async (req: JWTRequest, res) => {

    const reqUserId = Number.parseInt(req.auth?.userid);
    const userId = Number.parseInt(req.params.userId);

    if(!!reqUserId && reqUserId !== userId) return res.status(403).send({
        error: "You don't have permission for use this resource"
    }); 

    if(!userId) return res.status(422).send({
        error: 'Missing or invalid userId'
    });

    try {
        let activeGame = await getActiveUserGame(userId);
        if(!activeGame){
            const lastGame = await getLastUserGame(userId);
            const currentWord = await getCurrentWord();

            if(lastGame?.word === currentWord.word) return res.send({
                gameId: lastGame?.id,
                attemps: lastGame?.attemps,
                state: lastGame?.state,
                word: lastGame?.word,
                alert: 'You already have played the current word. Please wait a few minutes to restart'
            });
            else{
                activeGame = await startUserGame(userId);
            }
        }
        
        if(!activeGame) return res.status(500).send({
            error: 'Not able to get the game'
        });

        const {id, attemps, state} = activeGame;

        res.json({
            gameId: id,
            attemps,
            state
        });
        
    } catch (error) {
        res.status(500).send({
            error: 'An error has ocurred'
        });
    }
});

router.post('/game/:gameId/attemp', verifyJWtToken, async (req: JWTRequest, res) => {
    const {gameId} = req.params;
    const {user_word} = req.body;

    const nGameId = Number.parseInt(gameId, 10);
    if(!user_word || !nGameId) return res.status(422).send({
        error: 'Missing parameters'
    });

    const game = await getUserGame(nGameId);
    if(!game) return res.status(500).send({
        error: 'The game does not exists'
    });

    const reqUserId = Number.parseInt(req.auth?.userid);
    const userid = game.userid;

    if(!!reqUserId && reqUserId !== userid) return res.status(403).send({
        error: "You don't have permission for use this resource"
    }); 

    const {state, attemps, word: gameWord } = game;

    if(state !== 'progress') return res.status(400).send({
        error: `The game is over. ${state === 'won' ? 'You have won this game!' : 'You have lost this game'}`
    });

    if(user_word.length !== 5) return res.status(422).send({
        error: 'The word must have 5 letters'
    });

    // Compare words
    const letters = (user_word+'').toLowerCase().split('');
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

    let won = false, maxAttemps = false;
    // If won
    if(user_word === gameWord){
        await setUserGameState(nGameId, 'won');
        won = true;
    }
    // If attemps are over
    if(!won && attemps+1 >= 5){
        await setUserGameState(nGameId, 'lost');
        maxAttemps = true;
    }
    // Update game attemps
    await setUserGameAttemps(nGameId, attemps+1);

    res.send({
        state: won ? 'won' : maxAttemps ? 'lost' : 'progress',
        coincidences
    });
});

export default router;