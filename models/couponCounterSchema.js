const mongoose = require("mongoose");

const couponCounterSchema = new mongoose.Schema({
  _id: { type: String, default: "couponCounter" },
  seq: { type: Number, default: 0 }
});

// Check if the model already exists, otherwise compile it.
module.exports = mongoose.models.CouponCounter || mongoose.model("CouponCounter", couponCounterSchema);

