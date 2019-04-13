import crypto from 'crypto'
import Boom from 'boom'
import User from '../../../models/user'


function createUserRoutes(server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/users',
      handler(request, reply) {
        if (request.query.name) {
          const { name } = request.query
          return User.find({ name })
        }

        return User.find()
      },
    },
    {
      method: 'POST',
      path: '/api/v1/login',
      async handler(request, reply) {
        if (request.payload == null) {
          throw Boom.unauthorized('invalid parameters')
        }
        const { username, password } = request.payload
        const hash = crypto.createHash('md5').update(password).digest('hex')
        const res = null
        return new Promise(
          (resolve, reject) => {
          User.findOne({ username }, 'md5Password', (err, user) => {
            if (err) throw Boom.badRequest(err)
            if (user.md5Password == hash) {
              resolve('Authorized')
            } else {
              reject(Boom.unauthorized('Invalid username or password'))
            }
          })
        },
)
      },
    },
    {
      method: 'POST',
      path: '/api/v1/users',
      handler(request, reply) {
        if (request.payload == null) {
          throw Boom.badRequest('Invalid query!')
        }
        const { username, name, password } = request.payload
        const hash = crypto.createHash('md5').update(password).digest('hex')
        let user = null
        try {
          user = new User({
            username, name, md5Password: hash, role: 'admin',
          })
          return user.save()
        } catch (err) {
          throw Boom.badRequest(err)
        }
      },
    },
  ])
}

export default createUserRoutes
