import SerialPort from '@serialport/stream'
import MockBinding from '@serialport/binding-mock'
import Readline from '@serialport/parser-readline'

const SERIAL_KEY = Symbol.for("Serial");
var globalSymbols = Object.getOwnPropertySymbols(global);

// Mock
SerialPort.Binding = MockBinding;
MockBinding.createPort('/dev/ROBOT', { echo: true })

// Define port
const port = new SerialPort('/dev/ROBOT')

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
    temperature: {
      a: -1,
      b: -1,
      c: -1,
      d: -1,
    },
    lineHandler: function (line) {
      console.log(line);
      this.temperature.a = line;
    },

  };
  // Handle newlines inside object
  parser.on('data', line => global[SERIAL_KEY].lineHandler(line))
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
