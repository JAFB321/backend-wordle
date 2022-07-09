import { PORT } from './config';
import app from './app'
import wordUpdater from './workers/wordUpdater';

// Update word each 5 minutes
wordUpdater.init(360);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
export default app;