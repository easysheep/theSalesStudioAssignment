// "use client";
// import { useState, useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGithub } from "@fortawesome/free-brands-svg-icons";
// import { faTicket } from "@fortawesome/free-solid-svg-icons";

// export default function Page() {
//   const [showIntro, setShowIntro] = useState(true);
//   const [isClaimed, setIsClaimed] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(60); // 10 minutes in seconds
//   const totalTime = 60; // Total duration (10 minutes)
//   const tickingSound = useRef<HTMLAudioElement | null>(null);

//   // Initialize ticking sound
//   useEffect(() => {
//     tickingSound.current = new Audio("/ticking.mp3"); // Make sure this file exists in /public
//   }, []);

//   // Function to start the timer
//   const buttonClicked = () => {
//     if (!isClaimed) {
//       setIsClaimed(true);
//       setTimeLeft(totalTime);

//       // Start playing ticking sound
//       if (tickingSound.current) {
//         tickingSound.current.loop = true;
//         tickingSound.current
//           .play()
//           .catch((err) => console.error("Audio play failed:", err));
//       }
//     }
//   };

//   // Timer logic with ticking sound control
//   useEffect(() => {
//     if (isClaimed && timeLeft > 0) {
//       const timer = setInterval(() => {
//         setTimeLeft((prevTime) => prevTime - 1);
//       }, 1000);

//       return () => clearInterval(timer);
//     }

//     if (timeLeft === 0) {
//       setIsClaimed(false);
//       // Stop ticking sound when timer ends
//       if (tickingSound.current) {
//         tickingSound.current.pause();
//         tickingSound.current.currentTime = 0;
//       }
//     }
//   }, [isClaimed, timeLeft]);

//   // Calculate progress percentage for circular progress bar
//   const progress = ((totalTime - timeLeft) / totalTime) * 100;

//   return (
//     <div className="h-screen flex flex-col justify-center items-center bg-dots">
//       {/* Intro Animation */}
//       {showIntro && (
//         <motion.div
//           className="fixed inset-0 bg-[#0AFF9D] flex flex-col justify-center items-center text-white text-4xl font-bold text-center"
//           initial={{ x: 0 }}
//           animate={{ x: "-100vw" }}
//           transition={{ duration: 1.6, ease: "easeInOut" }}
//           onAnimationComplete={() => setShowIntro(false)}
//         >
//           <p>Welcome to,</p>
//           <p className="font-extrabold text-6xl text-black tracking-wider mt-2">
//             Coupon County
//           </p>
//         </motion.div>
//       )}

//       {/* Main UI */}
//       {!showIntro && (
//         <div className="relative w-full h-full flex flex-col items-center justify-center">
//           <button className="absolute top-5 left-0 mx-2 border-0 px-3 py-2 text-[#0AFF9D] flex gap-3">
//             <motion.div
//               animate={{ rotate: 360 }}
//               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
//             >
//               <FontAwesomeIcon
//                 icon={faTicket}
//                 style={{
//                   color: "#0AFF9D",
//                   height: "35px",
//                 }}
//               />
//             </motion.div>

//             <p className="flex h-full items-center text-2xl">3x</p>
//           </button>
//           {/* Document Button - Top Right */}
//           <button className="absolute top-5 right-20 mx-2 border-2 border-[#0AFF9D] px-3 py-2 text-[#0AFF9D] cursor-pointer hover:text-white hover:border-white">
//             Document
//           </button>

//           <button className="absolute top-5 right-10 border-2 border-[#0AFF9D] px-3 py-2 text-[#0AFF9D] cursor-pointer hover:text-white hover:border-white">
//             <Link
//               href="https://github.com/easysheep/theSalesStudioAssignment"
//               legacyBehavior
//             >
//               <a target="_blank" rel="noopener noreferrer">
//                 <FontAwesomeIcon icon={faGithub} />
//               </a>
//             </Link>
//           </button>

//           {/* Centered Heading */}
//           <h1 className="absolute top-10 text-4xl font-bold text-center">
//             Coupon County
//           </h1>

