"use strict";

var _require = require('express'),
    Router = _require.Router;

var router = Router();

var Like = require('../model/likes');

var Notification = require('../model/notifications');

var Post = require('../model/posts');

var Comment = require('../model/comments');

router.get('/:postId', function _callee(req, res, next) {
  var err, populateQuery, post;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (req.isAuth) {
            _context.next = 3;
            break;
          }

          err = new Error('Unauthenticated!');
          return _context.abrupt("return", next(err));

        case 3:
          _context.prev = 3;
          populateQuery = [{
            path: 'creator',
            select: 'username imageUrl bio location status'
          }, {
            path: 'comments',
            select: 'content createdAt -_id'
          }];
          _context.next = 7;
          return regeneratorRuntime.awrap(Post.findById(req.params.postId).populate(populateQuery));

        case 7:
          post = _context.sent;
          res.json({
            post: post
          });
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](3);
          return _context.abrupt("return", next(_context.t0.message));

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 11]]);
});
router["delete"]('/:postId', function _callee2(req, res, next) {
  var err;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.isAuth) {
            _context2.next = 3;
            break;
          }

          err = new Error('Unauthenticated!');
          return _context2.abrupt("return", next(err));

        case 3:
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(Post.deleteOne({
            _id: req.params.postId
          }));

        case 6:
          _context2.next = 8;
          return regeneratorRuntime.awrap(Notification.deleteMany({
            postId: req.params.postId
          }));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(Like.deleteMany({
            post: req.params.postId
          }));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(Comment.deleteMany({
            post: req.params.postId
          }));

        case 12:
          res.json({
            message: "Post deleted successfully."
          });
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](3);
          return _context2.abrupt("return", next(_context2.t0));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 15]]);
});
module.exports = router;