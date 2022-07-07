import {Pool} from 'pg'

const dbPool = new Pool({
    host: process.env.PGHOST,
    port: Number.parseInt(process.env.PGPORT || '') || 5432,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
});

dbPool.on('error', (err) => {
    console.warn(err);
    dbPool.end();
})

export const getUsers = async () => {
    return await dbPool.query('SELECT * FROM users')
}