module.exports = async (req, res) => {
  console.log("SHIPPO API HIT");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { address, city, postalCode, country } = req.body;

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
        country
      },
      parcels: [
        {
          length: "10",
          width: "10",
          height: "10",
          distance_unit: "cm",
          weight: "1",
          mass_unit: "kg"
        }
      ],
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

    const text = await response.text();
    console.log("RAW SHIPPO RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "Shippo returned non-JSON response",
        raw: text
      });
    }

    if (!data.rates || !data.rates.length) {
      return res.status(500).json({
        error: "No rates returned",
        raw: data
      });
    }

    const cheapest = data.rates.reduce((min, r) =>
      Number(r.amount) < Number(min.amount) ? r : min
    );

    return res.status(200).json({
      shippingCost: Number(cheapest.amount)
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      error: "Server crashed",
      details: err.message
    });
  }
};
