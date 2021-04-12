import * as admin from 'firebase-admin'

export function dbCollection(fb: admin.app.App, collName: string) {
  return fb.firestore().collection(collName)
}
