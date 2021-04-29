import Router from '@koa/router'
import { hash } from 'argon2'
import { firestore } from 'firebase-admin'
import { sign } from 'jsonwebtoken'
import { Next, ParameterizedContext } from 'koa'
import passport from 'koa-passport'
import { UserInput } from 'types/user'
import { v4 as uuid } from 'uuid'
import { userCollection } from '../firebase'
import { secret } from '../utils'
import { confirmBody, dataBody, errorBody } from './utils'

export { register, login, follow, unfollow }

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
      streamTitle: '',
      language: 'cobol',
    })
    const jwt = sign({ username }, secret, {
      audience: 'devex.jonahgold.dev',
      issuer: 'jonahgold.dev',
    })
    ctx.body = dataBody({ token: jwt })
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
      ctx.body = errorBody(err)
      return
    }
    const jwt = sign({ username: user.username }, secret, {
      audience: 'devex.jonahgold.dev',
      issuer: 'jonahgold.dev',
    })
    ctx.body = dataBody({ token: jwt })
  })(ctx, next)
}

async function follow(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, any>, any>
) {
  const { user } = ctx.state
  await userCollection()
    .doc(user.username)
    .update({
      following: firestore.FieldValue.arrayUnion(ctx.request.body.channel),
    })
  ctx.status = 200
  ctx.body = confirmBody()
}

async function unfollow(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, any>, any>
) {
  const { user } = ctx.state
  await userCollection()
    .doc(user.username)
    .update({
      following: firestore.FieldValue.arrayRemove(ctx.request.body.channel),
    })
  ctx.status = 200
  ctx.body = confirmBody()
}
