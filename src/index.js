'use strict';

import Hapi from 'hapi';
import mongoose from 'mongoose';

import createStudentRoutes from './api/v1/student'

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});
createStudentRoutes(server);
// Add the route
server.route({
    method:'GET',
    path:'/hello',
    handler:function(request,h) {

        return'<h1>hello world</h1>';
    }
});


// Start the server
const start =  async function() {

    try {
      //Connect to mongo
      mongoose.connect('mongodb+srv://admin:d8v2j6bM6A9y94l9@demo-4mvsn.azure.mongodb.net/test?retryWrites=true',{ useNewUrlParser: true });

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
