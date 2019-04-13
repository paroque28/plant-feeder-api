import Boom from 'boom'
import serial from '../../../utils/serial'

function createLuminosityRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/luminosity',
      handler(request, reply) {
        if (request.query.id) {
          const { id } = request.query
          return serial.instance.Luminosity[id]
        }
        throw Boom.badRequest('No sensor specified!')
      },
    },
  ])
}

export default createLuminosityRoutes
