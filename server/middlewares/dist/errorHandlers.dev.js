"use strict";

function notFound(req, res, next) {
  res.status(404);
  var error = new Error("Not found");
  next(error);
}

;

function errorHandler(err, req, res, next) {
  res.json({
    err: err.mesage,
    stack: process.env.NODE_ENV === 'production' ? "" : err.stack
  });
}

module.exports = {
  notFound: notFound,
  errorHandler: errorHandler
};