import Plant from '../../../models/plant'
import Boom from 'boom'


function createPlantRoutes (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/plant',
      handler: function(request, reply){
        if(request.query.name){
          const { name } = request.query;
          return Plant.find({ name });
        }

        return Plant.find();
      },
    },
    {
      method: 'POST',
      path: '/api/v1/plant',
      handler: function(request, reply){
        if(request.payload == null){
          throw Boom.badRequest('Invalid query!');
        }
        const { name, minHumidity, description:description, imageURL:imageURL} = request.payload;
        let plant = null;
        try {
          plant = new Plant ({
            name: name, minHumidity:minHumidity, description:description, imageURL:imageURL
          });
        } catch (err) {
          throw Boom.badRequest(err);
        }
        return plant.save();
      }
    }
  ])
}

export default createPlantRoutes;
