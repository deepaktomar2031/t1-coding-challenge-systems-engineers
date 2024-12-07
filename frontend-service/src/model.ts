import * as mongoose from 'mongoose';

const TradeDataSchema = new mongoose.Schema(
    {
        gtin: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String },
        brandName: { type: String, required: true },
        category: { type: String, required: true },
        color: { type: String, required: true },
        stock: { type: Number, required: true },
        price: { type: Number, required: true }
    },
    { timestamps: true }
);


export default mongoose.model('data', TradeDataSchema);