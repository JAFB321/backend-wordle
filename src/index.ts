import dotenv from 'dotenv';
dotenv.config();
import express, {json} from 'express';
import { verifyUnauthRequest } from './middlewares/auth';
import appRoutes from './routes/index';
import wordUpdater from './workers/wordUpdater';

const app = express();
const port = process.env.PORT || 3000;

app.use(json());
app.use('/api', appRoutes);
app.use(verifyUnauthRequest)

// Update word each 5 minutes
wordUpdater.init(360);

app.listen(port, () => console.log(`Server listening on port ${port}`))