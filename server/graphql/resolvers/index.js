const authResolver = require('./auth')
const postResolver = require('./post')
const notifResolver = require('./notif')

module.exports = {
  ...authResolver,
  ...postResolver,
  ...notifResolver
}
