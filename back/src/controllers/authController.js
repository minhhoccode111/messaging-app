// no need for try...catch block
const asyncHandler = require("express-async-handler");

// sanitize and validate data
const { body, validationResult } = require("express-validator");

// mongoose models
const User = require("./../models/user");

// debug
const debug = require("debug")(
  "xxxxxxxxxxxxxxxxxxxx-debug-xxxxxxxxxxxxxxxxxxxx",
);

// bcrypt to secure password
const bcrypt = require("bcrypt");

// will be call jwt.sign() to create a object, and secret and option like algorithm and time expire
const jwt = require("jsonwebtoken");

// work with date and time
const { formatDate } = require("./../methods");

module.exports.login_post = [
  body("username").trim().escape(),
  body("password").trim().escape(),
  asyncHandler(async (req, res) => {
    // extract data from form
    const { username, password } = req.body;

    // check username existed
    const user = await User.findOne({ username }, "-__v").exec();

    if (user === null) {
      return res.status(400).json({ message: "Wrong username" });
    } else {
      // check password match
      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return res.status(400).json({ message: "Wrong password" });
      }

      const expiresIn = 60 * 60 * 24 * 7; // 7 days

      // * 1000 for milliseconds
      const expiresInDate = new Date(Date.now() + expiresIn * 1000);

      const expiresInDateFormatted = formatDate(expiresInDate);

      // valid username and password
      // token is created using username only
      const token = jwt.sign({ username }, process.env.SECRET, { expiresIn });

      debug(`the user found in database belike: `, user);
      debug(`expire time belike: `, 60 * 60 * 24 * 7, ` seconds`);
      debug(`expire time formatted belike: `, expiresInDateFormatted);

      // remove password and username
      const userInfo = user.toJSON();
      delete userInfo.password;
      delete userInfo.username;

      // return info for client to store on their localStorage and check of expire
      return res.status(200).json({
        token,
        expiresIn,
        expiresInDate,
        isLogin: true,
        self: userInfo,
        expiresInDateFormatted,
      });
    }
  }),
];

module.exports.signup_post = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage(`Fullname cannot be empty.`)
    .isLength({ max: 50 })
    .withMessage(`Fullname must be between 1 and 50 characters`)
    .escape(),
  body("username")
    .trim()
    .isLength({ min: 8 })
    .withMessage(`Username must be at least 8 characters.`)
    .isEmail()
    .withMessage(`Username must be a valid email address.`)
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage(`Password must be between 8 and 32 characters.`)
    .isStrongPassword()
    .withMessage(
      `Password must contain at least: 1 uppercase, 1 lowercase, 1 number, 1 special character.`,
    )
    .escape(),
  body("confirm-password", `Confirm password does not match.`).custom(
    (value, { req }) => req.body.password === value,
  ),

  asyncHandler(async (req, res) => {
    let errors = validationResult(req).array();

    const checkExistedUsername = await User.findOne(
      { username: req.body.username },
      "username",
    ).exec();

    // destruct to send back when needed
    const { fullname, username, password } = req.body;

    const user = {
      fullname,
      username,
    };

    // check existence of username
    if (checkExistedUsername !== null) {
      errors.push({
        msg: `Username is already existed.`,
        type: "field",
        value: username,
        path: "username",
        location: "body",
      });
    }

    debug(`The error result is: `, errors);

    // data valid
    if (errors.length === 0) {
      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.SECRET),
      ); // encode password

      await new User({
        ...user,
        password: hashedPassword,
        isCreator: false,
      }).save();

      return res.status(200).json({
        message: `Success`,
        user,
      });
    }

    // data invalid
    return res.status(400).json({
      message: `Data invalid`,
      errors,
      user,
    });
  }),
];
