import express from 'express'
import flash from 'express-flash'
import session from 'express-session'
import passport from 'passport'
import methodOverride from 'method-override'
import crypto from 'crypto'

import initializePassport from './passport-config.js'
import { addUser } from './users.js'

if (process.env.NODE_ENV !== 'production') {
  (await import('dotenv')).config()
}

initializePassport(passport)

const app = express()

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET || generateSecret(),
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { user: req.user })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', (req, res) => {
  addUser(req.body)
  res.redirect('/login')
})

app.delete('/logout', (req, res) => {
  req.logOut((err) => console.error(err))
  res.redirect('/login')
})

app.listen(process.env.PORT || 3000)

function checkNotAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function generateSecret() {
  return crypto.randomBytes(256).toString('base64')
}