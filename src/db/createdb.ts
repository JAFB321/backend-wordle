import { getClient } from "./database"
import dotenv from 'dotenv'
dotenv.config()

export const createDB = async () => {
    const client = await getClient();

    // ------------------ Create database ------------------
    const dbname = process.env.PGDATABASE || 'wordle';

    const alreadtExist = (await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbname}'`)).rowCount > 0
    if(!alreadtExist){
        await client.query(`CREATE DATABASE ${dbname}`)
    }
    
    // ------------------ Create tables ------------------
    const tables = [
        {
            name: 'users',
            cols: [
                'id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
                'username VARCHAR(20) NOT NULL',
                'password VARCHAR(20) NOT NULL'
            ]
        },
        {
            name: 'dictionary',
            cols: [
                'word TEXT PRIMARY KEY',
                'available BOOLEAN DEFAULT TRUE'
            ]
        }
    ]

    // drop all tables before create
    await client.query(`DROP TABLE IF EXISTS ${tables.map(({name}) => name).join(',')}`)

    for(let table of tables){
        const {name, cols} = table;

        await client.query(`CREATE TABLE ${name}(
            ${cols.join(',')}
        )`)
    }

    return {
        message: 'Database created successfuly',
        dbname,
        tables
    }
}

createDB()
.then(console.log)
.catch(console.error)