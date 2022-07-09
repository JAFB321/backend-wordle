import { query } from "../db/database";

export const getCountUserGames = async (userId: number, state?: 'won' | 'lost' | 'progress') => {
    const game = await query(`
        SELECT COUNT(*) FROM userGames ug
        WHERE userid = $1 ${state !== undefined ? 'AND state = $2' : ''}
    `, !state ? [userId] : [userId, state])   

    if(game.rows[0]){
        const {count} = game.rows[0];
        return {count}
    }
    else return null;
}

export const getTopPlayers = async () => {
    const topPlayers = await query(`
        SELECT COUNT(*) victories, u.id userId, u.username username FROM userGames ug
        INNER JOIN users u ON u.id = ug.userid
        WHERE ug.state = 'won'
        GROUP BY u.id
        ORDER BY victories DESC
        LIMIT 10
    `)   

    if(!!topPlayers.rows.length){
        return topPlayers.rows.map(({victories, username, userid}) => ({
            victories,
            username,
            userid
        }))
    }
    else return [];
}

export const getTopWords = async () => {
    const topWords = await query(`
        SELECT COUNT(*) victories, word FROM userGames 
        WHERE state = 'won'
        GROUP BY word
        ORDER BY victories DESC
        LIMIT 10
    `)   

    if(!!topWords.rows.length){
        return topWords.rows.map(({victories, word}) => ({
            victories,
            word
        }))
    }
    else return [];
}