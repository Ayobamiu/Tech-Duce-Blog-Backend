const express = require("express");
const User = require("../models/user");
const auth = require("../middlewares/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  resetPasswordMessage,
  sendCancellationMessage,
  sendWelcomeMessage,
} = require("../emails/emails");

const router = express.Router();

router.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(400).send("Email already registered!");
    }
    const token = await user.generateAuthToken();
    await user.save();
    sendWelcomeMessage(user.email, user.username);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(404).send(error);
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
    sendCancellationMessage(req.user.email, req.user.username);
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
    if(!user){
      res.status(404).send("Credential is not a match")
    }
    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error.message);
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

router.post("/users/start-reset-password", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Email not registered." });
    }
    const token = jwt.sign(
      { _id: user._id.toString(), email },
      "thisismyjsonsignature"
    );
    resetPasswordMessage(email, token);
    res.send(token);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch("/users/reset-password/:token", async (req, res) => {
  const token = req.params.token;
  const decoded = jwt.verify(token, "thisismyjsonsignature");
  const userId = decoded._id;
  const userEmail = decoded.email;
  const password_one = req.body.password_one;
  const password_two = req.body.password_two;
  if (password_one !== password_two) {
    return res.status(400).send({ error: "Passwords are not a match." });
  }
  try {
    const user = await User.findOne({ _id: userId, email: userEmail });
    if (!user) {
      return res.status(400).send({ error: "Email not registered." });
    }
    user.password = password_one;
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
