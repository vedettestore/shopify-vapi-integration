const axios = require('axios');
const SHOPIFY_STORE_URL = 'https://f27807.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;

export default async function handler(req, res) {
  try {
    const { order_number, customer_email } = req.body;

    if (!order_number) {
      return res.status(400).json({ error: 'Missing order_number' });
    }

    const response = await axios.get(
      `${SHOPIFY_STORE_URL}/admin/api/2023-10/orders.json?name=${order_number}`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    const order = response.data.orders[0];

    if (!order) {
      return res.status(404).json({ result: "Order not found." });
    }

    return res.status(200).json({
      result: `Order ${order.name} is currently ${order.fulfillment_status || 'not fulfilled'} and ${order.financial_status}.`,
    });
  } catch (error) {
    console.error('❌ Error in check-order-status:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

