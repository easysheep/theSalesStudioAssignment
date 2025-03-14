import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  assigned_count: { type: Number, default: 0 },
});



module.exports =mongoose.model("coupon",couponSchema);
