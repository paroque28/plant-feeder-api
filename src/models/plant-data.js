import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PotDataSchema = new Schema({
    pot: { type: Schema.Types.ObjectId, ref: 'Pot' },
    type: {
      type: String,
      required: true,
    },
    datapoint: {
      type: Number,
      required: true,
    },
})

export default mongoose.model('PotData', PotDataSchema)
