// log in passport auth
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load user model
const User = require("../../models/User");

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users works" }));

// @route  POST api/users/register
// @desc   Register User
// @access Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Use mongoose to find if email exists (don't want someone to register w/ email already in db)
  // Pass in object to the method. Find email that matches req.body.email
  User.findOne({ email: req.body.email }).then(user => {
    // If a user w/ that email exists...
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      // Check for gravatar
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        default: "mm"
      });

      // Create new user variable
      const { name, email, password } = req.body;
      const newUser = new User({
        name,
        email,
        avatar,
        password
      });

      // Hash password, set user's password to hashed password, save newUser to db
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route  POST api/users/login
// @desc   Login user / returning jwt
// @access Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // user sends form w/ email & password (for some reason destructuring won't work here. password is 'undefined' in bcrypt when destructured)
  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // create jwt payload with user info we want to send
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        // Sign jwt
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            // send token as response
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;
    res.json({
      id,
      name,
      email
    });
  }
);

module.exports = router;
