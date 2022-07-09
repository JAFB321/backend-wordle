import express, {json} from 'express';
import { verifyUnauthRequest } from './middlewares/auth';
import appRoutes from './routes/index';

const app = express();

app.use(json());
app.use('/api', appRoutes);
app.use(verifyUnauthRequest);

export default app;