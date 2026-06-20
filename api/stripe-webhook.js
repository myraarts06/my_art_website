const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  try {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const md = session.metadata || {};

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: "myraarts06@gmail.com",
        subject: "New Paid Artwork Order",
        html: `
          <h2>New Paid Artwork Order</h2>

          <p><strong>Artwork Purchased:</strong> ${md.paintings}</p>
          <p><strong>Collector Name:</strong> ${md.collectorName}</p>
          <p><strong>Customer Email:</strong> ${md.email}</p>

          <h3>Shipping Address</h3>

          <p>
            ${md.fullName}<br>
            ${md.address1}<br>
            ${md.address2 || ""}<br>
            ${md.city}<br>
            ${md.state}<br>
            ${md.postal}<br>
            ${md.country}
          </p>

          <p><strong>Notes:</strong> ${md.notes || "-"}</p>

          <p><strong>Amount Paid:</strong>
            €${(session.amount_total / 100).toFixed(2)}
          </p>
        `
      });
    }

    res.status(200).json({ received: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
