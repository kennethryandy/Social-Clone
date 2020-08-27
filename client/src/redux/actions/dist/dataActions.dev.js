"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addComment = exports.unlikePost = exports.likePost = exports.createPost = exports.getAllPosts = void 0;

var _types = require("../types");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getAllPosts = function getAllPosts() {
  return function _callee(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dispatch({
              type: _types.LOADING_DATA
            });
            _context.prev = 1;
            reqBody = {
              query: "\n        query{\n          posts{\n            _id\n            content\n            creator{\n              username\n              imageUrl\n              _id\n            }\n            comments{\n              _id\n              content\n              username\n              imageUrl\n              userId\n              postId\n              createdAt\n            }\n            commentCount\n            likeCount\n            createdAt\n          }\n        }\n      "
            };
            _context.next = 5;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 5:
            res = _context.sent;
            dispatch({
              type: _types.GET_POSTS,
              payload: res.data.data.posts
            });
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](1);
            console.error(_context.t0);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 9]]);
  };
};

exports.getAllPosts = getAllPosts;

var createPost = function createPost(content) {
  return function _callee2(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            reqBody = {
              query: "\n      mutation{\n        createPost(content:\"".concat(content, "\"){\n          _id\n          content\n          likes{\n            user\n            post\n            _id\n          }\n          creator{\n            _id\n            username\n            imageUrl\n          }\n          comments{\n            _id\n            content\n            createdAt\n          }\n          commentCount\n          likeCount\n          createdAt\n        }\n      }\n    ")
            };
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 4:
            res = _context2.sent;
            dispatch({
              type: _types.CREATE_POST,
              payload: res.data.data.createPost
            });
            dispatch({
              type: _types.ADD_POST,
              payload: _objectSpread({}, res.data.data.createPost, {
                creator: res.data.data.createPost.creator._id
              })
            });
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](1);
            console.log(_context2.t0);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 9]]);
  };
};

exports.createPost = createPost;

var likePost = function likePost(postId) {
  return function _callee3(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            reqBody = {
              query: "\n      mutation{\n        likePost(postId:\"".concat(postId, "\"){\n          _id\n          content\n          creator{\n            username\n            imageUrl\n            _id\n          }\n          comments{\n            _id\n            content\n            username\n            imageUrl\n            userId\n            postId\n            createdAt\n          }\n          commentCount\n          likeCount\n          createdAt\n        }\n      }\n    ")
            };
            _context3.prev = 1;
            _context3.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 4:
            res = _context3.sent;
            dispatch({
              type: _types.LIKE_POST,
              payload: res.data.data.likePost
            });
            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            console.log("ERROR", _context3.t0);
            console.log(_context3.t0.message);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[1, 8]]);
  };
};

exports.likePost = likePost;

var unlikePost = function unlikePost(postId) {
  return function _callee4(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            reqBody = {
              query: "\n      mutation{\n        unlikePost(postId:\"".concat(postId, "\"){\n          _id\n          content\n          creator{\n            username\n            imageUrl\n            _id\n          }\n          comments{\n            _id\n            content\n            username\n            imageUrl\n            userId\n            postId\n            createdAt\n          }\n          commentCount\n          likeCount\n          createdAt\n        }\n      }\n    ")
            };
            _context4.next = 3;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 3:
            res = _context4.sent;
            dispatch({
              type: _types.UNLIKE_POST,
              payload: res.data.data.unlikePost
            });

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    });
  };
};

exports.unlikePost = unlikePost;

var addComment = function addComment(postId, content) {
  return function _callee5(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            reqBody = {
              query: "\n      mutation{\n        addComment(commentInput:{postId:\"".concat(postId, "\", content:\"").concat(content, "\"}){\n          _id\n          content\n          username\n          imageUrl\n          userId\n          postId\n          createdAt\n        }\n      }\n    ")
            };
            _context5.prev = 1;
            _context5.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 4:
            res = _context5.sent;
            dispatch({
              type: _types.ADD_COMMENT,
              payload: res.data.data.addComment
            });
            _context5.next = 11;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](1);
            console.log(_context5.t0.message);

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[1, 8]]);
  };
};

exports.addComment = addComment;