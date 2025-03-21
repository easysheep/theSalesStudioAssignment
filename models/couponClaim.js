import mongoose, { Schema } from "mongoose";

const couponClaimSchema = new Schema({
  ipAddress: { type: String, required: true},
  claimedCoupons: [{ type: String }],
  totalClaims: { type: Number, default: 0 },
  claimed_at: { type: Date, default: Date.now }
});

export default mongoose.models.Claim || mongoose.model("Claim", couponClaimSchema);
