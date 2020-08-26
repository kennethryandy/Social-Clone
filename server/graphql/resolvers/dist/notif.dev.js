"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Comment = require('../../model/comments');

var Post = require('../../model/posts');

var Notification = require('../../model/notifications');

var Like = require('../../model/likes');

var User = require('../../model/users');

var _require = require('../../helpers/toDateString'),
    toDateString = _require.toDateString;

module.exports = {
  comments: function comments() {
    var comments, resComment;
    return regeneratorRuntime.async(function comments$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(Comment.find().populate('post').populate('user'));

          case 3:
            comments = _context.sent;

            if (comments) {
              _context.next = 6;
              break;
            }

            throw new Error('Comment not found');

          case 6:
            resComment = comments.map(function (comment) {
              return {
                _id: comment._id,
                userId: comment.user._id,
                username: comment.user.username,
                imageUrl: comment.user.imageUrl,
                postId: comment.post._id,
                content: comment.content,
                createdAt: toDateString(comment.createdAt),
                updatedAt: toDateString(comment.updatedAt)
              };
            });
            return _context.abrupt("return", resComment);

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 10]]);
  },
  addComment: function addComment(args, req) {
    var _args$commentInput, postId, content, post, user, userSender, postCount, newNotif, newComment;

    return regeneratorRuntime.async(function addComment$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (req.isAuth) {
              _context2.next = 2;
              break;
            }

            throw new Error('Unauthorized!');

          case 2:
            _args$commentInput = args.commentInput, postId = _args$commentInput.postId, content = _args$commentInput.content;
            _context2.next = 5;
            return regeneratorRuntime.awrap(Post.findById(postId));

          case 5:
            post = _context2.sent;
            _context2.prev = 6;

            if (!post) {
              _context2.next = 30;
              break;
            }

            _context2.next = 10;
            return regeneratorRuntime.awrap(User.findById(post.creator));

          case 10:
            user = _context2.sent;
            _context2.next = 13;
            return regeneratorRuntime.awrap(User.findById(req.user.userId));

          case 13:
            userSender = _context2.sent;
            postCount = post.commentCount;

            if (!(user.id !== req.user.userId)) {
              _context2.next = 19;
              break;
            }

            newNotif = new Notification({
              recipient: user.username,
              sender: userSender.username,
              type: 'comment',
              postId: postId,
              userId: user._id,
              imageUrl: userSender.imageUrl,
              senderId: userSender._id
            });
            _context2.next = 19;
            return regeneratorRuntime.awrap(newNotif.save());

          case 19:
            newComment = new Comment({
              userId: userSender._id,
              username: userSender.username,
              imageUrl: userSender.imageUrl,
              postId: post._id,
              content: content
            });
            post.comments.push(newComment);
            postCount++;
            post.commentCount = postCount;
            _context2.next = 25;
            return regeneratorRuntime.awrap(post.save());

          case 25:
            _context2.next = 27;
            return regeneratorRuntime.awrap(newComment.save());

          case 27:
            return _context2.abrupt("return", _context2.sent);

          case 30:
            throw new Error('Post not found');

          case 31:
            _context2.next = 36;
            break;

          case 33:
            _context2.prev = 33;
            _context2.t0 = _context2["catch"](6);
            throw _context2.t0;

          case 36:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[6, 33]]);
  },
  likePost: function likePost(_ref, req) {
    var postId, likesDoc, postDoc, userSender, postData, user, newNotif, newLike;
    return regeneratorRuntime.async(function likePost$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            postId = _ref.postId;

            if (req.isAuth) {
              _context3.next = 3;
              break;
            }

            throw new Error('Unauthorized!');

          case 3:
            _context3.next = 5;
            return regeneratorRuntime.awrap(Like.findOne({
              post: postId,
              user: req.user.userId
            }));

          case 5:
            likesDoc = _context3.sent;
            _context3.next = 8;
            return regeneratorRuntime.awrap(Post.findOne({
              _id: postId
            }).populate('comments'));

          case 8:
            postDoc = _context3.sent;
            _context3.next = 11;
            return regeneratorRuntime.awrap(User.findById(req.user.userId));

          case 11:
            userSender = _context3.sent;
            _context3.prev = 12;

            if (!postDoc) {
              _context3.next = 37;
              break;
            }

            _context3.next = 16;
            return regeneratorRuntime.awrap(User.findById(postDoc.creator));

          case 16:
            user = _context3.sent;
            postData = postDoc;

            if (likesDoc) {
              _context3.next = 34;
              break;
            }

            if (!(user.id !== req.user.userId)) {
              _context3.next = 23;
              break;
            }

            newNotif = new Notification({
              recipient: user.username,
              sender: userSender.username,
              type: 'like',
              postId: postId,
              userId: user._id,
              imageUrl: userSender.imageUrl,
              senderId: userSender._id
            });
            _context3.next = 23;
            return regeneratorRuntime.awrap(newNotif.save());

          case 23:
            newLike = new Like({
              username: userSender.username,
              user: userSender._id,
              post: postId
            });
            _context3.next = 26;
            return regeneratorRuntime.awrap(newLike.save());

          case 26:
            postDoc.likes.push(newLike);
            postData.likeCount++;
            postDoc.likeCount = postData.likeCount;
            _context3.next = 31;
            return regeneratorRuntime.awrap(postDoc.save());

          case 31:
            return _context3.abrupt("return", _objectSpread({}, postDoc._doc, {
              creator: user,
              createdAt: toDateString(postDoc.createdAt),
              updatedAt: toDateString(postDoc.updatedAt)
            }));

          case 34:
            throw new Error('Already liked post');

          case 35:
            _context3.next = 38;
            break;

          case 37:
            throw new Error("Cannot like a post that doesn't exists");

          case 38:
            _context3.next = 43;
            break;

          case 40:
            _context3.prev = 40;
            _context3.t0 = _context3["catch"](12);
            throw _context3.t0;

          case 43:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[12, 40]]);
  },
  unlikePost: function unlikePost(_ref2, req) {
    var postId, likesDoc, postDoc, postData, user;
    return regeneratorRuntime.async(function unlikePost$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            postId = _ref2.postId;

            if (req.isAuth) {
              _context4.next = 3;
              break;
            }

            throw new Error('Unauthorized!');

          case 3:
            _context4.next = 5;
            return regeneratorRuntime.awrap(Like.findOne({
              post: postId,
              user: req.user.userId
            }).populate('comments'));

          case 5:
            likesDoc = _context4.sent;
            _context4.next = 8;
            return regeneratorRuntime.awrap(Post.findOne({
              _id: postId
            }));

          case 8:
            postDoc = _context4.sent;
            _context4.prev = 9;

            if (!postDoc) {
              _context4.next = 31;
              break;
            }

            postData = postDoc;

            if (!likesDoc) {
              _context4.next = 28;
              break;
            }

            _context4.next = 15;
            return regeneratorRuntime.awrap(User.findById(postDoc.creator));

          case 15:
            user = _context4.sent;

            if (!(user.id !== req.user.userId)) {
              _context4.next = 19;
              break;
            }

            _context4.next = 19;
            return regeneratorRuntime.awrap(Notification.findOneAndDelete({
              postId: postId,
              type: "like"
            }));

          case 19:
            _context4.next = 21;
            return regeneratorRuntime.awrap(likesDoc.deleteOne());

          case 21:
            postData.likeCount--;
            postDoc.likeCount = postData.likeCount;
            _context4.next = 25;
            return regeneratorRuntime.awrap(postDoc.save());

          case 25:
            return _context4.abrupt("return", _objectSpread({}, postDoc._doc, {
              creator: user,
              createdAt: toDateString(postDoc.createdAt),
              updatedAt: toDateString(postDoc.updatedAt)
            }));

          case 28:
            throw new Error('Post not liked');

          case 29:
            _context4.next = 32;
            break;

          case 31:
            throw new Error("Cannot unlike a post that doesn't exists");

          case 32:
            _context4.next = 37;
            break;

          case 34:
            _context4.prev = 34;
            _context4.t0 = _context4["catch"](9);
            throw _context4.t0;

          case 37:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[9, 34]]);
  }
};