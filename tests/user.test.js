const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { userOneId, userOne, setUpDatabase } = require("./fixtures/db");

// clear database before each test
beforeEach(setUpDatabase);

test("Should Sign up a new user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      username: "username",
      full_name: "full_name",
      email: "email@e.com",
      number: "08023361415",
      interests: [
        {
          interest: "one",
        },
      ],
      bio: "bio",
      twitter_link: "twitter_link",
      linkedIn_link: "twitter_link",
      facebook_link: "twitter_link",
      medium_link: "twitter_link",
      password: "password",
    })
    .expect(201);
  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assertion about the response
  expect(response.body).toMatchObject({
    user: {
      username: "username",
      full_name: "full_name",
      email: "email@e.com",
    },
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe("password");
});

test("Should log in existing User", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(response.body.user._id);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("Should not log in non-existing User", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "user@One.com",
      password: userOne.password,
    })
    .expect(400);
});

test("Should get profile for User", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should not get profile for Unauthenticated User", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("Should delete profile for User", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete profile for Unauthenticated User", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("Should update valid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ full_name: "Newt Godson" })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(response.body).toMatchObject({
    full_name: "Newt Godson",
  });
});

test("Should not update Invalid user fields", async () => {
  const response = await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ phot0: "Newt Godson" })
    .expect(400);
});
