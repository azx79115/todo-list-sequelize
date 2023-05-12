// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
const db = require("../../models");
const Todo = db.Todo;
const User = db.User;

//首頁
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const todos = await Todo.findAll({
      raw: true,
      nest: true,
      where: { UserId: userId },
    });
    res.render("index", { todos });
  } catch (err) {
    console.error(err);
  }
});

// 匯出路由模組
module.exports = router;
