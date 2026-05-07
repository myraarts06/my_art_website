module.exports = async (req, res) => {
  const { country, weight } = req.body;

  const EU = ["FR","IT","ES","NL","BE","PL","AT","SE","DK"];

  let zone = "ROW";
  if (country === "DE") zone = "DE";
  else if (EU.includes(country)) zone = "EU";

  const rates = {
    DE: 6,
    EU: 18,
    ROW: 45
  };

  const cost = rates[zone] + (weight * 2); // optional weight scaling

  return res.status(200).json({
    shippingCost: cost
  });
};
