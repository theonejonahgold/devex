import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '..', '.env') })
import Koa from 'koa'
import http from 'http'
import * as admin from 'firebase-admin'

main()

function main() {
  const app = admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  })
  http.createServer(new Koa().callback()).listen(process.env.PORT || 5000)
}
