import Router from '@koa/router'
import { hash } from 'argon2'
import { firestore } from 'firebase-admin'
import { sign } from 'jsonwebtoken'
import { Next, ParameterizedContext } from 'koa'
import passport from 'koa-passport'
import { DBUser, UserInput } from 'types/user'
import { v4 as uuid } from 'uuid'
import { languagesCollection, userCollection } from '../firebase'
import { secret } from '../utils'
import { confirmBody, dataBody, errorBody } from './utils'

export default new Router({ prefix: '/api' })
  .post('/register', register)
  .post('/login', login)
  .post('/live', live)
  .get('/discovery', discovery)
  .get('/languages', languages)
  .get('/languages/:language', language)
  .get('/user/:username', user)
  .use(passport.authenticate('jwt', { session: false }))
  .post('/follow', follow)
  .post('/unfollow', unfollow)
  .post('/title', title)
  .post('/language', updateLanguage)

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

async function discovery(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>
) {
  const ref = (userCollection().select(
    'username',
    'live',
    'viewers',
    'streamTitle',
    'language'
  ) as FirebaseFirestore.Query<
    Pick<DBUser, 'username' | 'live' | 'viewers' | 'streamTitle' | 'language'>
  >)
    .where('live', '==', true)
    .orderBy('viewers')
    .limit(20)

  const users = (await ref.get()).docs.map(doc => doc.data())
  ctx.status = 200
  ctx.body = dataBody({
    users,
  })
}

async function languages(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>
) {
  const languages = (await languagesCollection().get()).docs
    .map(doc => doc.data())
    .filter(doc => !!doc)
  ctx.body = dataBody({ languages })
  ctx.status = 200
}

async function language(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>
) {
  const langRes = (
    await languagesCollection().where('slug', '==', ctx.params.language).get()
  ).docs[0]
  if (!langRes.exists) {
    ctx.body = errorBody('Language not found')
    ctx.status = 404
    return
  }
  const streamersRes = await userCollection()
    .where('language', '==', ctx.params.language)
    .where('live', '==', true)
    .get()
  ctx.status = 200
  ctx.body = dataBody({
    language: langRes.data(),
    streamers: streamersRes.docs.map(doc => doc.data()),
  })
}

async function user(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, {}>, any>
) {
  const { username } = ctx.params
  const result = await userCollection().doc(username).get()
  if (!result.exists) {
    ctx.status = 404
    ctx.body = errorBody('User not found')
    return
  }
  const user = result.data()!
  if (user.language)
    user.language = (
      await languagesCollection().where('slug', '==', user.language).get()
    ).docs[0].data().name
  ctx.status = 200
  ctx.body = dataBody({
    user: {
      username: user.username,
      live: user.live,
      viewers: user.viewers,
      streamTitle: user.streamTitle,
      language: user.language,
    },
  })
}

async function live(
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

async function title(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, any>, any>
) {
  await userCollection()
    .doc(ctx.state.user.username)
    .update({ streamTitle: ctx.request.body.streamTitle })
  ctx.status = 200
  ctx.body = confirmBody()
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

async function updateLanguage(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, any>, any>
) {
  const { user } = ctx.state
  await userCollection()
    .doc(user.username)
    .update({ language: ctx.request.body.language })
  ctx.status = 200
  ctx.body = confirmBody()
}
