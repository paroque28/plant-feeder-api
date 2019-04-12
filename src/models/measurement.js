import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MeasurementSchema = new Schema({
    sensorId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    datapoint: {
      type: Number,
      required: true,
    },
})

export default mongoose.model('Measurement', MeasurementSchema)
