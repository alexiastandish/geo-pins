const User = require('../models/User')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID)

const findOrCreateUser = async token => {
  // verify auth token
  const googleUser = await verifyAuthToken(token)
  // check if user exists
  const user = await checkIfUserExists(googleUser.email)
  // if user exists return user
  return user ? user : createNewUser(googleUser)
  // otherwise create new user
}

const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    })
    return ticket.getPayload()
  } catch (err) {
    console.log('Auth token error', err)
  }
}

const checkIfUserExists = async email => {
  await User.findOne({ email }).exec()
}

const createNewUser = googleUser => {
  const { name, email, picture } = googleUser
  const user = { name, email, picture }
  return new User(user).save()
}

module.exports = {
  findOrCreateUser,
}
