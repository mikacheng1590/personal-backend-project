import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
// import paulasChoiceCronJob from './paulas-choice-cron-job/index.js';
import paulasChoiceRoutes from './routes/paulas-choice.js';
import pingRoutes from './routes/ping.js';
import sendEmailRoutes from './routes/email.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use('/paulas-choice', paulasChoiceRoutes);
app.use('/ping', pingRoutes);
app.use('/v1/email-service', sendEmailRoutes);

app.listen(port, () => {
  console.log(`Mika's app listening on port ${port}`);
  
  // paulasChoiceCronJob.start();
})