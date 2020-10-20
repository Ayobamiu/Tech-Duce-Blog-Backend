const express = require("express");
const Blog = require("../models/blog");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/blogs", auth, async (req, res) => {
  const blog = new Blog({ ...req.body, owner: req.user._id });
  try {
    await blog.populate("owner").execPopulate();
    await blog.save();
    res.status(201).send(blog);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.get("/blogs", async (req, res) => {
  const blogs = await Blog.find({});
  res.send(blogs);
});

router.get("/blogs/me", auth, async (req, res) => {
  const user = req.user;
  await user.populate("blogs").execPopulate();
  const blogs = user.blogs;
  res.send(blogs);
});

router.get("/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    await blog.populate("comments").execPopulate();
    const comments = blog.comments;
    ++blog.views;
    await blog.save();
    res.send({ blog, comments });
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.patch("/blogs/:id/addlike", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).send();
    }
    ++blog.likes;
    await blog.save();
    res.send(blog);
  } catch (error) {
    res.status(500).send();
  }
});
router.patch("/blogs/:id/removelike", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).send();
    }
    --blog.likes;
    await blog.save();
    res.send(blog);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/blogs/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "body", "category"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).send();
    }
    updates.forEach((update) => (blog[update] = req.body[update]));
    await blog.save();
    res.send(blog);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/blogs/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      res.status(404).send();
    }
    res.send(blog);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
