import Student from '../../../models/student'


function createStudentRoutes (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/v1/students',
      handler: function(request, reply){
        return Student.find();
      },
    },
    {
      method: 'POST',
      path: '/api/v1/students',
      handler: function(request, reply){
        const { name, lastName, hobbies} = request.payload;
        const student = new Student ({
          name, lastName, hobbies
        })
        return student.save();
      }
    }
  ])
}

export default createStudentRoutes;
