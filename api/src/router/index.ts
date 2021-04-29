import Router from '@koa/router'
import passport from 'koa-passport'
import { discover, language, languages } from './pages'
import { language as updateLanguage, live, title, user } from './stream'
import { follow, login, register, unfollow } from './user'

export default new Router({ prefix: '/api' })
  .post('/register', register)
  .post('/login', login)
  .post('/live', live)
  .get('/discovery', discover)
  .get('/languages', languages)
  .get('/languages/:language', language)
  .get('/user/:username', user)
  .use(passport.authenticate('jwt', { session: false }))
  .post('/follow', follow)
  .post('/unfollow', unfollow)
  .post('/title', title)
  .post('/language', updateLanguage)
