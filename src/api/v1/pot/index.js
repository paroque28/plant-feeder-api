import Pot from '../../../models/pot'
import Plant from '../../../models/plant'
import Boom from 'boom'
import serial from '../../../utils/serial'

function createPotRoutes (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/pot',
      handler: function(request, reply){
        let params  = {};
        if(request.query.name){
          params = {name : request.query.name};
        }
        return new Promise(
          (resolve, reject) => {
          Pot.find(params).lean().exec( function(err,pots) {
            if(err) reject(Boom.badRequest(err));
            if(pots == null) reject(Boom.badRequest(`Couldn't find any pot!`));
            for (let pot of pots){
              pot["humidity"] = 20;
              pot["luminosity"] = 500;
            }
            resolve(pots);
          }
          )
        });
      },
    },
    {
      method: 'POST',
      path: '/api/v1/water-pot',
      handler: function(request, reply){
        return new Promise(
          (resolve, reject) => {
          Pot.find({name : request.query.name}).exec( function(err,pots) {
            if(err) reject(Boom.badRequest(err));
            if(pots == null) reject(Boom.badRequest(`Couldn't find any pot!`));
            serial.instance.port.write( pots[0].motorSensor +'\n');
            resolve("Pot watered Succesfuly!");
          }
          )
        });
      },
    },
    {
      method: 'POST',
      path: '/api/v1/pot',
      handler: function(request, reply){
        if(request.payload == null){
          throw Boom.badRequest('Invalid query!');
        }
        const { name, plantName, humiditySensor, luminositySensor, motorSensor} = request.payload;
        if(humiditySensor.length > 1 || luminositySensor.length > 1 || motorSensor.length > 1){
          throw Boom.badRequest("Sensors Ids are one letter lenght");
        }
        return new Promise(
          (resolve, reject) => {
          Plant.findOne({name: plantName}, '_id',  function(err,plant) {
            if(err) reject(Boom.badRequest(err));
            if(plant == null) reject(Boom.badRequest(`It doesn't exist plant with name ${plantName}`));
            let pot = null;
            try {
              pot = new Pot ({
                name: name, plant: plant._id, humiditySensor: humiditySensor, luminositySensor:luminositySensor, motorSensor:motorSensor
              });
              resolve(pot.save());
            } catch (err) {
              reject(Boom.badRequest(err));
            }
          });
        });
      }
    },
  ])
}

export default createPotRoutes;
