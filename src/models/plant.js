import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PlantSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    minHumidity: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
})

export default mongoose.model('Plant', PlantSchema)
