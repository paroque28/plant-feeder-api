import cron from 'node-cron'
import os from 'os'
import SerialPort from '@serialport/stream'
import MockBinding from '@serialport/binding-mock'
import Readline from '@serialport/parser-readline'
import Measurement from '../models/measurement'
console.log(`Running on architecture:  ${os.arch()}`);

const SERIAL_KEY = Symbol.for("Serial");
var globalSymbols = Object.getOwnPropertySymbols(global);
let port = null;

if(os.arch() == "x64"){
  // Mock
  SerialPort.Binding = MockBinding;
  MockBinding.createPort('/dev/ROBOT', { echo: true })
  // Define port
  port = new SerialPort('/dev/ROBOT')
}
else if(os.arch() == "arm"){
  port = new SerialPort("/dev/ttyACM0", { baudRate: 115200 })
}
//Define parser
const parser = new Readline()
port.pipe(parser)

// SINGLETON CODE

// If instance doesnt exist
if (!(globalSymbols.indexOf(SERIAL_KEY) > -1)){
  global[SERIAL_KEY] = {
    port: port,
    humidity: {
      a: -1,
      b: -1,
      c: -1,
      d: -1,
    },
    luminosity: {
      a: -1,
      b: -1,
      c: -1,
      d: -1,
    },
    lineHandler: function (line) {
      let response = line.split(":");
      if(response.length == 2){
        if(response[0] == "a" || response[0] == "b" || response[0] == "c" || response[0] == "d"){
          let rawRead = parseInt(response[1]);
          if (rawRead< 400) rawRead = 400;
          this.humidity[response[0]] = Math.round(rawRead*0.16051364366 - 64.205457464);
          if(os.arch() == "arm"){
            let measure = new Measurement ({
              sensorId: response[0], type: "humidity", date: new Date(), datapoint: this.humidity[response[0]],
            });
            measure.save();
            console.log(`Humidity saved, sensor: ${response[0]}, value: ${this.humidity[response[0]]}`)
          }
        }
        else if (response[0] == "l"){
          this.luminosity.a = parseInt(response[1]);

          if(os.arch() == "arm"){
            let measure = new Measurement ({
              sensorId: response[0], type: "luminosity", date: new Date(), datapoint: this.luminosity.a,
            });
            measure.save();
            console.log(`Luminosity saved, sensor: ${response[0]}, value: ${response[1]}`);
          }
        }
        else if (response[0] == "p"){
          console.log(`Pumped sensor: ${response[1]}`);
        }

      }
    },
    updateSensors: function() {
      console.log('Updating data from sensors');
      port.write("labcd\n");
    },

  };
  // Handle newlines inside object
  parser.on('data', line => global[SERIAL_KEY].lineHandler(line))
  //Enable Cron jobs to update info
  cron.schedule('*/1 * * * *', () => {
    global[SERIAL_KEY].updateSensors();
  });
}

// Define the singleton API
var singleton = {};
Object.defineProperty(singleton, "instance", {
  get: function(){
    return global[SERIAL_KEY];
  }
});
Object.freeze(singleton);
// Export
export default singleton;
