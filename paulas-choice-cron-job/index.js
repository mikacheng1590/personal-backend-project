import { CronJob } from 'cron';
import axios from 'axios';
import sendEmail from '../services/email.js';

const USUAL_PRICE = 35;
const productUrl = 'https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html';

const getPaulasProductPrice = async (productUrl) => {
  try {
    const res = await axios.get(`${productUrl}?customer=true`);

    return {
      status: true,
      price: res?.data?.dataLayer?.product_current_price ?? null,
      productName: res?.data?.dataLayer?.product_short_name ?? null,
    };
  } catch(e) {
    return {
      status: false,
      error: e
    };
  }
}

const paulasChoiceCronJob = CronJob.from({
  cronTime: '0 0 * * *',
  onTick: async () => {
    const data = await getPaulasProductPrice(productUrl);

    if (data.status && +data.price < USUAL_PRICE) {
      const htmlContent = `
      <div>
        <p>${data.productName} is $${data.price} now! (Usual price is $${USUAL_PRICE})</p>
        <a href=${productUrl} target="_blank">GO SPEND YOUR MONEY NOW</a>
      </div>
      `;

      sendEmail({
        to: process.env.SELF_EMAIL_ADDRESS,
        subject: `[TO SELF: PRICE DROP!] ${data.productName}`,
        html: htmlContent
      });
    } else if (!data.status) {
      sendEmail({
        to: process.env.SELF_EMAIL_ADDRESS,
        subject: `[TO SELF: ERROR!] Something's wrong with ${productUrl}`,
        html: `
        <div>
          <p>Cannot fetch data from ${productUrl}. Please take a look.</p>
          <p>Error: ${data.error}</p>
        </div>
        `
      });
    }
  },
  timeZone: 'America/Los_Angeles'
})

export default paulasChoiceCronJob;