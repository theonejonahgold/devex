import * as admin from 'firebase-admin'
import { dbCollection } from './utils'
import { DBUser } from 'types/user'

const serviceAcc = require(process.env.GOOGLE_APPLICATION_CREDENTIALS!)

const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAcc),
  serviceAccountId:
    'firebase-adminsdk-dsvr8@devex-520d0.iam.gserviceaccount.com',
  projectId: 'devex-520d0',
})

export default function firebase() {
  return firebaseApp
}

export function userCollection() {
  return dbCollection(
    firebaseApp,
    'users'
  ) as FirebaseFirestore.CollectionReference<DBUser>
}
