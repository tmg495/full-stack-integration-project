const { JsonWebTokenError } = require("jsonwebtoken");
const Category = require("../models/Category");
const Post = require("../models/Posts");

const {
    createOrGetTags,
    createOrGetCategories,
    getPosts,
    getPostById,
    createPost,
    updatePost
} = require("../controllers/postController")

jest.mock("../models/Category");
jest.mock("../models/Posts");

describe("Post Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPosts", () => {
    it("should return all posts", async () => {
      const mockPost = {
          title: "Chronicle of a Death Foretold", // Post title
          content: "Magic realism or something.", // Post content
          author: "Gabriel Garcia Marquez" // Only store userId
        };
      const mergedMock = {...mockPost, skip: jest.fn().mockReturnThis()}
      Post.find.mockResolvedValue(mergedMock);

      const req = {query: {}};
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      await getPosts(req, res);

      expect(Post.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockPost);
    });
  });
});