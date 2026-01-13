// const { JsonWebTokenError } = require("jsonwebtoken");
// const Category = require("../models/Category");
// const Post = require("../models/Posts");
// require('sinon')
// require('sinon-mongoose')

// const {
//     createOrGetTags,
//     createOrGetCategories,
//     getPosts,
//     getPostById,
//     createPost,
//     updatePost
// } = require("../controllers/postController")

// jest.mock("../models/Category");
// jest.mock("../models/Posts");

// describe("Post Controller", () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getPosts", () => {
//     it.only("should return all posts", async () => {
//       const mockPosts = [{
//           title: "Chronicle of a Death Foretold", // Post title
//           content: "Magic realism or something.", // Post content
//           author: "Gabriel Garcia Marquez" // Only store userId
//         }];
//       const mergedMock = {mockPosts, 
//         skip: jest.fn().mockReturnThis(),
//         limit: jest.fn().mockReturnThis(),
//         populate: jest.fn().mockImplementationOnce(cb => mockPosts)
//       }
//       Post.find.mockResolvedValue(mergedMock);
//       Post.countDocuments.mockResolvedValue(1);

//       const req = {query: {}};
//       const res = {
//         json: jest.fn(),
//         status: jest.fn().mockReturnThis(),
//       };

//       await getPosts(req, res);

//       expect(Post.find).toHaveBeenCalled();
//       expect(res.json).toHaveBeenCalledWith({posts: mockPosts, currentPage: 1, totalPages: 1});
//     });
//   });
// });