import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PotHistorySchema = new Schema({
    pot: { type: Schema.Types.ObjectId, ref: 'Pot' },
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

export default mongoose.model('PotHistory', PotHistorySchema)
