import { NextResponse, NextRequest } from "next/server";
import connectToMongo from "../../../../dbs/mongodb";
import CouponCounter from "../../../../models/couponCounterSchema";
import Claim from "../../../../models/couponClaim";

const couponList = ["COUPON1", "COUPON2", "COUPON3", "COUPON4", "COUPON5"];

const COOLDOWN_MS = 60 * 60 * 1000;

export async function POST(request: NextRequest) {
  // Connect to MongoDB.
  await connectToMongo();

  // Get the client IP from the headers, and if missing, default to 127.0.0.1
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "127.0.0.1";
  console.log("Client IP:", ip);

  const now = new Date();

  // Check if this IP has claimed a coupon within the cooldown period.
  const lastClaim = await Claim.findOne({ ip }).sort({ claimed_at: -1 });
  if (  
    lastClaim &&
    now.getTime() - lastClaim.claimed_at.getTime() < COOLDOWN_MS
  ) {
    const timeLeftSec = Math.ceil(
      (COOLDOWN_MS - (now.getTime() - lastClaim.claimed_at.getTime())) / 1000
    );
    return NextResponse.json(
      { message: `Please wait ${timeLeftSec} seconds before claiming again.` },
      { status: 429 }
    );
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

  // Record the claim in the database.
  await Claim.create({
    ipAddress: ip,
    claimed_at: now,
    coupon: assignedCoupon,
  });

  // Prepare the response and set/update the cookie.
  const response = NextResponse.json({
    message: "Coupon claimed successfully",
    coupon: assignedCoupon,
    couponCount,
  });
  response.cookies.set("couponCount", String(couponCount), {
    path: "/",
    httpOnly: true,
  });
  return response;
}
