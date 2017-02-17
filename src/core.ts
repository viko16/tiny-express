'use strict'

import * as http from 'http'
import * as url from 'url'

const METHODS = ['get', 'post', 'put', 'delete', 'options', 'all']

interface IRoute {
  method: string,
  path: string,
  cb: Callback
}
interface ExpressLike {
  listen(port: number, hostname: string): void
  get: Function
  post: Function
  put: Function
  delete: Function
  options: Function,
  all: Function
}
type Callback = (req?: http.IncomingMessage, res?: http.ServerResponse) => void

/**
 * App
 */
class Application implements ExpressLike {
  private methods: string[]
  private routes: IRoute[]
  get(path: string, cb: Callback) { }
  post(path: string, cb: Callback) { }
  put(path: string, cb: Callback) { }
  delete(path: string, cb: Callback) { }
  options(path: string, cb: Callback) { }
  all(path: string, cb: Callback) { }

  constructor() {
    this.methods = METHODS
    this.routes = []
    this.bindMethod()
  }

  private bindMethod(): void {
    this.methods.forEach(method => {
      this[method] = (path: string, cb: any) => {
        this.routes.push({ method, path, cb })
      }
    })
  }

  private handleRouter(method: string, path: string) {
    return (req: http.IncomingMessage, res: http.ServerResponse) => {
      // Find routes
      for (const route of this.routes) {
        if ((route.method === method || route.method === 'all') && route.path === path) {
          route.cb(req, res)
          return
        }
      }

      // Not found
      res.statusCode = 404
      res.end('<h1>404</h1>')
    }
  }

  listen(port: number = 8080, hostname: string = '127.0.0.1') {
    const server: http.Server = http.createServer((request: http.IncomingMessage, response: http.ServerResponse) => {
      const method: string = request.method.toLowerCase().trim()
      const path: string = url.parse(request.url).pathname

      this.handleRouter(method, path)(request, response)
    })

    server.listen(port, hostname, () => {
      console.info(`Listening ${hostname}:${port}`)
    })
  }
}

export default new Application()
