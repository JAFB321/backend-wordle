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

export const query = async (query: string, params: any[] = []) => {
    return await dbPool.query(query, params);
}

export const getClient = async () => {
    return await dbPool.connect();
}