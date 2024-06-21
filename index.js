const express = require("express");
const cors = require("cors");
const User = require("./db/User");
require("./db/config");
const Product = require("./db/Product");
const jwt = require("jsonwebtoken");
const jwtKey = "e-com";
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3500;

//Sign up
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
    if (err) {
      res.send("Something went wrong");
    }
    res.send({ result, auth: token });
    res.send("login success");
  });
});

//login
app.post("/login", async (req, res) => {
  if (req.body.password && req.body.name) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      jwt.sign({ user }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send("Something went wrong");
        }
        res.send({ user, auth: token });
      });
    } else {
      res.send({ result: "No User found 1" });
    }
  } else {
    res.send({ result: "No User found 2" });
  }
});
//add product
app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
});

app.listen(PORT, () => {
  console.log("server is started");
});
