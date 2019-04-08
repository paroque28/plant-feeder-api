'use strict';

import Hapi from 'hapi';
import mongoose from 'mongoose';

import createUserRoutes from './api/v1/user'

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:80
});
createUserRoutes(server);

// Start the server
const start =  async function() {

    try {
      //Connect to mongo
      mongoose.connect('mongodb+srv://admin:d8v2j6bM6A9y94l9@demo-4mvsn.azure.mongodb.net/plantfeeder?retryWrites=true',
                        { useCreateIndex: true,
                          useNewUrlParser: true });

      mongoose.connection.once('open', () => {
        console.log('connected to database');
      })

        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

    console.log('Server running at:', server.info.uri);
};

start();
