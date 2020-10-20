const express = require("express");
const blogRouter = require("./routers/blog");
const userRouter = require("./routers/user");
const User = require("./models/user");
const Blog = require("./models/blog");
require("./db/mongoose");

const app = express();

app.use(express.json());
app.use(blogRouter);
app.use(userRouter);

app.listen(3001, () => {
  console.log("Server is up and running at Port 3001");
});
