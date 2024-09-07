const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("./models/user");

const PORT = 3000;
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

// eslint-disable-next-line consistent-return
app.post("/register", async (req, res) => {
  const { name, username, email, age, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) return res.send("user is already resgisterd");

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, async (err, hash) => {
      const newUser = await userModel.create({
        name,
        username,
        email,
        age,
        password: hash,
      });
      // eslint-disable-next-line no-underscore-dangle
      const token = jwt.sign({ email, userId: newUser._id }, "secret");
      res.cookie("token", token);
      res.send("User is Registered");
    });
  });
});

// server listen
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
