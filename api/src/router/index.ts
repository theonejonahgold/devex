import { hash } from 'argon2'
import { v4 as uuid } from 'uuid'
import { Next, ParameterizedContext } from 'koa'
import Router from '@koa/router'
import { firestore } from 'firebase-admin'
import { userCollection } from '../firebase'
import { confirmBody, dataBody, errorBody } from './utils'
import passport from 'koa-passport'
import { UserInput } from 'types/user'

export default new Router()
  .post('/register', register)
  .post('/login', login)
  .get('/logout', logout)
  .post('/online', ctx => {
    console.log(ctx.body)
    ctx.body = confirmBody()
    ctx.status = 200
  })

async function register(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>
) {
  const { username, password }: UserInput = ctx.body
  if (!username) {
    ctx.status = 400
    ctx.body = errorBody('Username is required')
    return
  }
  if (!password) {
    ctx.status = 400
    ctx.body = errorBody('Password is required')
    return
  }
  const hashedPassword = await hash(password)
  try {
    await userCollection().doc(username).create({
      username,
      password: hashedPassword,
      followers: [],
      following: [],
      streamKey: uuid(),
      online: false,
      createdAt: firestore.Timestamp.now(),
      updatedAt: firestore.Timestamp.now(),
    })
    ctx.body = confirmBody()
  } catch (err) {
    ctx.status = 500
    ctx.body = errorBody(
      err.message.includes('already exists') ? 'Username is taken' : err.message
    )
  }
}

function login(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>,
  next: Next
) {
  return passport.authenticate('local', (err, user, info, status) => {
    if (!user) {
      ctx.status = 400
      ctx.body = errorBody(err.message)
      return
    }
    // @ts-ignore
    ctx.login(user)
    ctx.body = dataBody(user)
  })(ctx, next)
}

function logout(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>
) {
  //@ts-ignore
  ctx.logout()
  ctx.status = 200
  ctx.body = confirmBody()
}
