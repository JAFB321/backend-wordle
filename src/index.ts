import dotenv from 'dotenv';
import express, {json} from 'express';
import appRoutes from './routes/index';
import wordUpdater from './workers/wordUpdater';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use('/api', appRoutes);

// Update word each 5 minutes
wordUpdater.init(2);

app.listen(port, () => console.log(`Server listening on port ${port}`))