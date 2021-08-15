const http = require('http')
const fs = require('fs').promises

const { Server: WebSocketServer } = require('ws')

async function startServer () {
  const server = http.createServer(async (req, res) => {

    const html = await fs.readFile('./index.html') 
    res.setHeader('content-type', 'text/html')
    res.writeHead(200)
    res.end(html)
  })

  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    ws.on('message', message => {
      console.log(message.toString())
    })

    ws.send(getData())  
    setInterval(() => {
      ws.send(getData())
    }, 5000)
  }) 
  
  server.listen(3001)  
}

startServer()

function getData() {
  return JSON.stringify({
    temp: Math.random() + 24,
    humidity: Math.random() * 100,
    pressure: Math.random() * 1000
  })
}