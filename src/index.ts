import express, {json} from 'express';

const app = express();
app.use(json());

app.get('/', (req, res) => {
    res.json({
        hola: "mundo"
    })
})

app.listen(3000, () => console.log(`Server listening on port ${3000}`))