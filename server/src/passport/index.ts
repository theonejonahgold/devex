import { verify } from 'argon2'
import firebase, { userCollection } from '../firebase'
import passport from 'koa-passport'
import { Strategy as LocalStrategy } from 'passport-local'

// @ts-ignore
passport.serializeUser((user: User, done) => done(null, user.username))

passport.deserializeUser((username: string, done) => {
  firebase()
    .firestore()
    .collection('users')
    .doc(username)
    .get()
    .then(val => {
      console.log(val.data())
      done(null, val.data())
    })
    .catch(done)
})

passport.use(
  new LocalStrategy({}, (username, password, done) => {
    ;(userCollection().select(
      'username',
      'password',
      'followers',
      'following'
    ) as FirebaseFirestore.Query<
      Pick<User, 'username' | 'password' | 'followers' | 'following'>
    >)
      .where('username', '==', username)
      .get()
      .then(async val => {
        const user = val.docs[0].data()
        if (!user) return done(null, null)
        const correct = await verify(user.password!, password)
        if (!correct) return done('Password incorrect', false)
        delete user.password
        return done(null, user)
      })
  })
)
