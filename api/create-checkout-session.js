const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const BASE_URL = "https://myra-arts.vercel.app";

    const line_items = cart.map(item => {
      const vatRate = item.type === "original" ? 0.07 : 0.19;
      const finalPrice = Number(item.price) * (1 + vatRate);

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,

            // ✅ SAFE FIX (optional but important)
            images: item.img
              ? [`${BASE_URL}/${item.img}`]
              : [],
          },
          unit_amount: Math.round(finalPrice * 100),
        },
        quantity: 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,

      success_url: `${BASE_URL}/success.html`,
      cancel_url: `${BASE_URL}/cancel.html`,
    });

    return res.json({ url: session.url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
