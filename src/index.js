const cors = require("cors");
const express = require("express");
const blogRouter = require("./routers/blog");
const userRouter = require("./routers/user");
const commentRouter = require("./routers/comment");
require("./db/mongoose");

const PORT = process.env.PORT;
const app = express();

app.use(cors({ origin: process.env.ORIGIN_URL }));

app.use(express.json());
app.use(blogRouter);
app.use(commentRouter);
app.use(userRouter);

app.listen(PORT, () => {
  console.log(`Server is up and running at Port ${PORT}`);
});
