const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

describe("dummy", () => {
  test("dummy returns one", () => {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
  });
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  const blogs = [
    {
      title: "Blog A",
      author: "Author A",
      likes: 5,
    },
    {
      title: "Blog B",
      author: "Author B",
      likes: 10,
    },
    {
      title: "Blog C",
      author: "Author A",
      likes: 3,
    },
  ];

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("when list has multiple blogs, calculates total likes", () => {
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 18); // 5 + 10 + 3
  });
});

describe("favorite blog", () => {
  const blogs = [
    {
      title: "Blog A",
      author: "Author A",
      likes: 5,
    },
    {
      title: "Blog B",
      author: "Author B",
      likes: 10,
    },
    {
      title: "Blog C",
      author: "Author A",
      likes: 3,
    },
  ];

  test("finds the blog with the most likes", () => {
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: "Blog B",
      author: "Author B",
      likes: 10,
    });
  });
});

describe("most blogs", () => {
  const blogs = [
    {
      title: "Blog A",
      author: "Author A",
    },
    {
      title: "Blog B",
      author: "Author B",
    },
    {
      title: "Blog C",
      author: "Author A",
    },
  ];

  test("finds the author with the most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    assert.deepStrictEqual(result, {
      author: "Author A",
      blogs: 2,
    });
  });
});

describe("most likes", () => {
  const blogs = [
    {
      title: "Blog A",
      author: "Author A",
      likes: 5,
    },
    {
      title: "Blog B",
      author: "Author B",
      likes: 10,
    },
    {
      title: "Blog C",
      author: "Author A",
      likes: 3,
    },
  ];

  test("finds the author with the most likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Author A",
      likes: 8, // 5 + 3
    });
  });
});
