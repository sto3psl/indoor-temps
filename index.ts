import * as http from "node:http";
import { promises as fs } from "node:fs";
// @ts-ignore
import { WebSocketServer } from "ws";
console.log(process.env.NODE_ENV);
const { default: bme280 } =
  process.env.NODE_ENV === "production"
    ? await import("bme280")
    : await import("./bme280.mock");

async function startServer() {
  const server = http.createServer(async (req, res) => {
    const html = await fs.readFile("./index.html");
    res.setHeader("content-type", "text/html");
    res.writeHead(200);
    res.end(html);
  });

  const wss = new WebSocketServer({ server });

  const sensor = await bme280.open({
    i2cBusNumber: 1,
    i2cAddress: 0x77,
    humidityOversampling: bme280.OVERSAMPLE.X1,
    pressureOversampling: bme280.OVERSAMPLE.X16,
    temperatureOversampling: bme280.OVERSAMPLE.X2,
    filterCoefficient: bme280.FILTER.F16,
  });

  wss.on("connection", async (ws) => {
    ws.on("message", (message) => {
      console.log(message.toString());
    });

    ws.send(await getData(sensor));
    setInterval(async () => {
      ws.send(await getData(sensor));
    }, 2000);
  });

  server.listen(3001);
  console.log("Server listening on port: 3001");
}

startServer();

async function getData(sensor) {
  return JSON.stringify(await sensor.read());
}
