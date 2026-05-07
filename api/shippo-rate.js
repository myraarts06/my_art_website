module.exports = async (req, res) => {
  console.log("SHIPPO API HIT");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { address, city, postalCode, country } = req.body;

  try {

   const COUNTRY_MAP = {
  germany: "DE",
  india: "IN",
  france: "FR",
  spain: "ES",
  "united states": "US",
  usa: "US",
  uk: "GB"
};

const normalizedCountry =
  COUNTRY_MAP[(country || "").toLowerCase()] || country.toUpperCase();

const shipment = {
  address_from: {
    name: "Myra Arts",
    street1: "Moerfelder Landstrasse 200",
    city: "Frankfurt am Main",
    zip: "60598",
    country: "DE"
  },
  address_to: {
    name: "Customer",
    street1: address,
    city,
    zip: postalCode,
    country: normalizedCountry
  },
  parcels: [{
    length: "10",
    width: "10",
    height: "10",
    distance_unit: "cm",
    weight: "1",
    mass_unit: "kg"
  }],
  async: false
};

    const response = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        "Authorization": "ShippoToken shippo_test_3e98650968e74cdf15bba601b7b9c35ec061a3d0",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(shipment)
    });
    
    let data;

try {
  data = await response.json();
} catch (e) {
  console.error("Shippo invalid response");
  return res.status(500).json({
    error: "Shippo returned invalid response"
  });
}

console.log("SHIPPO RESPONSE:", JSON.stringify(data, null, 2));

const rates = data.rates || [];

if (!rates.length) {
  return res.status(400).json({
    error: "No shipping rates returned",
    raw: data
  });
}

const cheapestRate = rates.reduce((min, r) =>
  Number(r.amount || 9999) < Number(min.amount || 9999) ? r : min
);

return res.status(200).json({
  shippingCost: Number(cheapestRate.amount || 15)
});
