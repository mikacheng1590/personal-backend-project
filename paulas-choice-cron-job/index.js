import { CronJob } from 'cron';
import sendEmail from '../utils/email.js';
import getPaulasProductPrice, { BHA_PRODUCT_URL, BHA_USUAL_PRICE } from '../utils/paulas-choice.js';

const paulasChoiceCronJob = CronJob.from({
  cronTime: '0 0 * * *',
  onTick: async () => {
    const data = await getPaulasProductPrice(BHA_PRODUCT_URL);
    console.log(data);

    if (data.status && +data.price < BHA_USUAL_PRICE) {
      const htmlContent = `
      <div>
        <p>${data.productName} is $${data.price} now! (Usual price is $${BHA_USUAL_PRICE})</p>
        <a href=${BHA_PRODUCT_URL} target="_blank">GO SPEND YOUR MONEY NOW</a>
      </div>
      `;

      sendEmail({
        to: [process.env.SELF_EMAIL_ADDRESS],
        subject: `[TO SELF: PRICE DROP!] ${data.productName}`,
        html: htmlContent
      });
    } else if (!data.status) {
      sendEmail({
        to: [process.env.SELF_EMAIL_ADDRESS],
        subject: `[TO SELF: ERROR!] Something's wrong with ${BHA_PRODUCT_URL}`,
        html: `
        <div>
          <p>Cannot fetch data from ${BHA_PRODUCT_URL}. Please take a look.</p>
          <p>Error: ${data.error}</p>
        </div>
        `
      });
    }
  },
  timeZone: 'America/Los_Angeles'
})

export default paulasChoiceCronJob;