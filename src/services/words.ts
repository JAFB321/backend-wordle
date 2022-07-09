import {query} from '../db/database';

export const getCurrentWord = async () => {
    const res = await query('SELECT * FROM selectedWords WHERE active = TRUE LIMIT 1');
    return res.rows[0];
}