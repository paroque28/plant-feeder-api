import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PotSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    humiditySensor: {
      type: String,
      required: true,
    },
    luminocitySensor: {
      type: String,
      required: true,
    },
    motorSensor: {
      type: Number,
      required: true,
    },
})

export default mongoose.model('Pot', PotSchema)
