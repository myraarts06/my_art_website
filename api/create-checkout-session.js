const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cart, shippingInfo } = req.body;

    const line_items = cart.map(item => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: 1
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: "https://your-site.com/success.html",
      cancel_url: "https://your-site.com/cancel.html",
      metadata: {
        shipping: JSON.stringify(shippingInfo)
      }
    });

    res.json({ url: session.url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
