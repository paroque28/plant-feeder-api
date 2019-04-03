import mongoose from 'mongoose';
const Schema = mongoose.Schema

const StudentSchema = new Schema({
    name: String,
    lastName: String,
    hobbies: [String]
})

export default mongoose.model('Student', StudentSchema)