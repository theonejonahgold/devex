type User = {
  username: string
  password?: string
  followers: User['username'][]
  following: User['username'][]
  streamKey: string
  createdAt: firestore.Timestamp
  updatedAt: firestore.Timestamp
}

type UserInput = {
  username: string
  password: string
}
