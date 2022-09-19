const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");


//  
exports.getLogin = (req, res) => {  // Get login page
  if (req.user) {  // check if already logged in
    return res.redirect("/profile");  // redirect to profile page
  }
  res.render("login", {  // render login page
    title: "Login",  // provide title for login page
  });
};

exports.postLogin = (req, res, next) => {  // Log request submitted
  const validationErrors = [];  // array to hold validation errors
  if (!validator.isEmail(req.body.email))  // check if valid email
    validationErrors.push({ msg: "Please enter a valid email address." });  // push error message to validationErrors array
  if (validator.isEmpty(req.body.password))  // check if valid password
    validationErrors.push({ msg: "Password cannot be blank." });  // push error message to validationErrors array

  if (validationErrors.length) {  // check if errors received
    req.flash("errors", validationErrors);  // push error messages to flash
    return res.redirect("/login");  // redirect to login page
  }
  req.body.email = validator.normalizeEmail(req.body.email, {  // perform email normalizaiton on email addresses
    gmail_remove_dots: false,  // do not remove dots from gmail addresses
  });

  passport.authenticate("local", (err, user, info) => {  // authenticate user using passport
    if (err) {  // check for errors
      return next(err);  // pass errors to next method
    }
    if (!user) {  // check if valid user
      req.flash("errors", info);  // flash errors if not valid user
      return res.redirect("/login");  // redirect to login
    }
    req.logIn(user, (err) => {  // login request
      if (err) {  // check if error
        return next(err);  // return error 
      }
      req.flash("success", { msg: "Success! You are logged in." });  // pass successful login message
      res.redirect(req.session.returnTo || "/profile");  // redirect to profile
    });
  })(req, res, next);
};

exports.logout = (req, res) => {  // log out user 
  req.logout(() => {  // use passport method to log out
    console.log('User has logged out.')  // log successful logout
  })
  req.session.destroy((err) => {  // destroy user's session in database
    if (err)  // check for error
      console.log("Error : Failed to destroy the session during logout.", err);  // log error
    req.user = null;  // remove user from client
    res.redirect("/");  // redirect to index
  });
};

exports.getSignup = (req, res) => {  // request signup page
  if (req.user) {  // check if already logged in
    return res.redirect("/profile");  // redirect to user profile
  }
  res.render("signup", {  // render signup page
    title: "Create Account",  // pass title to signup page
  });
};

exports.postSignup = (req, res, next) => {  // Signup request submitted
  const validationErrors = [];  // create array to hold validation errors
  if (!validator.isEmail(req.body.email))  // check fo valid email
    validationErrors.push({ msg: "Please enter a valid email address." });  // push error message to validationErrors
  if (!validator.isLength(req.body.password, { min: 8 }))  // check password is correct length
    validationErrors.push({
      msg: "Password must be at least 8 characters long",  // push error message to validationErrors
    });
  if (req.body.password !== req.body.confirmPassword)  // check if passwords match
    validationErrors.push({ msg: "Passwords do not match" });  // push error message to validationErrors

  if (validationErrors.length) {  // check if errors exist
    req.flash("errors", validationErrors);  // flash error messages
    return res.redirect("../signup");  // redirect to signup page
  }
  req.body.email = validator.normalizeEmail(req.body.email, {  // normalize email address
    gmail_remove_dots: false,  // do not remove dots from gmail 
  });

  const user = new User({  // create user using model
    userName: req.body.userName,  // set userName based on user input
    email: req.body.email,  // set email based on user input
    password: req.body.password,  // set password based on user input
  });

  User.findOne(  // check if user already exists
    { $or: [{ email: req.body.email }, { userName: req.body.userName }] },  // look for email or username in database
    (err, existingUser) => {  
      if (err) {  // check for error
        return next(err);  // return error
      }
      if (existingUser) {  // check if existing user
        req.flash("errors", {  // send error message
          msg: "Account with that email address or username already exists.",  // define error message
        });
        return res.redirect("../signup");  // redirect to signup page
      }
      user.save((err) => {  // save user if not existing
        if (err) {  // check if error
          return next(err);  // return error
        }
        req.logIn(user, (err) => {  // login user
          if (err) {  // check if error
            return next(err);  // return error
          }
          res.redirect("/profile");  // redirect to profile page
        });
      });
    }
  );
};
