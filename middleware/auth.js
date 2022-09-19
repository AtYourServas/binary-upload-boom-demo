module.exports = {
  ensureAuth: function (req, res, next) {  // check if authorized user
    if (req.isAuthenticated()) {  // check if authorized user
      return next();  // move to next function
    } else {
      res.redirect("/");  // redirect to index
    }
  },
  ensureGuest: function (req, res, next) {  // check if not a user
    if (!req.isAuthenticated()) {  // check if not a user
      return next();  // return next
    } else {  
      res.redirect("/dashboard");  // redirect to dashboard
    }
  },
};
