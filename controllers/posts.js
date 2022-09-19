const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {  // Profile page is requested
    try {
      const posts = await Post.find({ user: req.user.id });  // find posts made by user
      res.render("profile.ejs", { posts: posts, user: req.user });  // render user profile page including posts made by user
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {  // Feed page is requested
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();  // find all posts by all users sorted in descending order by creation date
      res.render("feed.ejs", { posts: posts });  // render feed with posts from database
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {  // Single post page is requested
    try {
      const post = await Post.findById(req.params.id);  // search database for post ID of post clicked on by user
      const comments = await Comment.find( {post: req.params.id} ).sort({ createdAt: "desc" }).lean()  // find comments in database for post requested above
      res.render("post.ejs", { post: post, comments: comments, user: req.user });  // render page of single post with comments
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {  //  Creating a post and adding to database
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({  // creating a Post using the model
        title: req.body.title,  // setting title as title from user request
        image: result.secure_url,  // log url for image after uploaded to cloudinary
        cloudinaryId: result.public_id,  // requesting cloudinary ID
        caption: req.body.caption,  // setting caption as caption from user request
        likes: 0,  // setting number of likes for post to the default of 0
        user: req.user.id,  // set user tied to post based on user that made ther equest
      });
      console.log("Post has been added!");  // loggging successful status
      res.redirect("/profile");  // redirect user to their profile page
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {  // Liking a post
    try {
      await Post.findOneAndUpdate(  // find the post in the database that matches that from the request
        { _id: req.params.id },  // sending ID of post to increase likes
        {
          $inc: { likes: 1 },  // increment the like count by 1
        }
      );
      console.log("Likes +1");  // logging success message
      res.redirect(`/post/${req.params.id}`);  // redirect to post showing updated number of likes
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {  // Deleting a post
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");  // log successful deletion
      res.redirect("/profile");  // redirect to profile page
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
