import { NextResponse, NextRequest } from "next/server";
import connectToMongo from "../../../../dbs/mongodb";
import CouponCounter from "../../../../models/couponCounterSchema";
import Claim from "../../../../models/couponClaim";

const couponList = ["COUPON1", "COUPON2", "COUPON3", "COUPON4", "COUPON5"];

const COOLDOWN_MS = 60000;

export async function POST(request: NextRequest) {
  // Connect to MongoDB.
  await connectToMongo();

  // Get the client IP from the headers, defaulting to 127.0.0.1 for localhost.
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "127.0.0.1";
  console.log("Client IP:", ip);

  const now = new Date();

  // Look for an existing claim record for this IP.
  let existingClaim = await Claim.findOne({ ipAddress: ip }).sort({
    claimed_at: -1,
  });

  if (existingClaim) {
    // If the cooldown period hasn't expired, reject the request.
    if (now.getTime() - existingClaim.claimed_at.getTime() < COOLDOWN_MS) {
      const timeLeftSec = Math.ceil(
        (COOLDOWN_MS - (now.getTime() - existingClaim.claimed_at.getTime())) /
          1000
      );
      return NextResponse.json(
        {
          message: `Please wait ${timeLeftSec} seconds before claiming again.`,
        },
        { status: 429 }
      );
    }
  }

  // Retrieve the couponCount from cookies (if present) and increment it.
  const cookieStore = request.cookies;
  let couponCount = Number(cookieStore.get("couponCount")?.value) || 0;
  couponCount++;

  // Atomically increment the global coupon counter.
  const counter = await CouponCounter.findOneAndUpdate(
    { _id: "couponCounter" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const seq = counter.seq;
  const couponIndex = seq % couponList.length;
  const assignedCoupon = couponList[couponIndex];

  // If a record exists for this IP, update it; otherwise, create a new record.
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

  // Prepare the response and update the couponCount cookie.
  const response = NextResponse.json({
    message: "Coupon claimed successfully",
    coupon: assignedCoupon,
    totalClaims: existingClaim.totalClaims, // Total claims for this IP
    couponCount, // Claims count from this browser session
  });
  response.cookies.set("couponCount", String(couponCount), {
    path: "/",
    httpOnly: true,
  });
  return response;
}
