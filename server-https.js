const { createServer } = require('https')
const { readFileSync } = require('fs')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpsOptions = {
    key: readFileSync('/etc/ssl/private/server.key'),
    cert: readFileSync('/etc/ssl/certs/server.crt'),
  }

  createServer(httpsOptions, async (req, res) => {
    const parsedUrl = parse(req.url, true)
    await handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on https://${hostname}:${port}`)
  })
})