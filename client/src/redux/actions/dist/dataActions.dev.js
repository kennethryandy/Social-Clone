"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addComment = exports.unlikePost = exports.likePost = exports.deletePost = exports.createPost = exports.getAllPosts = void 0;

var _types = require("../types");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getAllPosts = function getAllPosts() {
  return function _callee(dispatch) {
    var option, reqBody, res;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            dispatch({
              type: _types.LOADING_DATA
            });
            option = {
              headers: {
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'application/json'
              }
            };
            _context.prev = 2;
            reqBody = {
              query: "\n        query{\n          posts{\n            _id\n            content\n            postImageUrl\n            creator{\n              username\n              imageUrl\n              _id\n            }\n            comments{\n              _id\n              content\n              username\n              imageUrl\n              userId\n              postId\n              createdAt\n            }\n            commentCount\n            likeCount\n            createdAt\n          }\n        }\n      "
            };
            _context.next = 6;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 6:
            res = _context.sent;
            dispatch({
              type: _types.GET_POSTS,
              payload: res.data.data.posts
            });
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](2);
            console.error(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[2, 10]]);
  };
};

exports.getAllPosts = getAllPosts;

var createPost = function createPost(content, formData) {
  return function _callee2(dispatch) {
    var reqBody, resImageUrl, res, _res;

    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dispatch({
              type: _types.LOADING_CREATE_POST
            });
            reqBody = {
              query: "\n      mutation{\n        createPost(content:\"".concat(content, "\"){\n          _id\n          content\n          likes{\n            user\n            post\n            _id\n          }\n          creator{\n            _id\n            username\n            imageUrl\n          }\n          comments{\n            _id\n            content\n            createdAt\n          }\n          commentCount\n          likeCount\n          createdAt\n        }\n      }\n    ")
            };
            _context2.prev = 2;

            if (!formData) {
              _context2.next = 15;
              break;
            }

            _context2.next = 6;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/api/user/postImage', formData));

          case 6:
            resImageUrl = _context2.sent;

            if (!resImageUrl.data.success) {
              _context2.next = 13;
              break;
            }

            _context2.next = 10;
            return regeneratorRuntime.awrap(_axios["default"].post("".concat(process.env.REACT_APP_API_URL, "/api/user/postImageInput/").concat(resImageUrl.data.postImageUrl), {
              content: content
            }));

          case 10:
            res = _context2.sent;
            dispatch({
              type: _types.CREATE_POST,
              payload: res.data
            });
            dispatch({
              type: _types.ADD_POST,
              payload: _objectSpread({}, res.data, {
                creator: res.data.creator._id
              })
            });

          case 13:
            _context2.next = 20;
            break;

          case 15:
            _context2.next = 17;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 17:
            _res = _context2.sent;
            dispatch({
              type: _types.CREATE_POST,
              payload: _res.data.data.createPost
            });
            dispatch({
              type: _types.ADD_POST,
              payload: _objectSpread({}, _res.data.data.createPost, {
                creator: _res.data.data.createPost.creator._id
              })
            });

          case 20:
            _context2.next = 25;
            break;

          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](2);
            console.log(_context2.t0);

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[2, 22]]);
  };
};

exports.createPost = createPost;

var deletePost = function deletePost(postId) {
  return function _callee3(dispatch) {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dispatch({
              type: _types.LOADING_DELETE_POST
            });
            _context3.next = 3;
            return regeneratorRuntime.awrap(_axios["default"]["delete"]("".concat(process.env.REACT_APP_API_URL, "/api/post/").concat(postId)));

          case 3:
            dispatch({
              type: _types.DELETE_POST,
              payload: postId
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    });
  };
};

exports.deletePost = deletePost;

var likePost = function likePost(postId) {
  return function _callee4(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            dispatch({
              type: _types.LOADING_LIKE
            });
            reqBody = {
              query: "\n      mutation{\n        likePost(postId:\"".concat(postId, "\"){\n          _id\n          content\n          postImageUrl\n          creator{\n            username\n            imageUrl\n            _id\n          }\n          comments{\n            _id\n            content\n            username\n            imageUrl\n            userId\n            postId\n            createdAt\n          }\n          commentCount\n          likeCount\n          createdAt\n        }\n      }\n    ")
            };
            _context4.prev = 2;
            _context4.next = 5;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 5:
            res = _context4.sent;
            dispatch({
              type: _types.LIKE_POST,
              payload: res.data.data.likePost
            });
            _context4.next = 13;
            break;

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](2);
            console.log("ERROR", _context4.t0);
            console.log(_context4.t0.message);

          case 13:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[2, 9]]);
  };
};

exports.likePost = likePost;

var unlikePost = function unlikePost(postId) {
  return function _callee5(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            dispatch({
              type: _types.LOADING_LIKE
            });
            reqBody = {
              query: "\n      mutation{\n        unlikePost(postId:\"".concat(postId, "\"){\n          _id\n          content\n          postImageUrl\n          creator{\n            username\n            imageUrl\n            _id\n          }\n          comments{\n            _id\n            content\n            username\n            imageUrl\n            userId\n            postId\n            createdAt\n          }\n          commentCount\n          likeCount\n          createdAt\n        }\n      }\n    ")
            };
            _context5.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 4:
            res = _context5.sent;
            dispatch({
              type: _types.UNLIKE_POST,
              payload: res.data.data.unlikePost
            });

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    });
  };
};

exports.unlikePost = unlikePost;

var addComment = function addComment(postId, content) {
  return function _callee6(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            dispatch({
              type: _types.LOADING_COMMENT
            });
            reqBody = {
              query: "\n      mutation{\n        addComment(commentInput:{postId:\"".concat(postId, "\", content:\"").concat(content, "\"}){\n          _id\n          content\n          username\n          imageUrl\n          userId\n          postId\n          createdAt\n        }\n      }\n    ")
            };
            _context6.prev = 2;
            _context6.next = 5;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 5:
            res = _context6.sent;
            dispatch({
              type: _types.ADD_COMMENT,
              payload: res.data.data.addComment
            });
            _context6.next = 12;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](2);
            console.log(_context6.t0.message);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[2, 9]]);
  };
};

exports.addComment = addComment;