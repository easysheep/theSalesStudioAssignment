import { NextResponse, NextRequest } from "next/server";
import connectToMongo from "../../../../dbs/mongodb";
import Claim from "../../../../models/couponClaim";

export async function GET(request: NextRequest) {
 
    await connectToMongo();
  
 
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0] || "127.0.0.1";
    console.log("GET /api/claim-status - Client IP:", ip);
  
    // Find the claim record for this IP
    const claimRecord = await Claim.findOne({ ipAddress: ip });
    const totalClaims = claimRecord ? claimRecord.totalClaims : 0;
  
    return NextResponse.json({ totalClaims });
  }