const express = require("express");
const Comment = require("../models/comment");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/comments/:blogId", auth, async (req, res) => {
  const message = req.body.message;

  const comment = new Comment({
    message,
    owner: req.user._id,
    blog: req.params.blogId,
  });
  try {
    await comment.save();
    res.send(comment);
  } catch (error) {
    res.status(400).send();
  }
});

module.exports = router;
