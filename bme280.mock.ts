import { randomInt } from "node:crypto";

class Sensor {
  async read() {
    return {
      temperature: randomInt(20, 22) + Math.random(),
      pressure: randomInt(990, 1100) + Math.random(),
      humidity: randomInt(40, 90) + Math.random(),
    };
  }

  typicalMeasurement() {
    return 40;
  }
}

const bme280 = {
  async open() {
    return new Sensor();
  },
  OVERSAMPLE: {
    X1: 0,
    X2: 0,
    X16: 0,
  },
  FILTER: { F16: 0 },
};

export default bme280;
