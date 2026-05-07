export default function handler(req, res) {
  const { country } = req.body || {};

  let shippingCost = 15;

  if (country === "Germany") {
    shippingCost = 6;
  }

  res.status(200).json({
    shippingCost
  });
}
