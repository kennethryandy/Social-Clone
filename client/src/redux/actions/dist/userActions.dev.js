"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markedNotif = exports.editUserDetails = exports.getUserData = exports.logoutUser = exports.signupUser = exports.loginUser = exports.uploadImage = void 0;

var _types = require("../types");

var _axios = _interopRequireDefault(require("axios"));

var _dataActions = require("./dataActions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var uploadImage = function uploadImage(formData) {
  return function _callee(dispatch) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/api/user/uploadImage', formData));

          case 3:
            dispatch({
              type: _types.LOADING_PROFILE_PICTURE
            });
            dispatch(getUserData());
            dispatch((0, _dataActions.getAllPosts)());
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            console.log(_context.t0.message);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 8]]);
  };
};

exports.uploadImage = uploadImage;

var loginUser = function loginUser(userData, history) {
  return function _callee2(dispatch) {
    var res;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            dispatch({
              type: _types.LOADING_UI
            });
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', userData));

          case 4:
            res = _context2.sent;
            setAuthorizationHeaders(res.data.data.login.token);
            dispatch(setUsers);
            dispatch(getUserData());
            dispatch({
              type: _types.CLEAR_ERRORS
            });
            history.push('/');
            _context2.next = 15;
            break;

          case 12:
            _context2.prev = 12;
            _context2.t0 = _context2["catch"](1);

            if (_context2.t0.response && _context2.t0.response.data && _context2.t0.response.data.errors) {
              dispatch({
                type: _types.SET_ERRORS,
                payload: _context2.t0.response.data.errors[0].message
              });
            } else {
              dispatch({
                type: _types.SET_ERRORS,
                payload: "Please try again."
              });
            }

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 12]]);
  };
};

exports.loginUser = loginUser;

var signupUser = function signupUser(newUser, history) {
  return function _callee3(dispatch) {
    var res;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            dispatch({
              type: _types.LOADING_UI
            });
            _context3.prev = 1;
            _context3.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', newUser));

          case 4:
            res = _context3.sent;
            setAuthorizationHeaders(res.data.data.signup.token);
            dispatch(setUsers);
            dispatch(getUserData());
            dispatch({
              type: _types.CLEAR_ERRORS
            });
            history.push('/');
            _context3.next = 15;
            break;

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](1);

            if (_context3.t0.response && _context3.t0.response.data && _context3.t0.response.data.errors) {
              dispatch({
                type: _types.SET_ERRORS,
                payload: _context3.t0.response.data.errors[0].message
              });
            } else {
              dispatch({
                type: _types.SET_ERRORS,
                payload: "Please try again."
              });
            }

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[1, 12]]);
  };
};

exports.signupUser = signupUser;

var logoutUser = function logoutUser() {
  return function (dispatch) {
    localStorage.removeItem('userToken');
    delete _axios["default"].defaults.headers.common['Authorization'];
    dispatch({
      type: _types.SET_UNAUTH
    });
  };
};

exports.logoutUser = logoutUser;

var getUserData = function getUserData() {
  return function _callee4(dispatch) {
    var res;
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            dispatch({
              type: _types.LOADING_USER
            });
            _context4.prev = 1;
            _context4.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].get(process.env.REACT_APP_API_URL + '/api/user'));

          case 4:
            res = _context4.sent;
            dispatch({
              type: _types.SET_USER,
              payload: res.data
            });
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](1);
            console.log(_context4.t0);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[1, 8]]);
  };
};

exports.getUserData = getUserData;

var setUsers = function setUsers() {
  return function _callee5(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            reqBody = {
              query: "\n      query{\n        users{\n          _id\n          username\n          imageUrl\n          bio\n          location\n          status\n          posts{\n            _id\n            content\n            commentCount\n            likeCount\n            createdAt\n            creator{\n              username\n              imageUrl\n              _id\n            }\n            comments{\n              _id\n              content\n              createdAt\n              imageUrl\n              postId\n              userId\n              username\n            }\n          }\n        }\n      }"
            };
            _context5.prev = 1;
            _context5.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post("".concat(process.env.REACT_APP_API_URL, "/graphql"), reqBody));

          case 4:
            res = _context5.sent;
            dispatch({
              type: _types.SET_USERS,
              payload: res.data.data.users
            });
            _context5.next = 11;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](1);
            console.log(_context5.t0);

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[1, 8]]);
  };
};

var editUserDetails = function editUserDetails(userDetails) {
  return function _callee6(dispatch) {
    var reqBody, res;
    return regeneratorRuntime.async(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            reqBody = {
              query: "\n      mutation{\n        editUserDetails(userDetails:{bio:\"".concat(userDetails.bio, "\" location:\"").concat(userDetails.location, "\" status: \"").concat(userDetails.status, "\"}){\n          bio\n          location\n          status\n        }\n      }\n    ")
            };
            _context6.prev = 1;
            _context6.next = 4;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/graphql', reqBody));

          case 4:
            res = _context6.sent;
            dispatch({
              type: _types.LOADING_USER_DETAILS
            });
            dispatch({
              type: _types.EDIT_USER_DETAILS,
              payload: res.data.data.editUserDetails
            });
            _context6.next = 12;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](1);
            console.log(_context6.t0);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[1, 9]]);
  };
};

exports.editUserDetails = editUserDetails;

var markedNotif = function markedNotif(userId) {
  return function _callee7(dispatch) {
    return regeneratorRuntime.async(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.prev = 0;
            _context7.next = 3;
            return regeneratorRuntime.awrap(_axios["default"].post(process.env.REACT_APP_API_URL + '/api/user/notifications', {
              userId: userId
            }));

          case 3:
            dispatch({
              type: _types.MARKED_NOTIFICATIONS_READ
            });
            _context7.next = 9;
            break;

          case 6:
            _context7.prev = 6;
            _context7.t0 = _context7["catch"](0);
            console.log(_context7.t0.message);

          case 9:
          case "end":
            return _context7.stop();
        }
      }
    }, null, null, [[0, 6]]);
  };
};

exports.markedNotif = markedNotif;

var setAuthorizationHeaders = function setAuthorizationHeaders(token) {
  var userToken = "Bearer ".concat(token);
  localStorage.setItem('userToken', userToken);
  _axios["default"].defaults.headers.common['Authorization'] = userToken;
};