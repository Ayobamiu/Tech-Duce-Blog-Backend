const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const Blog = require("../models/blog")

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowerCase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Invalid");
        }
      },
    },
    number: {
      type: String,
      validate(value) {
        if (!validator.isMobilePhone(value, "en-NG")) {
          throw new Error("Phone number is Invalid");
        }
      },
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    interests: [
      {
        interest: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    twitter_link: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("remove", async function (next) {
  const user = this;
  await Blog.deleteMany({ owner: user._id });
  next();
});

userSchema.virtual("blogs", {
  ref: "Blog",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismyjsonsignature");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  //check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  //compare if the password matches the password for the user
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
