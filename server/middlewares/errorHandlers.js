function notFound (req, res, next) {
  res.status(404);
  const error = new Error("Not found");
  next(error)
};

function errorHandler (err, req, res, next) {
  res.json({
    err: err.mesage,
    stack: process.env.NODE_ENV === 'production' ? "" : err.stack
  })
}


module.exports = {
  notFound,
  errorHandler
}