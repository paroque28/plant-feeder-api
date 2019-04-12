import Measurement from '../../../models/measurement'
import Pot from '../../../models/pot'
import Boom from 'boom'


function createPotHistoryRoutes (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/pot-history',
      handler: function(request, reply){
        if(request.query.potName){
          const { potName , type} = request.query;
          return new Promise(
            (resolve, reject) => {
              Pot.findOne({name: potName}, 'humiditySensor luminositySensor',  function(err,pot) {
                if(err) reject(Boom.badRequest(err));
                if(pot == null) reject(Boom.badRequest(`It doesn't exist pot with name ${potName}`));
                try {
                  let params = { sensorId: type == "humidity"? pot.humiditySensor : pot.luminositySensor, type: type};
                  Measurement.find(params, 'date datapoint')
                  .limit(10)
                  .sort('-date')
                  .exec(function(err,dataset) {
                    if(err) reject(Boom.badRequest(err));
                    let result = [];
                    for (let data of dataset){
                      result.push( data.datapoint);
                    }
                    resolve(result);
                  });
                } catch (err) {
                  reject(Boom.badRequest(err));
                }
              });

          });
        }
        else {
          throw Boom.badRequest("You should provide a valid name");
        }
      },
    },
    {
      method: 'POST',
      path: '/api/v1/pot-history',
      handler: function(request, reply){
        if(request.payload == null){
          throw Boom.badRequest('Invalid query!');
        }
        const { potName, type, datapoint} = request.payload;
        return new Promise(
          (resolve, reject) => {
          Pot.findOne({name: potName}, 'humiditySensor luminositySensor',  function(err,pot) {
            if(err) reject(Boom.badRequest(err));
            if(pot == null) reject(Boom.badRequest(`It doesn't exist pot with name ${potName}`));
            let measurement = null;
            try {
              if(type == "humidity")
              measurement = new Measurement ({
                sensorId: pot.humiditySensor, type: type, date: new Date(), datapoint: datapoint,
              });
              else if(type == "luminosity")
              measurement = new Measurement ({
                sensorId: pot.luminositySensor, type: type, date: new Date(), datapoint: datapoint,
              });
              else {
                reject(Boom.badRequest(`Wrong Type: ${type}`))
              }
              resolve(measurement.save());
            } catch (err) {
              reject(Boom.badRequest(err));
            }
          });
        });
      }
    }
  ])
}

export default createPotHistoryRoutes;
