const request = require("supertest");
const app = require("../src/app");
const Blog = require("../src/models/blog");

const {
  userOneId,
  userOne,
  userTwo,
  userTwoId,
  blogOne,
  blogTwo,
  blogThree,
  setUpDatabase,
} = require("./fixtures/db");

// clear database before each test
beforeEach(setUpDatabase);

test("Should create Blog for user", async () => {
  const response = await request(app)
    .post("/blogs")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      title: "Testing title on",
      body: "Body of the blog for test",
      category: "category",
      owner: userOneId,
    })
    .expect(201);

  const blog = await Blog.findById(response.body._id);
  expect(blog).not.toBeNull();
});

test("Should return only users blogs", async () => {
  const response = await request(app)
    .get("/blogs/me")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test("User can delete thier blog", async () => {
  const response = await request(app)
    .delete(`/blogs/${blogOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("User can't delete others' blog", async () => {
  const response = await request(app)
    .delete(`/blogs/${blogOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
});
