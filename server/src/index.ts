import Koa from 'koa'
import http from 'http'

main()

function main() {
  http.createServer(new Koa().callback()).listen(process.env.PORT || 5000)
}
