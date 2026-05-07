export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const { country } = req.body || {};

  let shippingCost = 15;

  if (country === "Germany") {
    shippingCost = 6;
  }

  return res.status(200).json({
    shippingCost
  });
}
