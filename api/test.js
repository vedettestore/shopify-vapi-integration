// api/test.js
export default function handler(req, res) {
  res.status(200).json({ success: true, message: 'Shopify connection works!' });
}
