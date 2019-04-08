import Boom from 'boom'
import serial from '../../../utils/serial'

function createTemperatureRoutes (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/temperature',
      handler: function(request, reply){
        if(request.query.id){
          const { id } = request.query;
          return serial.instance.temperature[id];
        }
        throw Boom.badRequest('No sensor specified!');
      },
    }
  ])
}

export default createTemperatureRoutes;
