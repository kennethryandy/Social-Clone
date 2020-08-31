"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('express'),
    Router = _require.Router;

var path = require('path');

var multer = require('multer');

var crypto = require('crypto');

var mongoose = require('mongoose');

var User = require('../model/users');

var GridFsStorage = require('multer-gridfs-storage');

var Like = require('../model/likes');

var Notification = require('../model/notifications');

var Post = require('../model/posts');

var Comment = require('../model/comments');

var merge = require('../graphql/resolvers/merge');

var _require2 = require('../helpers/toDateString'),
    toDateString = _require2.toDateString;

var router = Router();
var conn = mongoose.connection;
var gfs;
var storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: function file(req, _file) {
    return new Promise(function (resolve, reject) {
      crypto.randomBytes(16, function (err, buf) {
        if (err) {
          return reject(err);
        }

        var filename = buf.toString('hex') + path.extname(_file.originalname);
        var fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
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
});
conn.once('open', function () {
  // Init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  }); //Upload Image Profile Image

  router.post('/uploadImage', upload.single('uploadImage'), function _callee(req, res) {
    var err, user, _err;

    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (req.isAuth) {
              _context.next = 3;
              break;
            }

            err = new Error('Unauthorized!');
            return _context.abrupt("return", next(err));

          case 3:
            _context.prev = 3;
            _context.next = 6;
            return regeneratorRuntime.awrap(User.findById(req.user.userId));

          case 6:
            user = _context.sent;
            _context.next = 9;
            return regeneratorRuntime.awrap(Comment.updateMany({
              userId: req.user.userId
            }, {
              $set: {
                imageUrl: req.file.filename
              }
            }));

          case 9:
            req.user.imageUrl = req.file.filename;

            if (!user) {
              _context.next = 19;
              break;
            }

            user.imageUrl = req.file.filename;
            _context.next = 14;
            return regeneratorRuntime.awrap(user.save());

          case 14:
            _context.next = 16;
            return regeneratorRuntime.awrap(Notification.updateMany({
              senderId: req.user.userId
            }, {
              $set: {
                imageUrl: req.file.filename
              }
            }));

          case 16:
            res.status(201).json({
              message: 'Image uploaded successfully.'
            });
            _context.next = 21;
            break;

          case 19:
            _err = new Error('User not found');
            res.status(404).json({
              message: _err.message
            });

          case 21:
            _context.next = 26;
            break;

          case 23:
            _context.prev = 23;
            _context.t0 = _context["catch"](3);
            return _context.abrupt("return", next(_context.t0));

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 23]]);
  }); //CreatePost Image Upload

  router.post('/postImage', upload.single('uploadImage'), function _callee2(req, res, next) {
    var err, newPost, user, _err2;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.isAuth) {
              _context2.next = 3;
              break;
            }

            err = new Error('Unauthorized!');
            return _context2.abrupt("return", next(err));

          case 3:
            newPost = new Post({
              postImageUrl: req.file.filename,
              creator: req.user.userId
            });
            _context2.next = 6;
            return regeneratorRuntime.awrap(User.findById(req.user.userId));

          case 6:
            user = _context2.sent;

            if (!user) {
              _context2.next = 16;
              break;
            }

            user.posts.push(newPost);
            _context2.next = 11;
            return regeneratorRuntime.awrap(user.save());

          case 11:
            _context2.next = 13;
            return regeneratorRuntime.awrap(newPost.save());

          case 13:
            res.json({
              postImageUrl: req.file.filename,
              success: true
            });
            _context2.next = 19;
            break;

          case 16:
            _err2 = new Error("User not found");
            res.status(404);
            return _context2.abrupt("return", next(_err2));

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
});
router.post('/postImageInput/:filename', function _callee3(req, res) {
  var post;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Post.findOne({
            postImageUrl: req.params.filename
          }).populate('creator'));

        case 3:
          post = _context3.sent;
          post.content = req.body.content;
          _context3.next = 7;
          return regeneratorRuntime.awrap(post.save());

        case 7:
          res.json(_objectSpread({}, post._doc, {
            createdAt: toDateString(post.createdAt),
            updatedAt: toDateString(post.updatedAt)
          }));
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          res.status(500);
          return _context3.abrupt("return", next(_context3.t0));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
});
router.get("/img/:filename", function _callee4(req, res, next) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(gfs.find({
            filename: req.params.filename
          }).toArray(function (err, files) {
            if (!files || files.length === 0) {
              return res.status(404).json({
                message: "no files exist",
                error: err
              });
            }

            gfs.openDownloadStreamByName(files[0].filename).pipe(res);
          }));

        case 3:
          _context4.next = 9;
          break;

        case 5:
          _context4.prev = 5;
          _context4.t0 = _context4["catch"](0);
          res.status(500);
          next(_context4.t0);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 5]]);
}); //GET USERS

