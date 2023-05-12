const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require("../../models");
const User = db.User;

// 登入首頁
router.get("/login", (req, res) => {
  res.render("login");
});

//接收登入表單
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

//註冊頁面
router.get("/register", (req, res) => {
  res.render("register");
});

// 接受註冊表單
router.post("/register", (req, res) => {
  //取得表單參數
  const { name, email, password, confirmPassword } = req.body;
  // 錯誤訊息
  const errors = [];
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "所有欄位都是必填" });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "密碼與確認密碼不相符" });
  }
  if (errors.length) {
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }
  //檢查使用者是否已經註冊
  User.findOne({ where: { email } }).then((user) => {
    //如果已經註冊，退回註冊畫面
    if (user) {
      errors.push({ message: "這個 Email 已經註冊過了。" });
      return res.render("register", {
        errors,
        name,
        email,
        password,
        confirmPassword,
      });
    }
    //如果未註冊，寫入資料庫
    return bcrypt
      .genSalt(10) //產生鹽，並設定複雜度係數為10
      .then((salt) => bcrypt.hash(password, salt)) //為使用者密碼加鹽，產生雜湊值
      .then((hash) =>
        User.create({
          name,
          email,
          password: hash, //用雜湊值取代原本的使用者密碼
        })
      )
      .then(() => res.redirect("/"))
      .catch((err) => console.log(err));
  });
});

//登出
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  req.flash("success_msg", "您已經成功登出");
  res.redirect("/users/login");
});

module.exports = router;
