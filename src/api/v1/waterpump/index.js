import Boom from 'boom'
import serial from '../../../utils/serial'

function createWaterPumpRoutes (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/v1/waterpump',
      handler: function(request, reply){
        if(request.query.id){
          const { id } = request.query;
          serial.instance.port.write(id+'\n');
          return id;
        }
        throw Boom.badRequest('No sensor specified!');
      },
    }
  ])
}

export default createWaterPumpRoutes;
