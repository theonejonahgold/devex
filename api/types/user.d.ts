import type { firestore } from 'firebase-admin'

interface DBUser {
  username: string
  password: string
  followers: DBUser['username'][]
  following: DBUser['username'][]
  online: boolean
  streamKey: string
  createdAt: firestore.Timestamp
  updatedAt: firestore.Timestamp
}

type User = Omit<DBUser, 'password'>

type UserInput = Pick<DBUser, 'username' | 'password'>
