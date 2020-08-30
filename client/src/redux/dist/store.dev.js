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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var initialState = {};
var middleware = [_reduxThunk["default"]];
var reducers = (0, _redux.combineReducers)({
  data: _dataReducer["default"],
  user: _userReducer["default"],
  UI: _uiReducer["default"]
});
var composeEnhancers = (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : _redux.compose;

var _default = (0, _redux.createStore)(reducers, initialState, composeEnhancers(_redux.applyMiddleware.apply(void 0, middleware)));

exports["default"] = _default;