const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Shopify connection works!' });
});

app.post('/api/check-order-status', async (req, res) => {
  const { name, parameters } = req.body;

  if (name === 'check_order_status') {
    const { order_number } = parameters;

    try {
      const response = await axios.get(
        `${process.env.SHOPIFY_STORE_URL}/admin/api/2023-10/orders.json?name=${order_number}`,
        {
          headers: {
            'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );

      const order = response.data.orders[0];

      if (!order) {
        return res.status(200).json({
          result: "We couldn't find an order with that number. Please double-check and try again.",
        });
      }

      const status = order.fulfillment_status || 'Unfulfilled';
      const tracking = order.fulfillments?.[0]?.tracking_numbers?.[0] || 'No tracking available';

      return res.status(200).json({
        result: `Order ${order.name} is currently ${status}. Tracking number: ${tracking}`,
      });
    } catch (error) {
      return res.status(500).json({ result: 'Something went wrong.' });
    }
  } else {
    res.status(404).json({ result: 'Function not found.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
