"use strict";

require('dotenv').config();

var express = require('express');

var helmet = require('helmet');

var cors = require('cors');

var mongoose = require('mongoose');

var _require = require('express-graphql'),
    graphqlHTTP = _require.graphqlHTTP;

var app = express();
app.use(express.json());
app.use(helmet()); // app.use(cors({
//   origin: process.env.CORS_ORIGIN
// }));

app.use(cors());
app.use('/uploads', express["static"]('uploads'));

var rootSchema = require('./graphql/schema');

var rootResolver = require('./graphql/resolvers');

var isAuth = require('./middlewares/isAuth'); //auth middleware


app.use(isAuth); //graphql

app.use('/graphql', graphqlHTTP({
  schema: rootSchema,
  rootValue: rootResolver,
  graphiql: true
}));

var user = require('./routes/user');

var post = require('./routes/post');

app.use('/api/user', user);
app.use('/api/post', post);

var errorHandlers = require('./middlewares/errorHandlers');

app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
}).then(function () {
  return console.log('Database connected');
})["catch"](function (err) {
  return console.error(err);
});
var port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log("Listening at http://localhost:".concat(port));
});