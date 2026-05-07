module.exports = async (req, res) => {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    address,
    city,
    postalCode,
    country
  } = req.body;

  try {

    // 1. Create shipment object
    const shipment = {
      address_from: {
        name: "Myra Arts",
        street1: "Your Studio Address",
        city: "Your City",
        zip: "Your ZIP",
        country: "DE"
      },
      address_to: {
        name: "Customer",
        street1: address,
        city,
        zip: postalCode,
        country
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

    // 2. Call Shippo API
    const response = await fetch("https://api.goshippo.com/shipments/", {
      method: "POST",
      headers: {
        "Authorization": `ShippoToken YOUR_SHIPPO_API_KEY`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(shipment)
    });

    const data = await response.json();
    console.log(data);

    // 3. Get cheapest rate
    const rate = data.rates?.[0]?.amount || 15;

    return res.status(200).json({
      shippingCost: parseFloat(rate)
    });

  } catch (err) {
    return res.status(500).json({
      error: "Shippo failed",
      details: err.message
    });
  }
};
