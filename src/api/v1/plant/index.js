import Boom from 'boom'
import Plant from '../../../models/plant'


function createPlantRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/plant',
      handler(request) {
        if (request.query.name) {
          const { name } = request.query
          return Plant.find({ name })
        }

        return Plant.find()
      },
    },
    {
      method: 'POST',
      path: '/api/v1/plant',
      handler(request) {
        if (request.payload == null) {
          throw Boom.badRequest('Invalid query!')
        }
        const {
 name, minHumidity, description, imageURL,
} = request.payload
        let plant = null
        try {
          plant = new Plant({
            name, minHumidity, description, imageURL,
          })
        } catch (err) {
          throw Boom.badRequest(err)
        }
        return plant.save()
      },
    },
  ])
}

export default createPlantRoutes
