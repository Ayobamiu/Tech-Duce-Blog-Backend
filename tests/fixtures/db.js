const User = require("../../src/models/user");
const Blog = require("../../src/models/blog");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
  username: "username",
  full_name: "full_name",
  email: "user@test.com",
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
};
const userTwoId = new mongoose.Types.ObjectId();

const userTwo = {
  _id: userTwoId,
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
  username: "username",
  full_name: "full_name",
  email: "user2@test.com",
  number: "08023361415",
  interests: [
    {
      interest: "two",
    },
  ],
  bio: "bio",
  twitter_link: "twitter_link",
  linkedIn_link: "twitter_link",
  facebook_link: "twitter_link",
  medium_link: "twitter_link",
  password: "password",
};

const blogOne = {
  _id: new mongoose.Types.ObjectId(),
  title: "Testing title One",
  body: "Body of the blog for test one",
  category: "category",
  owner: userOneId,
};

const blogTwo = {
  _id: new mongoose.Types.ObjectId(),
  title: "Testing title Two",
  body: "Body of the blog for test Two",
  category: "category",
  owner: userTwoId,
};

const blogThree = {
  _id: new mongoose.Types.ObjectId(),
  title: "Testing title Three",
  body: "Body of the blog for test Three",
  category: "category",
  owner: userTwoId,
};

const setUpDatabase = async () => {
  await User.deleteMany();
  await Blog.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Blog(blogOne).save();
  await new Blog(blogTwo).save();
  await new Blog(blogThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwo,
  userTwoId,
  blogOne,
  blogTwo,
  blogThree,
  setUpDatabase,
};
