const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY || "");
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items, successUrl, cancelUrl } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "No items provided" });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          description: `${item.subtitle} — MP3 Digital Download`,
          images: item.coverUrl ? [item.coverUrl] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl || "https://hemisync.org/?checkout=success&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl || "https://hemisync.org/?checkout=cancelled",
      metadata: {
        productIds: items.map((i) => i.id).join(","),
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/checkout-session/:sessionId", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({
      status: session.payment_status,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      productIds: session.metadata?.productIds?.split(",") || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
const sslOpts = {
  key: fs.readFileSync("/opt/hemisync-org/certs/key.pem"),
  cert: fs.readFileSync("/opt/hemisync-org/certs/cert.pem"),
};

https.createServer(sslOpts, app).listen(PORT, "0.0.0.0", () => {
  console.log(`Stripe API server running on HTTPS port ${PORT}`);
});
