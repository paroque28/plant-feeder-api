import mongoose from 'mongoose'

const { Schema } = mongoose

const UserSchema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    md5Password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
})

export default mongoose.model('User', UserSchema)
