"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link  from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from "@fortawesome/free-brands-svg-icons"; 
export default function Page() {
  const [showIntro, setShowIntro] = useState(true);
  const [isClaimed, setIsClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const totalTime = 10; // Total duration (10 minutes)

  const buttonClicked = () => {
    if (!isClaimed) {
      setIsClaimed(true);
      setTimeLeft(totalTime);
    }
  };

  // Timer logic
  useEffect(() => {
    if (isClaimed && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }

    if (timeLeft === 0) {
      setIsClaimed(false);
    }
  }, [isClaimed, timeLeft]);

  // Calculate percentage for circular progress
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-dots">
      {/* Intro Animation */}
      {showIntro && (
        <motion.div
          className="fixed inset-0 bg-[#0AFF9D] flex flex-col justify-center items-center text-white text-4xl font-bold text-center"
          initial={{ x: 0 }}
          animate={{ x: "-100vw" }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
          onAnimationComplete={() => setShowIntro(false)}
        >
          <p>Welcome to,</p>
          <p className="font-extrabold text-6xl text-black tracking-wider mt-2">
            Coupon County
          </p>
        </motion.div>
      )}

      {/* Main UI */}
      {!showIntro && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Document Button - Top Right */}
          <button className="absolute top-5 right-20 mx-2 border-2 border-[#0AFF9D] px-3 py-2 text-[#0AFF9D] cursor-pointer hover:text-white hover:border-white">
            Document
          </button>

          <button className="absolute top-5 right-10 border-2 border-[#0AFF9D] px-3 py-2 text-[#0AFF9D] cursor-pointer hover:text-white hover:border-white">
            <Link
              href="https://github.com/easysheep/theSalesStudioAssignment"
              legacyBehavior
            >
              <a target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} />
              </a>
            </Link>
          </button>

          {/* Centered Heading */}
          <h1 className="absolute top-10 text-4xl font-bold text-center">
            Coupon County
          </h1>

          {/* Coupon Button with Circular Progress */}
          <div className="relative flex items-center justify-center">
            {/* Circular Progress Ring (Fills up over 10 minutes) */}
            {isClaimed && (
              <svg
                className="absolute h-80 w-80 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="gray"
                  strokeWidth="5"
                  fill="none"
                />
                {/* Progress Circle (Filling Effect) */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#0AFF9D"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="282" // Circumference of the circle (2 * π * r)
                  strokeDashoffset="282"
                  animate={{ strokeDashoffset: 282 - (progress / 100) * 282 }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </svg>
            )}

            {/* Claim Button */}
            <button
              onClick={buttonClicked}
              disabled={isClaimed}
              className={`h-72 w-72 text-xl text-black font-bold  rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center text-center
                ${
                  isClaimed
                    ? "bg-white text-black cursor-not-allowed"
                    : "bg-[#0AFF9D] hover:bg-[#036940] active:scale-95"
                }
              `}
            >
              {isClaimed
                ? `${Math.floor(timeLeft / 60)}:${String(
                    timeLeft % 60
                  ).padStart(2, "0")}`
                : "Claim Your Free Coupon Here"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
