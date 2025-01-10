import 'dotenv/config';
import express from 'express';
import paulasChoiceCronJob from './paulas-choice-cron-job/index.js';

const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Mika's app listening on port ${port}`);
  
  paulasChoiceCronJob.start();
})