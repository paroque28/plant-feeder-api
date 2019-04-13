'use strict';

import Hapi from 'hapi';
import mongoose from 'mongoose';

import createUserRoutes from './api/v1/user'
import createHumidityRoutes from './api/v1/humidity'
import createLuminosityRoutes from './api/v1/luminosity'
import createWaterPumpRoutes from './api/v1/waterpump'
import createPlantRoutes from './api/v1/plant'
import createPotHistoryRoutes from './api/v1/pot-history'
import createPotRoutes from './api/v1/pot'
import serial from './utils/serial'

// Create a server with a host and port
const server=Hapi.server({
    host:'0.0.0.0',
    port:80
});
server.route({
  method: 'GET',
  path:'/',
  handler: (request, h) => {
      return 'Welcome to PlantFeeder API!';
  }
});
createUserRoutes(server);
createHumidityRoutes(server);
createLuminosityRoutes(server);
createWaterPumpRoutes(server);
createPlantRoutes(server);
createPotHistoryRoutes(server);
createPotRoutes(server);

// Start the server
const start =  async function() {

    try {
      //Connect to mongo
      mongoose.connect('mongodb+srv://admin:d8v2j6bM6A9y94l9@demo-4mvsn.azure.mongodb.net/plantfeeder?retryWrites=true',
                        { useCreateIndex: true,
                          useNewUrlParser: true });

      mongoose.connection.once('open', () => {
        console.log('Connected to database!');
        serial.instance.updateSensors();
        serial.instance.waterPlants();
        server.start();
      })


    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);

};

start();
