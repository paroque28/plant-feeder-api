import Boom from 'boom'
import serial from '../../../utils/serial'

function createHumidityRoutes (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/humidity',
      handler: function(request, reply){
        if(request.query.id){
          const { id } = request.query;
          return serial.instance.humidity[id];
        }
        throw Boom.badRequest('No sensor specified!');
      }
    }
  ])
}

export default createHumidityRoutes;
