import { query } from "../db/database"

export const checkLogin = async (user: string, password: string) => {
    const logged = await query(`
        SELECT * FROM users
        WHERE username = $1 AND password = $2
    `, [user, password])

    if(logged.rows[0]){
        const {username, id} = logged.rows[0];
        return {
            username,
            userid: id
        };
    } else return null;
}