//           {/* Coupon Button with Circular Progress */}
//           <div className="relative flex items-center justify-center">
//             {/* Circular Progress Ring */}
//             {isClaimed && (
//               <svg
//                 className="absolute h-80 w-80 transform -rotate-90"
//                 viewBox="0 0 100 100"
//               >
//                 {/* Background Circle */}
//                 <circle
//                   cx="50"
//                   cy="50"
//                   r="45"
//                   stroke="gray"
//                   strokeWidth="5"
//                   fill="none"
//                 />
//                 {/* Progress Circle (Filling Effect) */}
//                 <motion.circle
//                   cx="50"
//                   cy="50"
//                   r="45"
//                   stroke="#0AFF9D"
//                   strokeWidth="5"
//                   fill="none"
//                   strokeDasharray="282" // Circumference of the circle (2 * π * r)
//                   strokeDashoffset="282"
//                   animate={{ strokeDashoffset: 282 - (progress / 100) * 282 }}
//                   transition={{ duration: 1, ease: "linear" }}
//                 />
//               </svg>
//             )}

//             {/* Claim Button */}
//             <button
//               onClick={buttonClicked}
//               disabled={isClaimed}
//               className={`h-72 w-72 text-xl text-black font-bold rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center text-center
//                 ${
//                   isClaimed
//                     ? "bg-transparent text-white cursor-not-allowed"
//                     : "bg-[#0AFF9D] hover:bg-[#036940] active:scale-95"
//                 }
//               `}
//             >
//               {isClaimed
//                 ? `${Math.floor(timeLeft / 60)}:${String(
//                     timeLeft % 60
//                   ).padStart(2, "0")}`
//                 : "Claim Your Free Coupon Here"}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faTicket } from "@fortawesome/free-solid-svg-icons";

export default function Page() {
  const [showIntro, setShowIntro] = useState(true);
  const [isClaimed, setIsClaimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10); // 60 seconds for demo purposes
  const totalTime = 10; // Total duration in seconds
  const tickingSound = useRef<HTMLAudioElement | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [showSlideText, setShowSlideText] = useState(false);

  // Initialize ticking sound
  useEffect(() => {
    tickingSound.current = new Audio("/ticking.mp3"); // Ensure this file exists in /public
  }, []);

  // Function to start the timer and show the rising card
  const buttonClicked = () => {
    if (!isClaimed) {
      setIsClaimed(true);
      setTimeLeft(totalTime);
      setShowCard(true); // Show the rising card

      // Start playing ticking sound
      if (tickingSound.current) {
        tickingSound.current.loop = true;
        tickingSound.current
          .play()
          .catch((err) => console.error("Audio play failed:", err));
      }
      // Hide the card after 5 seconds and then show slide text after card exit animation
      setTimeout(() => {
        setShowCard(false);
        // Delay before showing slide text (adjust as needed)
        setTimeout(() => {
          setShowSlideText(true);
        }, 1000);
      }, 5000);
    }
  };

  // Timer logic with ticking sound control
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

  // Calculate progress percentage for circular progress bar
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
          {/* Left Top - Ticket Counter */}
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
            <p className="flex h-full items-center text-2xl">3x</p>
          </button>

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
            {/* Circular Progress Ring */}
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

            {/* Claim Button */}
            <button
              onClick={buttonClicked}
              disabled={isClaimed}
              className={`h-72 w-72  p-3 text-xl text-black font-bold rounded-full shadow-lg transition-all cursor-pointer flex items-center justify-center text-center ${
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

          {/* Rising Card Animation */}
          <AnimatePresence>
            {showCard && (
              <motion.div
                initial={{ x: -100, y: "100vh", opacity: 0 }}
                animate={{ x: -100, y: 0, opacity: 1 }}
                exit={{ x: -100, y: "100vh", opacity: 0 }}
                transition={{ duration: 2.5 }}
                className="fixed bottom-0 left-25 p-4 text-white bg-[#0AFF9D] rounded shadow-lg h-[200px] w-[500px]"
              >
                <p className="text-white font-extrabold text-5xl">
                  Congratulations, <br></br>Coupon <br></br>Claimed!
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
                <div className="">
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
