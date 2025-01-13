import express from 'express';
import sendEmail from '../utils/email.js';
import getPaulasProductPrice, { BHA_PRODUCT_URL, BHA_USUAL_PRICE } from '../utils/paulas-choice.js';

const router = express.Router();

router.get('/price-check', async (req, res) => {
  try {
    const data = await getPaulasProductPrice(BHA_PRODUCT_URL);
    let statusCode = 200;
    let msg = 'Successful request to Paula\'s Choice product price check.';
    
    if (data.status && +data.price < BHA_USUAL_PRICE) {
      const htmlContent = `
      <div>
        <p>${data.productName} is $${data.price} now! (Usual price is $${BHA_USUAL_PRICE})</p>
        <a href=${BHA_PRODUCT_URL} target="_blank">GO SPEND YOUR MONEY NOW</a>
      </div>
      `;

      sendEmail({
        to: process.env.SELF_EMAIL_ADDRESS,
        subject: `[TO SELF: PRICE DROP!] ${data.productName}`,
        html: htmlContent
      });
      
      msg = 'Price drop detected and email sent.';
    } else if (!data.status) {
      statusCode = 500;

      sendEmail({
        to: process.env.SELF_EMAIL_ADDRESS,
        subject: `[TO SELF: ERROR!] Something's wrong with ${BHA_PRODUCT_URL}`,
        html: `
        <div>
          <p>Cannot fetch data from ${BHA_PRODUCT_URL}. Please take a look.</p>
          <p>Error: ${data.error}</p>
        </div>
        `
      });

      msg = 'Error fetching product price.';
    }

    res.status(statusCode).send(msg);
  } catch (error) {
    res.status(500).send('Error executing: ' , error);
  }
});

export default router;