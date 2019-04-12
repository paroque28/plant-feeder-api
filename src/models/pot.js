import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PotSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    plant: { type: Schema.Types.ObjectId, ref: 'Plant' },
    humiditySensor: {
      type: String,
      required: true,
    },
    luminositySensor: {
      type: String,
      required: true,
    },
    motorSensor: {
      type: Number,
      required: true,
    },
})

export default mongoose.model('Pot', PotSchema)
