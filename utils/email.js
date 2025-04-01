import nodemailer from 'nodemailer';

const baseMailerSettings = {
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.DEV_EMAIL_ADDRESS,
    pass: process.env.DEV_EMAIL_PASSWORD,
  },
}

const sendEmail = async ({
  from = process.env.DEV_EMAIL_ADDRESS,
  to,
  bcc,
  subject,
  text = '',
  html = ''
}) => {
  let data = {
    from,
    ...(to && { to: to.join(',') }),
    ...(bcc && { bcc: bcc.join(',') }),
    subject,
    ...(text && { text }),
    ...(html && { html }),
  };

  try {
    const transporter = nodemailer.createTransport(baseMailerSettings);
    const info = await transporter.sendMail(data);

    console.log(`Email with subject ${subject} sent on ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`);
    console.log('Return response: ', info);

    return {
      success: true,
      results: info,
    }
  } catch(err) {
    console.error('Cannot send email: ', err);

    return {
      success: false,
      error: err,
    }
  }
}

/**
 * @param {string} from Email address of the sender.
 * @param {array} to Array of objects with email, subject, text, html properties.
 * @param {array} bcc Array of objects with email, subject, text, html properties.
 * @returns {object} Object success: boolean, results: array of results OR error: error object.
 */
export const sendBulkEmails = async ({
  from = process.env.DEV_EMAIL_ADDRESS,
  to = [],
  bcc = [],
}) => {
  try {
    const mailerSettings = {
      ...baseMailerSettings,
      pool: true
    }
    const transporter = nodemailer.createTransport(mailerSettings);

    const emailToPromises = to.length > 0 ? to.map(recipient =>
      transporter.sendMail({
          from,
          to: recipient.email,
          subject: recipient.subject,
          ...(recipient.text && { text: recipient.text }),
          ...(recipient.html && { html: recipient.html})
      })
   ) : [];

   const emailBccPromises = bcc.length > 0 ? bcc.map(recipient =>
    transporter.sendMail({
        from,
        bcc: recipient.email,
        subject: recipient.subject,
        ...(recipient.text && { text: recipient.text }),
        ...(recipient.html && { html: recipient.html})
    })
   ) : [];

   console.log('emailToPromises ', emailToPromises)
   console.log('emailBccPromises ', emailBccPromises)

   const results = await Promise.all([...emailToPromises, ...emailBccPromises])

   return {
    success: true,
    results: results.map(r => ({
      email: r.envelope.to,
      messageId: r.messageId,
    })),
   }
  } catch(err) {
    console.error('Cannot send emails: ', err);
    
    return {
      success: false,
      error: err,
    }
  }
}


export default sendEmail;