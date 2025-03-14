"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faTicket } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [ticketCount, setTicketCount] = useState<number>(0);
  const [showIntro, setShowIntro] = useState(true);
  const [isClaimed, setIsClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const totalTime = 60;
  const tickingSound = useRef<HTMLAudioElement | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [showSlideText, setShowSlideText] = useState(false);
  const [assignedCoupon, setAssignedCoupon] = useState<string | null>(null);

  useEffect(() => {
    tickingSound.current = new Audio("/ticking.mp3");
  }, []);

  useEffect(() => {
    const fetchClaimCount = async () => {
      try {
        const res = await fetch("/api/claim-status", { method: "GET" });
        const data = await res.json();
        setTicketCount(data.totalClaims);
      } catch (error) {
        console.error("Failed to fetch claim count", error);
      }
    };
    fetchClaimCount();
  }, []);

  const claimCoupon = async () => {
    try {
      const res = await fetch("/api/claim-coupon", { method: "POST" });
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        const text = await res.text();
        console.error("Failed to parse JSON, response text:", text);
        throw new Error("Invalid JSON response from API");
      }
      if (!res.ok) {
        alert(data.message || "Error claiming coupon");
        return;
      }

      setAssignedCoupon(data.coupon);
      setIsClaimed(true);
      setTimeLeft(totalTime);
      setShowCard(true);
      setTicketCount(data.totalClaims);

      if (tickingSound.current) {
        tickingSound.current.loop = true;
        tickingSound.current
          .play()
          .catch((err) => console.error("Audio play failed:", err));
      }
      setTimeout(() => {
        setShowCard(false);
        setTimeout(() => {
          setShowSlideText(true);
        }, 1000);
      }, 5000);
    } catch (error) {
      console.error("Error in claimCoupon:", error);
    }
  };

  useEffect(() => {
    if (isClaimed && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0) {
      setIsClaimed(false);
      setTimeout(() => {
        setShowSlideText(false);
      }, 1000);
      if (tickingSound.current) {
        tickingSound.current.pause();
        tickingSound.current.currentTime = 0;
      }
    }
  }, [isClaimed, timeLeft]);

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-dots">
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

      {!showIntro && (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <button className="absolute top-5 left-0 mx-2 border-0 px-3 py-2 text-[#0AFF9D] flex gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <FontAwesomeIcon
                icon={faTicket}
                style={{ color: "#0AFF9D", height: "35px" }}
              />
            </motion.div>
            <p className="flex h-full items-center text-2xl">{ticketCount}x</p>
          </button>
          <Link
            href="/documentation.adoc"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-5 right-20 mx-2 border-2 border-[#0AFF9D] px-3 py-2 text-[#0AFF9D] cursor-pointer hover:text-white hover:border-white"
          >
            Document
          </Link>
          <Link
            href="https://github.com/easysheep/theSalesStudioAssignment"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-5 right-10 border-2 border-[#0AFF9D] px-3 py-2 text-[#0AFF9D] cursor-pointer hover:text-white hover:border-white"
          >
            <FontAwesomeIcon icon={faGithub} />
          </Link>

          <h1 className="absolute top-10 text-4xl font-bold text-center">
            Coupon County
          </h1>

          <div className="relative flex items-center justify-center">
            {isClaimed && (
              <svg
                className="absolute h-80 w-80 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="gray"
                  strokeWidth="5"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#0AFF9D"
                  strokeWidth="5"
                  fill="none"
                  strokeDasharray="282"
                  strokeDashoffset="282"
                  animate={{ strokeDashoffset: 282 - (progress / 100) * 282 }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </svg>
            )}

            <button
              onClick={claimCoupon}
              disabled={isClaimed}
              className={`h-72 w-72 p-3 text-xl text-black font-bold rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center text-center ${
                isClaimed
                  ? "bg-transparent text-white cursor-not-allowed"
                  : "bg-[#0AFF9D] hover:bg-[#036940] active:scale-95"
              }`}
            >
              {isClaimed
                ? `${Math.floor(timeLeft / 60)}:${String(
                    timeLeft % 60
                  ).padStart(2, "0")}`
                : "Claim Your Free Coupon Here"}
            </button>
          </div>

          <AnimatePresence>
            {showCard && (
              <motion.div
                initial={{ x: -100, y: "100vh", opacity: 0 }}
                animate={{ x: -100, y: 0, opacity: 1 }}
                exit={{ x: -100, y: "100vh", opacity: 0 }}
                transition={{ duration: 2.5 }}
                className="fixed bottom-0 left-25 p-4 text-white bg-[#0AFF9D] rounded shadow-lg h-[230px] w-[500px]"
              >
                <p className="text-white font-extrabold text-5xl">
                  Congratulations, <br />
                  {assignedCoupon} <br />
                  Claimed!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSlideText && (
              <motion.div
                key="slideText"
                initial={{ x: "100vw", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100vw", opacity: 0 }}
                transition={{ duration: 1 }}
                className="fixed bottom-5 right-10 p-4 bg-transparent text-white rounded shadow-lg h-[500px] w-[400px]"
              >
                <div>
                  <p className="text-[#0AFF9D] text-6xl font-extrabold">
                    Wait for the cooldown,
                  </p>
                  <p className="text-white text-5xl font-extrabold">
                    to claim coupon again
                  </p>
                  <p className="text-[#0AFF9D] text-4xl font-extrabold">
                    Stay Tuned!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
