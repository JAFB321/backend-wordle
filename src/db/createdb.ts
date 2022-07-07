import fs from 'fs'
import { getClient } from "./database"
import dotenv from 'dotenv'
dotenv.config()
const copyFrom = require('pg-copy-streams').from

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
        },
        {
            name: 'selectedWords',
            cols: [
                'id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
                'word TEXT REFERENCES dictionary(word) NOT NULL',
                'active BOOLEAN NOT NULL',
            ]
        },
        {
            name: 'userGames',
            cols: [
                'id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY',
                'userId INT REFERENCES users(id) NOT NULL',
                'word TEXT REFERENCES dictionary(word) NOT NULL',
                'attemps SMALLINT NOT NULL',
                'state VARCHAR(8) NOT NULL'
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

    // ------------------ Example data ------------------

    // users
    const username = 'user', password = '12345';
    const username2 = 'player', password2 = '12345';
    await client.query(`INSERT INTO public.users (username, password) VALUES($1, $2)`, [username, password]);
    await client.query(`INSERT INTO public.users (username, password) VALUES($1, $2)`, [username2, password2]);

    // dictionary
    return new Promise((resolve, reject) => {
        const stream = client.query(copyFrom("COPY dictionary(word) FROM STDIN "));
        const fileStream = fs.createReadStream('words.txt')
    
        const onerror = (err: any) => reject(err)
        const onsuccess = () => {
            client.release();
            resolve({
                message: 'Database created successfuly',
                dbname,
                tables: tables.map(({name}) => name),
                user1: {username, password},
                user2: {username2, password2}
            });
        }
        
        fileStream.on('error', onerror);
        stream.on('error',  onerror);
        stream.on('finish',  onsuccess);
        fileStream.pipe(stream);
    })
}

console.log('Wait while the database is created');
createDB()
.then(console.log)
.catch(console.error)