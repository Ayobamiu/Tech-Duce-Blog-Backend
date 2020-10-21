const cors = require("cors");
const express = require("express");
const blogRouter = require("./routers/blog");
const userRouter = require("./routers/user");
const commentRouter = require("./routers/comment");
require("./db/mongoose");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use(blogRouter);
app.use(commentRouter);
app.use(userRouter);

app.listen(3001, () => {
  console.log("Server is up and running at Port 3001");
});