router.get('/', function _callee5(req, res, next) {
  var err, userData, user, posts, likes, notif;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (req.isAuth) {
            _context5.next = 4;
            break;
          }

          err = new Error('Unauthorized!');
          res.status(401);
          return _context5.abrupt("return", next(err));

        case 4:
          userData = {};
          _context5.next = 7;
          return regeneratorRuntime.awrap(User.findById(req.user.userId));

        case 7:
          user = _context5.sent;
          _context5.next = 10;
          return regeneratorRuntime.awrap(Post.find({
            creator: user
          }, null, {
            sort: '-createdAt'
          }).populate('comments'));

        case 10:
          posts = _context5.sent;
          _context5.next = 13;
          return regeneratorRuntime.awrap(Like.find({
            user: req.user.userId
          }));

        case 13:
          likes = _context5.sent;
          _context5.next = 16;
          return regeneratorRuntime.awrap(Notification.find({
            userId: req.user.userId
          }));

        case 16:
          notif = _context5.sent;

          if (!user) {
            _context5.next = 24;
            break;
          }

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
          _context5.next = 26;
          break;

        case 24:
          res.status(404);
          return _context5.abrupt("return", next());

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  });
}); //GET USER

router.get('/:userId', function _callee6(req, res, next) {
  var user, post, userData;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.userId));

        case 3:
          user = _context6.sent;
          _context6.next = 6;
          return regeneratorRuntime.awrap(Post.find({
            creator: req.params.userId
          }).sort('-createdAt').populate('comments').sort('-createdAt'));

        case 6:
          post = _context6.sent;
          userData = {};

          if (!user) {
            _context6.next = 14;
            break;
          }

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
          _context6.next = 16;
          break;

        case 14:
          res.status(404);
          return _context6.abrupt("return", next());

        case 16:
          _context6.next = 22;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](0);
          res.status(500);
          return _context6.abrupt("return", next(_context6.t0));

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
router.get('/notification', function _callee7(req, res, next) {
  var err;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          if (req.isAuth) {
            _context7.next = 3;
            break;
          }

          err = new Error('Unauthorized!');
          return _context7.abrupt("return", next(err));

        case 3:
          _context7.prev = 3;
          _context7.next = 6;
          return regeneratorRuntime.awrap(Notification.updateMany({
            recipient: req.user.userId
          }, {
            $set: {
              read: true
            }
          }).limit(10));

        case 6:
          res.status(200).json({
            message: 'Notifications marked read'
          });
          _context7.next = 13;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](3);
          res.status(500);
          return _context7.abrupt("return", next(_context7.t0));

        case 13:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[3, 9]]);
});
router.post('/notifications', function _callee8(req, res, next) {
  var err;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          if (req.isAuth) {
            _context8.next = 4;
            break;
          }

          err = new Error('Unauthenticated!');
          res.status(401);
          return _context8.abrupt("return", next(err));

        case 4:
          _context8.prev = 4;
          _context8.next = 7;
          return regeneratorRuntime.awrap(Notification.updateMany({
            userId: req.body.userId
          }, {
            read: true
          }));

        case 7:
          res.json({
            message: "Marked notifications read"
          });
          _context8.next = 14;
          break;

        case 10:
          _context8.prev = 10;
          _context8.t0 = _context8["catch"](4);
          res.status(500);
          return _context8.abrupt("return", next(_context8.t0));

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[4, 10]]);
});
module.exports = router;