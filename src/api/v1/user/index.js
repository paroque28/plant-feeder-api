import User from '../../../models/user'
import crypto from 'crypto'
import Boom from 'boom'


function createUserRoutes (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/users',
      handler: function(request, reply){
        if(request.query.name){
          const { name } = request.query;
          return User.find({ name });
        }

        return User.find();
      },
    },
    {
      method: 'POST',
      path: '/api/v1/login',
      handler: async function(request, reply){
        if(request.payload == null){
          throw Boom.unauthorized('invalid parameters');
        }
        const { username, password} = request.payload;
        const hash = crypto.createHash('md5').update(password).digest("hex");
        let res = null;
        return new Promise(
          (resolve, reject) => {
          User.findOne({username: username}, 'md5Password',  function(err,user) {
            if(err) throw Boom.badRequest(err);
            if (user.md5Password == hash) {
              resolve("Authorized");
            }
            else {
              reject(Boom.unauthorized("Invalid username or password"));
            }
          });
        });
      },
    },
    {
      method: 'POST',
      path: '/api/v1/users',
      handler: function(request, reply){
        if(request.payload == null){
          throw Boom.badRequest('Invalid query!');
        }
        const { username, name, password} = request.payload;
        const hash = crypto.createHash('md5').update(password).digest("hex");
        let user = null;
        try {
          user =new User ({
            username: username, name: name, md5Password:  hash, role: "admin"
          });
        } catch (err) {
          throw Boom.badRequest(err);
        }
        return user.save();
      }
    }
  ])
}

export default createUserRoutes;
