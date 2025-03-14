import { NextResponse, NextRequest } from "next/server";
import connectToMongo from "../../../../dbs/mongodb";
import CouponCounter from "../../../../models/couponCounterSchema";
import Claim from "../../../../models/couponClaim";

const couponList = ["COUPON1", "COUPON2", "COUPON3", "COUPON4", "COUPON5"];

const COOLDOWN_MS = 60000;

export async function POST(request: NextRequest) {

  await connectToMongo();

 
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "127.0.0.1";
  console.log("Client IP:", ip);

  const now = new Date();

 
  let existingClaim = await Claim.findOne({ ipAddress: ip }).sort({ claimed_at: -1 });

  if (existingClaim) {

    if (now.getTime() - existingClaim.claimed_at.getTime() < COOLDOWN_MS) {
      const timeLeftSec = Math.ceil(
        (COOLDOWN_MS - (now.getTime() - existingClaim.claimed_at.getTime())) / 1000
      );
      return NextResponse.json(
        { message: `Please wait ${timeLeftSec} seconds before claiming again.` },
        { status: 429 }
      );
    }
  }

  
  const cookieStore = request.cookies;
  let couponCount = Number(cookieStore.get("couponCount")?.value) || 0;
  couponCount++;

  
  const counter = await CouponCounter.findOneAndUpdate(
    { _id: "couponCounter" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seq = counter.seq;
  const couponIndex = seq % couponList.length;
  const assignedCoupon = couponList[couponIndex];

 
  if (existingClaim) {
    existingClaim = await Claim.findOneAndUpdate(
      { ipAddress: ip },
      {
        $push: { claimedCoupons: assignedCoupon },
        $set: { claimed_at: now },
        $inc: { totalClaims: 1 },
      },
      { new: true }
    );
  } else {
    existingClaim = await Claim.create({
      ipAddress: ip,
      claimedCoupons: [assignedCoupon],
      totalClaims: 1,
      claimed_at: now,
    });
  }

 
  const response = NextResponse.json({
    message: "Coupon claimed successfully",
    coupon: assignedCoupon,
    totalClaims: existingClaim.totalClaims,
    couponCount, 
  });
  response.cookies.set("couponCount", String(couponCount), {
    path: "/",
    httpOnly: true,
  });
  return response;
}