"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _types = require("../types");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  authenticated: false,
  loading: false,
  loadingUserDetails: false,
  loadingProfile: false,
  credentials: {},
  likes: [],
  notifications: [],
  users: []
};

var _default = function _default() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _types.SET_AUTH:
      return _objectSpread({}, state, {
        authenticated: true
      });

    case _types.SET_UNAUTH:
      return {
        initialState: initialState
      };

    case _types.LOADING_PROFILE_PICTURE:
      return _objectSpread({}, state, {
        loadingProfile: true
      });

    case _types.SET_USER:
      return _objectSpread({}, state, {
        authenticated: true
      }, action.payload, {
        loading: false,
        loadingProfile: false
      });

    case _types.SET_USERS:
      return _objectSpread({}, state, {
        authenticated: true,
        users: action.payload
      });

    case _types.LOADING_USER:
      return _objectSpread({}, state, {
        loading: true
      });

    case _types.LIKE_POST:
      return _objectSpread({}, state, {
        likes: [].concat(_toConsumableArray(state.likes), [{
          user: state.credentials._id,
          post: action.payload._id
        }])
      });

    case _types.UNLIKE_POST:
      return _objectSpread({}, state, {
        likes: state.likes.filter(function (like) {
          return like.post !== action.payload._id;
        })
      });

    case _types.LOADING_USER_DETAILS:
      return _objectSpread({}, state, {
        loadingUserDetails: true
      });

    case _types.EDIT_USER_DETAILS:
      return _objectSpread({}, state, {
        credentials: _objectSpread({}, state.credentials, {
          bio: action.payload.bio,
          location: action.payload.location,
          status: action.payload.status
        }),
        loadingUserDetails: false
      });

    case _types.ADD_POST:
      return _objectSpread({}, state, {
        credentials: _objectSpread({}, state.credentials, {
          posts: [action.payload].concat(_toConsumableArray(state.credentials.posts))
        })
      });

    case _types.ADD_COMMENT:
      var newComment = state.credentials.posts.map(function (post) {
        if (post._id === action.payload.postId) {
          return _objectSpread({}, post, {
            comments: [].concat(_toConsumableArray(post.comments), [action.payload])
          });
        }

        return post;
      });
      return _objectSpread({}, state, {
        credentials: _objectSpread({}, state.credentials, {
          posts: newComment
        })
      });

    case _types.MARKED_NOTIFICATIONS_READ:
      return _objectSpread({}, state, {
        notifications: state.notifications.map(function (notif) {
          return _objectSpread({}, notif, {
            read: true
          });
        })
      });

    default:
      return state;
  }
};

exports["default"] = _default;