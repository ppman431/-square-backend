const express = require("express");
const cors = require("cors");
const { Client } = require("square");

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
  accessToken: process.env."EAAAl1X_HitPk0dIe4THfetBCVvB6z5d7iRy_XxQT4-wlWVca3YE0gbSc32uZ7bf",
  environment: "production"
});

const locationId = process.env."LYS2S6BQKW7A9";

app.post("/create-checkout", async (req, res) => {
  try {
    const cart = req.body.items || [];

    const lineItems = cart.map((item) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      basePriceMoney: {
        amount: item.price,
        currency: "USD"
      }
    }));

    const response = await client.checkoutApi.createPaymentLink({
      order: {
        locationId,
        lineItems
      }
    });

    res.json({
      checkoutUrl: response.result.paymentLink.url
    });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    res.status(500).json({
      error: "Checkout error",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});