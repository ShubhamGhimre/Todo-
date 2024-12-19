const express = require("express");
const jwt = require("jsonwebtoken");
const Todo = require("../models/Todo");

const router = express.Router();

const authMiddleware = async (req, res, next) => {
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// Get Todos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const Todo = req.dbConnection.model(
      "Todo",
      require("../models/Todo").schema
    );
    const todos = await Todo.find({ userId: req.userId });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Todos" });
  }
});

// Add Todo
router.post("/", authMiddleware, async (req, res) => {
  try {
    const Todo = req.dbConnection.model(
      "Todo",
      require("../models/Todo").schema
    );
    const todo = new Todo({
      task: req.body.task,
      description: req.body.description,
      status: req.body.status,
      userId: req.userId,
    });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create Todo" });
  }
});
// get a specific todo
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const Todo = req.dbConnection.model(
      "Todo",
      require("../models/Todo").schema
    );
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Todo" });
  }
})

// Update Todo
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const Todo = req.dbConnection.model(
      "Todo",
      require("../models/Todo").schema
    );
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update Todo" });
  }
});

// Delete Todo
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const Todo = req.dbConnection.model(
      "Todo",
      require("../models/Todo").schema
    );
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Todo" });
  }
});

// change status
router.patch("/:id/status", authMiddleware, async (req, res) => {
  try {
    const Todo = req.dbConnection.model(
      "Todo",
      require("../models/Todo").schema
    );
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: { status: req.body.status } },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update Todo status" });
  }
});

module.exports = router;
