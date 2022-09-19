const Comment = require("../models/Comment");

module.exports = {
  createComment: async (req, res) => {  // create a comment on a post
    try {

      await Comment.create({  // send request to model
        comment: req.body.comment,  // add comment from user input on page
        likes: 0,  // set default number of likes on the comment to 0
        user: req.user.id,  // set user that created comment to the user who sent the request
        userName: req.user.userName,  // set userName that created comment to the user that sent the request
        post: req.params.id,  // identify post where comment was made
      });
      console.log("Comment has been added!");  // log success message
      res.redirect("/post/"+req.params.id);  // redirect to post page with comment posted
    } catch (err) {
      console.log(err);
    }
  }
};
