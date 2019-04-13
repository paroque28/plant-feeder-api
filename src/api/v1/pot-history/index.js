import Boom from 'boom'
import Measurement from '../../../models/measurement'
import Pot from '../../../models/pot'


function createPotHistoryRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/pot-history',
      handler(request, reply) {
        if (request.query.potName) {
          const { potName, type } = request.query
          return new Promise(
            (resolve, reject) => {
              Pot.findOne({ name: potName }, 'humiditySensor luminositySensor', (err, pot) => {
                if (err) reject(Boom.badRequest(err))
                if (pot == null) reject(Boom.badRequest(`It doesn't exist pot with name ${potName}`))
                try {
                  const params = { sensorId: type == 'humidity' ? pot.humiditySensor : pot.luminositySensor, type }
                  Measurement.find(params, 'date datapoint')
                  .limit(10)
                  .sort('-date')
                  .exec((err, dataset) => {
                    if (err) reject(Boom.badRequest(err))
                    const result = []
                    for (const data of dataset) {
                      result.push(data.datapoint)
                    }
                    resolve(result)
                  })
                } catch (err) {
                  reject(Boom.badRequest(err))
                }
              })
          },
)
        }

          throw Boom.badRequest('You should provide a valid name')
      },
    },
    {
      method: 'POST',
      path: '/api/v1/pot-history',
      handler(request, reply) {
        if (request.payload == null) {
          throw Boom.badRequest('Invalid query!')
        }
        const { potName, type, datapoint } = request.payload
        return new Promise(
          (resolve, reject) => {
          Pot.findOne({ name: potName }, 'humiditySensor luminositySensor', (err, pot) => {
            if (err) reject(Boom.badRequest(err))
            if (pot == null) reject(Boom.badRequest(`It doesn't exist pot with name ${potName}`))
            let measurement = null
            try {
              if (type == 'humidity') {
 measurement = new Measurement({
                sensorId: pot.humiditySensor, type, date: new Date(), datapoint,
              })
} else if (type == 'luminosity') {
measurement = new Measurement({
                sensorId: pot.luminositySensor, type, date: new Date(), datapoint,
              })
} else {
                reject(Boom.badRequest(`Wrong Type: ${type}`))
              }
              resolve(measurement.save())
            } catch (err) {
              reject(Boom.badRequest(err))
            }
          })
        },
)
      },
    },
  ])
}

export default createPotHistoryRoutes
