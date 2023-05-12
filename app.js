const express = require("express");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const userPassport = require("./config/passport");
//flash
const flash = require("connect-flash");
const routes = require("./routes");
const app = express();
const PORT = 3000;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.engine("hbs", engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
userPassport(app);
//掛載flash
app.use(flash());
//設定本地變數res.locals
app.use((req, res, next) => {
  // console.log(req.user);
  res.locals.isAuthenticated = req.isAuthenticated;
  res.locals.user = req.user;
  res.locals.success_msg = req.flash("success_msg"); //設定 success_msg訊息
  res.locals.warning_msg = req.flash("warning_msg"); //設定 warning_msg訊息
  next();
});

// require("dotenv").config();

app.use(routes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
