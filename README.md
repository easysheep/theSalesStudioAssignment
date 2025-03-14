= Coupon County Documentation
Author Name <author@example.com>
v1.0, {date}
:toc:
:toclevels: 2

== Overview

Coupon County is a web application that implements a round-robin coupon distribution system while preventing abuse through IP- and cookie-based cooldown strategies. Coupons are allocated fairly using a global counter and updated on each claim. This documentation explains the complete setup process, abuse prevention mechanisms, API endpoints, and frontend integration.

Website: https://couponcounty.vercel.app

== Setup Instructions

=== Prerequisites

* **Node.js & npm:** Install Node.js (v14 or later) along with npm.
* **MongoDB:**  
  - For local development, install MongoDB or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
  - Create a database (e.g., `couponDB`).
* **Git:** For cloning the repository.

=== Installation

1. Clone the repository:
https://github.com/easysheep/theSalesStudioAssignment



2. Install dependencies:

3. Configure environment variables by creating a `.env.local` file in the project root:

4. Run the application:


The application will be available at [http://localhost:3000](http://localhost:3000).

== MongoDB Setup

The application uses two primary collections:

=== CouponCounter Collection

* **Purpose:** Tracks the global coupon counter used for round-robin coupon assignment.
* **Schema Example:**
[source,js]
----
const couponCounterSchema = new Schema({
_id: { type: String, default: "couponCounter" },
seq: { type: Number, default: 0 }
});
----

=== Claims Collection

* **Purpose:** Stores coupon claim details for each IP address, enabling cooldown enforcement and tracking total claims.
* **Schema Example (using Mongoose with ES Modules):**
[source,js]
----
import mongoose, { Schema } from "mongoose";

const couponClaimSchema = new Schema({
ipAddress: { type: String, required: true },
claimedCoupons: [{ type: String }], // Coupon codes stored as strings
totalClaims: { type: Number, default: 0 },
claimed_at: { type: Date, default: Date.now }
});

export default mongoose.models.Claim || mongoose.model("Claim", couponClaimSchema);
----

== Abuse Prevention Strategies

=== 1. IP Address & Cooldown Enforcement

* **IP Tracking:**  
Each coupon claim records the user's IP address in the Claims collection. When a new claim is attempted, the system checks the most recent claim record for that IP.

* **Cooldown Check:**  
A cooldown period is enforced using a configurable constant (e.g., `COOLDOWN_MS = 60 * 1000` for a 1-minute cooldown).  
- If a claim is attempted before the cooldown expires, the API returns a JSON response (with an `isCooldown` flag and the remaining time) rather than processing the claim.

=== 2. Cookie-Based Tracking

* **Cookie Usage:**  
The system sets a cookie (named `couponCount`) to track the number of coupon claims made in the current browser session. This helps prevent abuse from rapid refreshes and displays the total claims count on the UI.

=== 3. Round-Robin Coupon Distribution

* **Global Coupon Counter:**  
A global counter in the CouponCounter collection is atomically incremented on each claim. The coupon is assigned based on: couponIndex = counter.seq % couponList.length
ensuring an even, sequential distribution of coupons.

=== 4. Upsert Claim Record

* **Single Document per IP:**  
Instead of creating multiple documents for each claim from the same IP, the system uses an upsert strategy:
- If a claim document exists for the IP, it is updated (with new coupon, updated timestamp, and incremented total claims).
- Otherwise, a new document is created.

This approach accurately enforces the cooldown and tracks the total number of claims per IP.

== API Routes

=== POST `/api/claim-coupon`

* **Functionality:**
- Connects to MongoDB and retrieves the client IP.
- Checks for an existing claim record for that IP.
- If a claim exists and the cooldown period is active, returns a JSON response with an `isCooldown` flag, a message, and the remaining time.
- Otherwise, increments the global coupon counter, assigns a coupon via round-robin logic, and upserts the claim record.
- Updates the `couponCount` cookie and returns the assigned coupon along with the updated claim counts.

=== GET `/api/claim-status`

* **Functionality:**
- Connects to MongoDB and retrieves the claim record for the client IP.
- Returns the total number of claims for that IP.

This endpoint allows the frontend to display the current claim count even before a new claim is made.

== Frontend Integration

* **Cooldown Feedback:**  
The frontend uses Framer Motion’s `AnimatePresence` to display a custom animated message if the user attempts to claim a coupon during an active cooldown period.

* **Coupon Claim Button:**  
When clicked, the button sends an API request to `/api/claim-coupon`. Based on the response:
- If `isCooldown` is true, the UI shows the animated cooldown message.
- If successful, the assigned coupon and updated claim count are displayed.

* **Document Link:**  
A document link (using Next.js’s Link component) is provided for accessing additional project documentation or resources.

== Conclusion

This documentation provides a complete guide for setting up and running the Coupon County application. The system uses a combination of IP tracking, cookie-based tracking, and an atomic round-robin assignment mechanism to ensure fair coupon distribution while preventing abuse. The API endpoints are designed to provide clear feedback to the frontend, ensuring a smooth user experience.

For any further questions or issues, please refer to the repository’s README or contact the development team.


