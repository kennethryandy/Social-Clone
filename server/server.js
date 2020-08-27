require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose')
const {graphqlHTTP} = require('express-graphql')



const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN
}));
app.use('/uploads',express.static('uploads'))

const rootSchema = require('./graphql/schema')
const rootResolver = require('./graphql/resolvers')
const isAuth = require('./middlewares/isAuth')

//auth middleware
app.use(isAuth)


//graphql
app.use('/graphql', graphqlHTTP({
  schema: rootSchema,
  rootValue: rootResolver,
  graphiql: true,
}));

const user = require('./routes/user')
const post = require('./routes/post')

app.use('/api/user', user)
app.use('/api/post', post)

const errorHandlers = require('./middlewares/errorHandlers')

app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);

mongoose.connect(process.env.MONGODB_URI, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
  .then(() => console.log('Database connected'))
  .catch(err => console.error(err));

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});