const JWT = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if(!authHeader){
    req.isAuth = false
    return next()
  }
  const token = authHeader.split('Bearer ')[1]
  if(!token || token.trim() === ''){
    req.isAuth = false
    return next()
  }
  try {
    const decodedToken = JWT.verify(token, process.env.TOKEN_SECRET)
    if(!decodedToken){
      req.isAuth = false
      return next()
    }
    req.isAuth = true;
    req.user = decodedToken
    next()
  } catch (error) {
    req.isAuth = false
    return next
  }

}