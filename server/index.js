require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose')
const {graphqlHTTP} = require('express-graphql')



const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors())
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN : 'http://localhost:3000'
// }));

const rootSchema = require('./graphql/schema')
const rootResolver = require('./graphql/resolvers')
const isAuth = require('./middlewares/isAuth')

app.get('/', (req, res) => {
  res.json({
    message: "Hello"
  })
})

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

mongoose.connect(process.env.MONGODB_URI, {useCreateIndex: true,useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log("Database connected")
  })
  .catch(err => {
    console.log(`Database connection error: ${err}`)
  })


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});