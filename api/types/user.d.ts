import type { firestore } from 'firebase-admin'

interface DBUser {
  username: string
  password: string
  following: DBUser['username'][]
  live: boolean
  viewers: number
  streamKey: string
  createdAt: firestore.Timestamp
  updatedAt: firestore.Timestamp
}

type User = Omit<DBUser, 'password'>

type UserInput = Pick<DBUser, 'username' | 'password'>
