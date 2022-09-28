import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

import { getUserByEmail, getUserById } from './users.js'

export default function initialize(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => done(null, getUserById(id)))
}

function authenticateUser(email, password, done) {
  const user = getUserByEmail(email)
  if (user === undefined) {
    return done(null, false, { message: 'No user with that email' })
  }

  if (!bcrypt.compareSync(password, user.hash)) {
    return done(null, false, { message: 'Password incorrect' })
  }

  return done(null, user)
}