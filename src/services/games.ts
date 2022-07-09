import { query } from "../db/database"

export const getUserGame = async (gameId: number) => {
    const game = await query(`
            SELECT id, userId, attemps, word, state FROM userGames
            WHERE id = $1 LIMIT 1            
    `, [gameId])   

    if(game.rows[0]){
        const {id, userid, attemps, word, state} = game.rows[0];
        return {id, userid, attemps, word, state}
    }
    else return null;
}

export const startUserGame = async (userId: number) => {
    const selectedWord = (await query(`
        SELECT word FROM selectedWords WHERE active = true
    `)).rows[0]?.word;
    
    if(!selectedWord) throw new Error('There is not available word');

    await query(
        `INSERT INTO userGames(userId, word, attemps, state)
         VALUES($1, $2, 0, 'progress')
        `, 
        [userId, selectedWord]
    )

    return await getActiveUserGame(userId);
}

export const getActiveUserGame = async (userId: number) => {
    const activeGame = await query(`
            SELECT id, userId, attemps, state, word FROM userGames
            WHERE userId = $1 AND state = 'progress' LIMIT 1            
    `, [userId]) 
      
    if(activeGame.rows[0]){
        const {id, userid, attemps, state} = activeGame.rows[0];
        return {id, userid, attemps, state}
    }
    else return null;
}

export const getLastUserGame = async (userId: number) => {
    const lastGame = await query(`
        SELECT id, userId, attemps, state, word FROM userGames
        WHERE userId = $1
        ORDER BY id DESC
        LIMIT 1     
    `, [userId]) 
      
    if(lastGame.rows[0]){
        const {id, userid, attemps, state, word} = lastGame.rows[0];
        return {id, userid, attemps, state, word}
    }
    else return null;
}

export const setUserGameAttemps = async (gameId: number, attemps: number) => {
    await query(`
        UPDATE userGames
        SET attemps = $2
        WHERE id = $1
    `, [gameId, attemps])
}

export const setUserGameState = async (gameId: number, state: 'won' | 'lost' | 'progress') => {
    await query(`
        UPDATE userGames
        SET state = $2
        WHERE id = $1
    `, [gameId, state])
}