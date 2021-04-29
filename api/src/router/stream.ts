import Router from '@koa/router'
import { firestore } from 'firebase-admin'
import { ParameterizedContext } from 'koa'
import { userCollection, languagesCollection } from 'src/firebase'
import { errorBody, dataBody, confirmBody } from './utils'

export { user, live, title, language }

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

async function language(
  ctx: ParameterizedContext<any, Router.RouterParamContext<any, any>, any>
) {
  const { user } = ctx.state
  await userCollection()
    .doc(user.username)
    .update({ language: ctx.request.body.language })
  ctx.status = 200
  ctx.body = confirmBody()
}
