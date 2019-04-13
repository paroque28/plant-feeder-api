import Boom from 'boom'
import Pot from '../../../models/pot'
import Plant from '../../../models/plant'
import serial from '../../../utils/serial'

function createPotRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/pot',
      handler(request) {
        let params = {}
        if (request.query.name) {
          params = { name: request.query.name }
        }
        return new Promise(
          (resolve, reject) => {
          Pot.find(params).lean().populate('plant').exec((err, pots) => {
            if (err) reject(Boom.badRequest(err))
            if (pots == null) reject(Boom.badRequest('Couldn\'t find any pot!'))
            for (const pot of pots) {
              pot.humidity = serial.instance.humidity[pot.humiditySensor]
              pot.luminosity = serial.instance.luminosity[pot.luminositySensor]
            }
            resolve(pots)
          })
        },
)
      },
    },
    {
      method: 'GET',
      path: '/api/v1/potname',
      handler(request) {
        let params = {}
        if (request.query.name) {
          params = { name: request.query.name }
        }
        return new Promise(
          (resolve, reject) => {
          Pot.find(params, 'name').lean().exec((err, pots) => {
            if (err) reject(Boom.badRequest(err))
            if (pots == null) reject(Boom.badRequest('Couldn\'t find any pot!'))
            let result = []
            for (let pot of pots)
            {
              result.push(pot.name)
            }
            resolve(result)
          })
        },
)
      },
    },
    {
      method: 'POST',
      path: '/api/v1/water-pot',
      handler(request) {
        return new Promise(
          (resolve, reject) => {
          Pot.find({ name: request.query.name }).exec((err, pots) => {
            if (err) reject(Boom.badRequest(err))
            if (pots == null) reject(Boom.badRequest('Couldn\'t find any pot!'))
            serial.instance.pump(pots[0].motorSensor)
            resolve('Pot watered Succesfuly!')
          })
        },
)
      },
    },
    {
      method: 'POST',
      path: '/api/v1/pot',
      handler(request) {
        if (request.payload == null) {
          throw Boom.badRequest('Invalid query!')
        }
        const {
 name, plantName, humiditySensor, luminositySensor, motorSensor,
} = request.payload
        if (humiditySensor.length > 1 || luminositySensor.length > 1 || motorSensor.length > 1) {
          throw Boom.badRequest('Sensors Ids are one letter lenght')
        }
        return new Promise(
          (resolve, reject) => {
          Plant.findOne({ name: plantName }, '_id', (err, plant) => {
            if (err) reject(Boom.badRequest(err))
            if (plant == null) reject(Boom.badRequest(`It doesn't exist plant with name ${plantName}`))
            let pot = null
            try {
              pot = new Pot({
                name, plant: plant._id, humiditySensor, luminositySensor, motorSensor,
              })
              resolve(pot.save())
            } catch (error) {
              reject(Boom.badRequest(error))
            }
          })
        },
)
      },
    },
  ])
}

export default createPotRoutes
