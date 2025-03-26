import express from 'express';
import sendEmail from '../utils/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { from, to, bcc, subject, text, html } = req.body;

  try {
    await sendEmail({ from, to, bcc, subject, text, html });
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

export default router;