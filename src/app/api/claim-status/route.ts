import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Retrieve the couponCount from cookies.
  const couponCount = Number(request.cookies.get("couponCount")?.value) || 0;
  return NextResponse.json({ couponCount });
}
