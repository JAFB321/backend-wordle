import {Pool} from 'pg'
import { PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER } from '../config';

const dbPool = new Pool({
    host: PGHOST,
    port: PGPORT,
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
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