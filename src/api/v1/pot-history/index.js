import PotHistory from '../../../models/pot-history'
import Pot from '../../../models/pot'
import Boom from 'boom'


function createPotHistoryRoutes (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/pot-history',
      handler: function(request, reply){
        if(request.query.potName){
          const { potName } = request.query;
          return PotHistory.find()
            .limit(10)
            .populate({
              path: 'pot',
              match: { name: potName},
              select: 'name'
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
          Pot.findOne({name: potName}, '_id',  function(err,pot) {
            if(err) reject(Boom.badRequest(err));
            if(pot == null) reject(Boom.badRequest(`It doesn't exist pot with name ${potName}`));
            let history = null;
            try {
              history = new PotHistory ({
                pot: pot._id, type: type, date: new Date(), datapoint: datapoint,
              });
              resolve(history.save());
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
