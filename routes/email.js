import express from 'express';
import sendEmail, { sendBulkEmails } from '../utils/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { from, to, bcc, subject, text, html } = req.body;

  try {
    const { success, results, error } = await sendEmail({ from, to, bcc, subject, text, html });
    if (success) {
      res.status(200).json({ message: 'Email sent successfully', results });
    } else {
      throw new Error(error);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error: error });
  }
});

router.post('/bulk', async (req, res) => {
  const { from, to, bcc } = req.body;

  try {
    const { success, results, error } = await sendBulkEmails({ from, to, bcc }); 
    if (success) {
      res.status(200).json({ message: 'Emails sent successfully', results });
    } else {
      throw new Error(error);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to send emails', error });
  }
});

export default router;