
import express, {json} from 'express';
import { PORT } from './config';
import { verifyUnauthRequest } from './middlewares/auth';
import appRoutes from './routes/index';
import wordUpdater from './workers/wordUpdater';

const app = express();

app.use(json());
app.use('/api', appRoutes);
app.use(verifyUnauthRequest)

// Update word each 5 minutes
wordUpdater.init(360);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))