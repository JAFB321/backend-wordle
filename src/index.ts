import dotenv from 'dotenv';
import express, {json} from 'express';
import appRoutes from './routes/index'
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use('/api', appRoutes);

app.get('/', async (req, res) => {
    res.json({
        hola: ""
    })
})

app.listen(port, () => console.log(`Server listening on port ${port}`))