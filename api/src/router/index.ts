import { hash } from 'argon2'
import { v4 as uuid } from 'uuid'
import { Next, ParameterizedContext } from 'koa'
import Router from '@koa/router'
import { firestore } from 'firebase-admin'
import { userCollection } from '../firebase'
import { confirmBody, dataBody, errorBody } from './utils'
import passport from 'koa-passport'
import { DBUser, UserInput } from 'types/user'
import { sign } from 'jsonwebtoken'
import { secret } from '../utils'

export default new Router({ prefix: '/api' })
  .post('/register', register)
  .post('/login', login)
  .get('/logout', logout)
  .post('/online', online)

async function register(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>
) {
  const { username, password }: UserInput = ctx.request.body
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
      following: [],
      streamKey: uuid(),
      live: false,
      viewers: 0,
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
  ctx.body = ctx.request.body
  return passport.authenticate('local', (err, user) => {
    if (!user) {
      ctx.status = 400
      ctx.body = errorBody(err.message)
      return
    }
    const jwt = sign({ username: user.username }, secret)
    ctx.body = dataBody({ token: jwt })
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

async function online(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>
) {
  const {
    body: { key, username, live },
  } = ctx.request
  const ref = userCollection().doc(username)
  const result = await ref.get()
  if (!result.exists) {
    ctx.status = 400
    ctx.body = errorBody('Username is invalid')
    return
  }
  const user = result.data()
  if (user!.streamKey !== key) {
    ctx.status = 400
    ctx.body = errorBody('Stream key is invalid')
    return
  }
  await ref.update({
    live,
    updatedAt: firestore.Timestamp.now(),
  })
  ctx.status = 200
  ctx.body = confirmBody()
}
