module.exports = (req, res) => {

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.status(200).json({
    shippingCost: 15
  });

};
