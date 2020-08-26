"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('express'),
    Router = _require.Router;

var multer = require('multer');

var User = require('../model/users');

var Like = require('../model/likes');

var Notification = require('../model/notifications');

var Post = require('../model/posts');

var Comment = require('../model/comments');

var router = Router();
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}); //IMAGE UPLOAD

router.post('/uploadImage', upload.single('uploadImage'), function _callee(req, res, next) {
  var err, user, _err;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!req.isAuth) {
            err = new Error('Unauthorized!');
            next(err);
          }

          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(User.findById(req.user.userId));

        case 4:
          user = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(Comment.updateMany({
            userId: req.user.userId
          }, {
            $set: {
              imageUrl: req.file.path
            }
          }));

        case 7:
          req.user.imageUrl = req.file.path;

          if (!user) {
            _context.next = 17;
            break;
          }

          user.imageUrl = req.file.path;
          _context.next = 12;
          return regeneratorRuntime.awrap(user.save());

        case 12:
          _context.next = 14;
          return regeneratorRuntime.awrap(Notification.updateMany({
            senderId: req.user.userId
          }, {
            $set: {
              imageUrl: req.file.path
            }
          }));

        case 14:
          res.status(201).json({
            message: 'Image uploaded successfully.'
          });
          _context.next = 19;
          break;

        case 17:
          _err = new Error('User not found');
          res.status(404).json({
            message: _err.message
          });

        case 19:
          _context.next = 24;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](1);
          next(_context.t0);

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 21]]);
}); //GET USERS

router.get('/', function _callee2(req, res, next) {
  var err, userData, user, posts, likes, notif;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!req.isAuth) {
            err = new Error('Unauthorized!');
            res.status(401);
            next(err);
          }

          userData = {};
          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findById(req.user.userId));

        case 4:
          user = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Post.find({
            creator: user
          }, null, {
            sort: '-createdAt'
          }).populate('comments'));

        case 7:
          posts = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(Like.find({
            user: req.user.userId
          }));

        case 10:
          likes = _context2.sent;
          _context2.next = 13;
          return regeneratorRuntime.awrap(Notification.find({
            userId: req.user.userId
          }));

        case 13:
          notif = _context2.sent;

          if (user) {
            userData.credentials = _objectSpread({}, user._doc, {
              password: null,
              posts: posts
            });

            if (likes) {
              userData.likes = [];
              likes.forEach(function (doc) {
                userData.likes.push(doc);
              });
            }

            if (notif) {
              userData.notifications = [];
              notif.forEach(function (doc) {
                userData.notifications.push(doc);
              });
            }

            res.status(200).json(userData);
          } else {
            res.status(404);
            next();
          }

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
}); //GET USER

router.get('/:userId', function _callee3(req, res, next) {
  var user, post, userData;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.userId));

        case 3:
          user = _context3.sent;
          _context3.next = 6;
          return regeneratorRuntime.awrap(Post.find({
            creator: req.params.userId
          }).sort('-createdAt').populate('comments').sort('-createdAt'));

        case 6:
          post = _context3.sent;
          userData = {};

          if (user) {
            userData = user;

            if (post) {
              userData.posts = [];
              post.forEach(function (doc) {
                userData.posts.push(doc);
              });
            }

            res.status(200).json(_objectSpread({}, userData._doc, {
              password: null
            }));
          } else {
            res.status(404);
            next();
          }

          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          res.status(500);
          next(_context3.t0);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
});
router.get('/notification', function _callee4(req, res, next) {
  var err;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!req.isAuth) {
            err = new Error('Unauthorized!');
            next(err);
          }

          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Notification.updateMany({
            recipient: req.user.userId
          }, {
            $set: {
              read: true
            }
          }).limit(10));

        case 4:
          res.status(200).json({
            message: 'Notifications marked read'
          });
          _context4.next = 11;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](1);
          res.status(500);
          next(_context4.t0);

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 7]]);
});
router.post('/notifications', function _callee5(req, res, next) {
  var err;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (!req.isAuth) {
            err = new Error('Unauthenticated!');
            res.status(401);
            next(err);
          }

          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Notification.updateMany({
            userId: req.body.userId
          }, {
            read: true
          }));

        case 4:
          res.json({
            message: "Marked notifications read"
          });
          _context5.next = 11;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](1);
          res.status(500);
          next(_context5.t0);

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 7]]);
});
module.exports = router;