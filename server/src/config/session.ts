import { SessionOptions } from 'express-session'

import { IN_PROD } from './app'

const HALF_YEAR = 1000 * 60 * 60 * 24 * 180

export const {
  SESSION_SECRET = 'secret',
  SESSION_NAME = 'sid',
  SESSION_LIFETIME = HALF_YEAR
} = process.env

export const SESSION_OPTIONS: SessionOptions = {
  secret: SESSION_SECRET,
  name: SESSION_NAME,
  cookie: {
    maxAge: +SESSION_LIFETIME,
    secure: IN_PROD,
    sameSite: IN_PROD ? 'none' : 'lax'
  },
  rolling: true,
  resave: false,
  saveUninitialized: false
}
