// 引用 Express 與 Express 路由器
const express = require("express");
const router = express.Router();
const db = require("../../models");
const Todo = db.Todo;

//new
router.get("/new", (req, res) => {
  return res.render("new");
});
//new todo
router.post("/new", (req, res) => {
  const UserId = req.user.id;
  const { name } = req.body;
  return Todo.create({ name, UserId })
    .then(() => res.redirect("/"))
    .catch((err) => console.error(err));
});
//detail
router.get("/:id", (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => res.render("detail", { todo: todo.toJSON() }))
    .catch((err) => console.log(err));
});
//edit
router.get("/:id/edit", (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => res.render("edit", { todo: todo.toJSON() }))
    .catch((err) => console.log(err));
});

//修改todo資料
router.put("/:id", (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  const { name, isDone } = req.body;
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => {
      todo.name = name;
      todo.isDone = isDone === "on";
      return todo.save();
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch((error) => console.log(error));
});

//刪除todo資料
router.delete("/:id", (req, res) => {
  const userId = req.user.id;
  const id = req.params.id;
  return Todo.findOne({ where: { id, userId } })
    .then((todo) => todo.destroy())
    .then(() => res.redirect("/"))
    .catch((error) => console.log(error));
});

module.exports = router;
