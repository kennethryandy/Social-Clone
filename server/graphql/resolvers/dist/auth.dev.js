"use strict";

var _this = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = require('../../model/users');

var Notification = require('../../model/notifications');

var Likes = require('../../model/likes');

var bcrypt = require('bcryptjs');

var JWT = require('jsonwebtoken');

var merge = require('./merge');

var _require = require('../../util/validators'),
    signupValidators = _require.signupValidators;

module.exports = {
  users: function users() {
    var users;
    return regeneratorRuntime.async(function users$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(User.find().populate('posts'));

          case 2:
            users = _context.sent;
            return _context.abrupt("return", users.map(function (user) {
              return _objectSpread({}, user._doc, {
                posts: merge.populatePost.bind(_this, user.posts)
              });
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  signup: function signup(_ref) {
    var userInput, username, email, password, _signupValidators$val, error, existingUser, hashedPw, newUser, result, token;

    return regeneratorRuntime.async(function signup$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userInput = _ref.userInput;
            username = userInput.username, email = userInput.email, password = userInput.password;
            _signupValidators$val = signupValidators.validate(userInput), error = _signupValidators$val.error;

            if (!error) {
              _context2.next = 9;
              break;
            }

            if (!(error.message === "\"email\" must be a valid email")) {
              _context2.next = 6;
              break;
            }

            throw new Error("Invalid email address");

          case 6:
            if (!(error.message === "\"username\" is not allowed to be empty" || error.message === "\"email\" is not allowed to be empty" || error.message === "\"password\" is not allowed to be empty")) {
              _context2.next = 8;
              break;
            }

            throw new Error('Email, username and password must not be empty');

          case 8:
            throw error;

          case 9:
            _context2.next = 11;
            return regeneratorRuntime.awrap(User.findOne({
              email: email
            }));

          case 11:
            existingUser = _context2.sent;

            if (!existingUser) {
              _context2.next = 16;
              break;
            }

            throw new Error('Email already taken.');

          case 16:
            _context2.next = 18;
            return regeneratorRuntime.awrap(bcrypt.hash(password, 12));

          case 18:
            hashedPw = _context2.sent;
            newUser = new User({
              username: username,
              email: email,
              password: hashedPw
            });
            _context2.prev = 20;
            _context2.next = 23;
            return regeneratorRuntime.awrap(newUser.save());

          case 23:
            result = _context2.sent;
            // const token = JWT.sign({userId: user._id, email: user.email, username: user.username, imageUrl: user.imageUrl}, process.env.TOKEN_SECRET,{expiresIn: '1h'});
            token = signToken(result._id, result.email, result.username, result.imageUrl);
            return _context2.abrupt("return", {
              userId: result._id,
              token: token,
              tokenExp: 4
            });

          case 28:
            _context2.prev = 28;
            _context2.t0 = _context2["catch"](20);
            throw _context2.t0;

          case 31:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[20, 28]]);
  },
  editUserDetails: function editUserDetails(_ref2, req) {
    var userDetails, bio, location, status, user;
    return regeneratorRuntime.async(function editUserDetails$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userDetails = _ref2.userDetails;
            bio = userDetails.bio, location = userDetails.location, status = userDetails.status;

            if (!(bio.trim() && location.trim() && status.trim() === '')) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt("return");

          case 4:
            if (req.isAuth) {
              _context3.next = 6;
              break;
            }

            throw new Error("Unauthorized!");

          case 6:
            _context3.next = 8;
            return regeneratorRuntime.awrap(User.findById(req.user.userId));

          case 8:
            user = _context3.sent;
            _context3.prev = 9;

            if (!user) {
              _context3.next = 19;
              break;
            }

            if (bio.trim() !== '') user.bio = bio;
            if (location.trim() !== '') user.location = location;
            if (status.trim() !== '') user.status = status;
            _context3.next = 16;
            return regeneratorRuntime.awrap(user.save());

          case 16:
            return _context3.abrupt("return", _context3.sent);

          case 19:
            throw new Error("User not found");

          case 20:
            _context3.next = 25;
            break;

          case 22:
            _context3.prev = 22;
            _context3.t0 = _context3["catch"](9);
            throw _context3.t0;

          case 25:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[9, 22]]);
  },
  login: function login(_ref3) {
    var email, password, user, comparedPw, token;
    return regeneratorRuntime.async(function login$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            email = _ref3.email, password = _ref3.password;
            _context4.prev = 1;
            _context4.next = 4;
            return regeneratorRuntime.awrap(User.findOne({
              email: email
            }));

          case 4:
            user = _context4.sent;

            if (user) {
              _context4.next = 7;
              break;
            }

            throw new Error('Wrong email or password.');

          case 7:
            _context4.next = 9;
            return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

          case 9:
            comparedPw = _context4.sent;

            if (comparedPw) {
              _context4.next = 12;
              break;
            }

            throw new Error('Wrong email or password.');

          case 12:
            // const token = JWT.sign({userId: user._id, email: user.email, username: user.username, imageUrl: user.imageUrl}, process.env.TOKEN_SECRET,{expiresIn: '1h'});
            token = signToken(user._id, user.email, user.username, user.imageUrl);
            return _context4.abrupt("return", {
              userId: user._id,
              username: user.username,
              token: token,
              tokenExp: 4
            });

          case 16:
            _context4.prev = 16;
            _context4.t0 = _context4["catch"](1);
            throw _context4.t0;

          case 19:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[1, 16]]);
  }
};

var signToken = function signToken(userId, email, username, imageUrl) {
  return JWT.sign({
    userId: userId,
    email: email,
    username: username,
    imageUrl: imageUrl
  }, process.env.TOKEN_SECRET, {
    expiresIn: '4h'
  });
};