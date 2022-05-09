const express = require("express");
const path = require("path");
const engine = require("ejs-mate");
const app = express();
const bcrypt = require("bcrypt");
const { User } = require("./UserModel");
const session = require("express-session");
const { unwatchFile } = require("fs");

// app use
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../templates/views"));
require("./dbconfig").connect();
app.use(
  session({
    secret: "kalit so'z bor",
    resave: false,
    saveUninitialized: false,
  })
);

// middleware

const checkLogin = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect("/");
  }
  next();
};

// routes
app.get("/", (req, res) => {
  return res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { full_name, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 12);
  const user = new User({
    full_name,
    email,
    password: hashPassword,
  });

  await user.save();

  req.session.user_id = user._id;

  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  // TODO: profilga kirish kodini yozishimiz kerak
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(404).send({ error: "Bunday foydalanuvchi topilmadi" });
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    return res.status(400).send({ error: "Parol xato" });
  }

  req.session.user_id = user._id;

  res.redirect("/secret");
});

app.get("/secret", checkLogin, async (req, res) => {
  const userData = await User.findByPk(req.session.user_id);
  res.render("secret", { userData });
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(8001, () => {
  console.log(`Port raqami 3001`);
});
