import cron from 'node-cron'
import os from 'os'
import MockBinding from '@serialport/binding-mock'
import Readline from '@serialport/parser-readline'
import Measurement from '../models/measurement'
import Pot from '../models/pot'

const SerialPort = os.arch() === 'x64' ? require('@serialport/stream') : require('serialport')

console.log(`Running on architecture:  ${os.arch()}`)

// Singleton
const SERIAL_KEY = Symbol.for('Serial')
const MAXIMUM_LUMINOSITY = 300
const globalSymbols = Object.getOwnPropertySymbols(global)


let port = null

if (os.arch() === 'x64') {
  // Mock
  SerialPort.Binding = MockBinding
  MockBinding.createPort('/dev/ROBOT', { echo: true })
  // Define port
  port = new SerialPort('/dev/ROBOT')
} else if (os.arch() === 'arm') {
  port = new SerialPort('/dev/ttyACM0', { baudRate: 115200 })
}
// Define parser
const parser = new Readline()
port.pipe(parser)

// SINGLETON CODE

// If instance doesnt exist
if (!(globalSymbols.indexOf(SERIAL_KEY) > -1)) {
  global[SERIAL_KEY] = {
    // Props
    humidity: {
      a: -1,
      b: -1,
      c: -1,
      d: -1,
    },
    luminosity: {
      l: -1,
      m: -1,
      n: -1,
      o: -1,
    },
    port,
    // Methods
    lineHandler(line) {
      const response = line.split(':')
      if (response.length === 2) {
        if (response[0] === 'a' || response[0] === 'b' || response[0] === 'c' || response[0] === 'd') {
          let rawRead = parseInt(response[1], 10)
          if (rawRead < 400) rawRead = 400
          this.humidity[response[0]] = Math.round(rawRead * 0.16051364366 - 64.205457464)
          if (os.arch() === 'arm') {
            const measure = new Measurement({
              sensorId: response[0], type: 'humidity', date: new Date(), datapoint: this.humidity[response[0]],
            })
            measure.save()
            console.log(`Humidity saved, sensor: ${response[0]}, value: ${this.humidity[response[0]]}`)
          }
        } else if (response[0] === 'l' || response[0] === 'm' || response[0] === 'n' || response[0] === 'o') {
          this.luminosity[response[0]] = parseInt(response[1], 10)

          if (os.arch() === 'arm') {
            const measure = new Measurement({
              sensorId: response[0], type: 'luminosity', date: new Date(), datapoint: this.luminosity[response[0]],
            })
            measure.save()
            console.log(`Luminosity saved, sensor: ${response[0]}, value: ${response[1]}`)
          }
        } else if (response[0] === 'p') {
          console.log(`Pumped sensor: ${response[1]}`)
        }
      }
    },
    pump(id) {
      if (os.arch() === 'arm') {
        this.port.write(`${id }\n`)
      }
    },
    updateSensors() {
      console.log('Updating data from sensors...')
      if (os.arch() === 'arm') {
        this.port.write('labcd\n')
      }
    },
    waterPlants() {
      const instance = this
      Pot.find({}, ' name humiditySensor luminositySensor motorSensor')
      .populate({ path: 'plant', select: 'minHumidity' })
      .exec((err, pots) => {
        if (err) console.log(err)
        for (const pot of pots) {
            console.log('------------------')
            const currentHumidity = instance.humidity[pot.humiditySensor]
            const currentLuminosity = instance.luminosity[pot.luminositySensor]
            console.log(`Pot: ${pot.name} Humidity: ${currentHumidity} Luminosity: ${currentLuminosity}.`)
            if (currentHumidity < pot.plant.minHumidity) {
              console.log(`Pot ${pot.name} needs more water! Current humidity: ${currentHumidity}`)
              if (currentLuminosity < MAXIMUM_LUMINOSITY) {
                console.log(`Pumping pot ${pot.name}.`)
                instance.pump(pot.motorSensor)
              } else {
                console.log(`Too much light on pot ${pot.name}.`)
              }
            }
        }
      })
    },

  }

  // Handle newlines inside object
  parser.on('data', line => global[SERIAL_KEY].lineHandler(line))
  // Enable Cron jobs to update info
  cron.schedule('*/1 * * * *', () => {
    global[SERIAL_KEY].updateSensors()
  })
  // Enable Cron for watering
  cron.schedule('*/1 * * * *', () => {
    global[SERIAL_KEY].waterPlants()
  })
}

// Define the singleton API
const singleton = {}
Object.defineProperty(singleton, 'instance', {
  get() {
    return global[SERIAL_KEY]
  },
})
Object.freeze(singleton)
// Export
export default singleton
