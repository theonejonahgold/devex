import Router from '@koa/router'
import { ParameterizedContext } from 'koa'
import { languagesCollection, userCollection } from 'src/firebase'
import { DBUser } from 'types/user'
import { dataBody, errorBody } from './utils'

export { language, languages, discover }

async function discover(
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
