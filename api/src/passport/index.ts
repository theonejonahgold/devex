import { verify } from 'argon2'
import passport from 'koa-passport'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import { User } from 'types/user'
import { userCollection } from '../firebase'
import { secret } from '../utils'

// @ts-ignore
passport.serializeUser((user: User, done) => done(null, user.username))

passport.deserializeUser((username: string, done) => {
  userCollection()
    .doc(username)
    .get()
    .then(val => done(null, val.data()))
    .catch(done)
})

passport.use(
  new LocalStrategy({ session: false }, (username, password, done) =>
    userCollection()
      .doc(username)
      .get()
      .then(async val => {
        if (!val.exists) return done('Username incorrect', null)
        const user = val.data()!
        const correct = await verify(user.password!, password)
        if (!correct) return done('Password incorrect', false)
        return done(null, user)
      })
      .catch(error => {
        console.log(error)
        return done(error, null)
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
        .then(res => (res.exists ? res.data() : done(null, false)))
        .then(doc => done(null, doc))
        .catch(done)
    }
  )
)
