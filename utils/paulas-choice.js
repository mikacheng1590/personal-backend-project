import axios from 'axios';

export const BHA_USUAL_PRICE = 35;
export const BHA_PRODUCT_URL = 'https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html';

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

export default getPaulasProductPrice;