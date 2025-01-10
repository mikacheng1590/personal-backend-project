import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.DEV_EMAIL_ADDRESS,
    pass: process.env.DEV_EMAIL_PASSWORD,
  },
});

const sendEmail = async ({
  from = process.env.DEV_EMAIL_ADDRESS,
  to,
  subject,
  text = '',
  html = ''
}) => {
  let data = {
    from,
    to,
    subject,
    ...(text && { text }),
    ...(html && { html }),
  };

  try {
    const info = await transporter.sendMail(data);

    console.log(`Email with subject ${subject} sent on ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`);
    console.log('Return response: ', info);
  } catch(err) {
    console.error('Cannot send email: ', err);
  }
}

export default sendEmail;