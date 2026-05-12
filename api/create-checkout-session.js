const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cart } = req.body;

    const line_items = cart.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          images: [item.img],
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",

      success_url: "https://your-domain.vercel.app/success.html",
      cancel_url: "https://your-domain.vercel.app/cancel.html",
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Payment failed" });
  }
};
