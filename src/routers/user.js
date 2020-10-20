const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "username",
    "full_name",
    "email",
    "number",
    "bio",
    "interests",
    "twitter_link",
    "password",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send();
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    //remove user currently used token from user's token list
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    //remove all users tokens from user's token list
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});



module.exports = router;
