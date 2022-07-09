import {query} from '../db/database';

export const getCurrentWord = async () => {
    const res = await query('SELECT * FROM selectedWords WHERE active = TRUE LIMIT 1');
    return res.rows[0];
}

export const setCurrentWord = async (word: string) => {
    // Desactivate last active word
    await query(`
        UPDATE selectedWords
        SET active = false
        WHERE active = true
    `);

    // Disable the word from the dictionary
    await query(`
        UPDATE dictionary
        SET available = false
        WHERE word = $1
    `, [word]);

    // Finish all in progress games
    await query(`
        UPDATE userGames
        SET state = 'lost'
        WHERE state = 'progress'
    `);

    // Add active word
    await query(`
        INSERT INTO selectedWords(word, active)
        VALUES($1, true)
    `, [word]);
}

export const getRandomWord = async (): Promise<string> => {
    const letters = 'abcdefghijklmnñopqrstuvwxyz';
    const randomPos = Math.floor(Math.random() * (letters.length));
    const initialLetter = letters[randomPos]?.toString() || '';

    const res = await query(`
        SELECT * FROM "dictionary"
        WHERE word LIKE $1 || '____' AND available = true
        ORDER BY random()
        LIMIT 1
    `, [initialLetter]);
    
    return res.rows[0]?.word;
}