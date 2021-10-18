const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51Jg2rkSGwd9scym94jEPq2oqwtjBgQEWCIg0QoaHhPnV2QG5rPHYQFcuhRBJBO1STLZ0aEeubhn2FiwP3nl7WoKu00ZpOsQEwe"
);
const uuid = require("uuid").v4;

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("IT WORKS!");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("PRODUCT", product);
  console.log("PRICE", product.price);
  const idempontencyKey = uuid();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `purchase of ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              country: token.card.address_country,
            },
          },
        },
        { idempontencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

// listen
app.listen(8282, () => console.log("LISTENING AT PORT 8282"));
