import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import basicAuth from 'express-basic-auth';
// import paulasChoiceCronJob from './paulas-choice-cron-job/index.js';
import paulasChoiceRoutes from './routes/paulas-choice.js';
import pingRoutes from './routes/ping.js';
import sendEmailRoutes from './routes/email.js';

const app = express();
const port = process.env.PORT || 4000;
const basicAuthMiddleware = basicAuth({
  users: { [process.env.API_SIMPLE_USERNAME]: process.env.API_SIMPLE_PASSWORD },
});

app.use(bodyParser.json());
app.use('/paulas-choice', basicAuthMiddleware, paulasChoiceRoutes);
app.use('/ping', pingRoutes);
app.use('/v1/email-service', basicAuthMiddleware, sendEmailRoutes);

app.listen(port, () => {
  console.log(`Mika's app listening on port ${port}`);
  
  // paulasChoiceCronJob.start();
})