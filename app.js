import 'dotenv/config';
import express from 'express';
// import paulasChoiceCronJob from './paulas-choice-cron-job/index.js';
import paulasChoiceRoutes from './routes/paulas-choice.js';

const app = express();
const port = process.env.PORT || 4000;

app.use('/paulas-choice', paulasChoiceRoutes);

app.listen(port, () => {
  console.log(`Mika's app listening on port ${port}`);
  
  // paulasChoiceCronJob.start();
})