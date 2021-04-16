import { verify } from 'argon2'
import passport from 'koa-passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { DBUser, User } from 'types/user'
import firebase, { userCollection } from '../firebase'
import { secret } from '../utils'

// @ts-ignore
passport.serializeUser((user: User, done) => done(null, user.username))

passport.deserializeUser((username: string, done) => {
  firebase()
    .firestore()
    .collection('users')
    .doc(username)
    .get()
    .then(val => done(null, val.data()))
    .catch(done)
})

passport.use(
  new LocalStrategy({ session: false }, (username, password, done) =>
    (userCollection().select('username', 'password') as FirebaseFirestore.Query<
      Pick<DBUser, 'username' | 'password'>
    >)
      .where('username', '==', username)
      .get()
      .then(async val => {
        const user = val.docs[0].data()
        if (!user) return done(null, null)
        const correct = await verify(user.password!, password)
        if (!correct) return done('Password incorrect', false)
        return done(null, user)
      })
  )
)

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: 'devex.jonahgold.dev',
      issuer: 'jonahgold.dev',
      secretOrKey: secret,
    },
    (jwtPayload, done) => {
      userCollection()
        .doc(jwtPayload.username)
        .get()
        .then(res => res.data())
        .then(doc => (doc ? done(null, doc) : done(null, false)))
        .catch(done)
    }
  )
)
