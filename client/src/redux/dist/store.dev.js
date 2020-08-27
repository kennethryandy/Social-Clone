"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _redux = require("redux");

var _reduxThunk = _interopRequireDefault(require("redux-thunk"));

var _dataReducer = _interopRequireDefault(require("./reducers/dataReducer"));

var _userReducer = _interopRequireDefault(require("./reducers/userReducer"));

var _uiReducer = _interopRequireDefault(require("./reducers/uiReducer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var initialState = {};
var middleware = [_reduxThunk["default"]];
var reducers = (0, _redux.combineReducers)({
  data: _dataReducer["default"],
  user: _userReducer["default"],
  UI: _uiReducer["default"]
});

var _default = (0, _redux.createStore)(reducers, initialState, (0, _redux.compose)(_redux.applyMiddleware.apply(void 0, middleware)));

exports["default"] = _default;