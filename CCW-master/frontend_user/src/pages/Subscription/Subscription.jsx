// import { useState, useRef } from "react";


// import bgImage from "../../assets/Subscription.png";

// // ICONS


// // ASSETS
// import card1 from "../../assets/card1.png";
// import card2 from "../../assets/card2.png";


// // COMPONENTS
// import Footer from "../../component/Footer";
// import Uparrow from "../../assets/Landing/Uparrow.png";

// import Header from "../../component/Header";
// import { div } from "framer-motion/client";


// const Subscription = () => {
//   const cardsRef = useRef(null); // ✅ ONE ref only

//   const [billing, setBilling] = useState("monthly");
//   const [activeIndex, setActiveIndex] = useState(0);

//   const totalCards = 3;
//   const CARD_WIDTH = 320; // card width + gap

//   const scrollLeft = () => {
//     if (!cardsRef.current) return;

//     cardsRef.current.scrollBy({
//       left: -CARD_WIDTH,
//       behavior: "smooth",
//     });
//   };

//   const scrollRight = () => {
//     if (!cardsRef.current) return;

//     cardsRef.current.scrollBy({
//       left: CARD_WIDTH,
//       behavior: "smooth",
//     });
//   };


// const pricing = {
//   free: {
//     monthly: { price: "$0", note: "/month" },
//     annual: { price: "$110", note: "/month" },
//   },
//   pro: {
//     monthly: { price: "$20", note: "/month" },
//     annual: { price: "$180", note: "/month" },
//   },
//   agent: {
//     monthly: { price: "$40", note: "/month" },
//     annual: { price: "$320", note: "/month" },
//   },
// };


//   const [users, setUsers] = useState(1);

//   const [proUsers, setProUsers] = useState(2);

//   const [agentUsers, setAgentUsers] = useState(5);


  

// return (
  
//   <div
//     className="
//       min-h-screen
//       w-full
//       text-white
//       pt-24
//       px-4
//       bg-cover
//       bg-center
//       bg-no-repeat
//       relative
//       overflow-x-hidden   /* ✅ no side movement */
//     "
//     style={{
//       backgroundImage: `url(${bgImage})`,
//       backgroundAttachment: "fixed", /* ✅ bg stays fixed */
//     }}
//   >


//       {/* OVERLAY */}
//       <div className="absolute inset-0 bg-[#d9d9d9]/10 backdrop-blur-[1px]" />
// <div className="mt-[-80px]">
//   <Header />
// </div>

//       <div className="relative z-10">

//         {/* HEADER */}
//         <div className="text-center mb-20">
//           <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
//             Simple Pricing, <br /> Powerful Features
//           </h1>

//           <p className="text-white text-lg font-semibold mt-4 drop-shadow-md">
//             Simple, transparent pricing that grows with you. Try any plan free for 30 days.
//           </p>

//          {/* TOGGLE */}
// <div className="flex justify-center mt-8">
//   <div className="flex rounded-full p-1 bg-[#2D0A4A] border border-white ring-1 ring-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.25)]">

//     {/* MONTHLY */}
//     <button
//       onClick={() => setBilling("monthly")}
//       className={`px-6 py-2 rounded-full font-semibold text-sm
//         ${billing === "monthly"
//           ? "bg-white text-black"
//           : "text-white hover:text-gray-200"
//         }`}
//     >
//       Monthly billing
//     </button>

//     {/* ANNUAL */}
//     <button
//       onClick={() => setBilling("annual")}
//       className={`px-6 py-2 rounded-full font-semibold text-sm
//         ${billing === "annual"
//           ? "bg-white text-black"
//           : "text-white hover:text-gray-200"
//         }`}
//     >
//       Annual billing
//     </button>

//   </div>
// </div>

//         </div>

//        {/* CARDS CONTAINER */}
// <div
//   ref={cardsRef}
//   className="
//     max-w-[1200px]
//     mx-auto

//     flex
//     flex-nowrap
//     gap-6
//     overflow-x-auto
//     snap-x
//     snap-mandatory
//     px-4

//     md:grid
//     md:grid-cols-3
//     md:gap-10
//     md:overflow-visible
//     md:px-0

//     items-start
//     no-scrollbar
//   "
// >


  
// {/* SECTION TITLE — DESKTOP ONLY */}
// <div
//   className="
//     col-span-full
//     px-4

//     hidden          /* 📱 hide on mobile */
//     md:block        /* 🖥 show on desktop */

//     mb-6
//     md:mb-0
//   "
// >
//   <h2 className="text-white text-[26px] md:text-4xl font-extrabold">
//     UpGrade Plan
//   </h2>

//   <p className="text-white text-[16px] md:text-2xl font-semibold">
//     Select a plan that matches your needs.
//   </p>
// </div>



// {/* ================= FIRST CARD ================= */}
// <div className="snap-center shrink-0">
//   <div
//     className="
//       min-w-[280px]
//       w-[280px]
//       lg:min-w-0

//       h-[740px]
//       lg:h-[959px]

//       lg:w-full
//       lg:max-w-[384px]

//       rounded-[24px]
//       lg:rounded-[20px]
//       p-4 
//       sm:p-10

//       text-center
//       relative
//       flex flex-col
//       overflow-hidden

//       mx-auto 
//       lg:mx-0 

//       transition-all duration-300 ease-in-out

//       /* 🖥 DESKTOP HOVER */
//       hover:-translate-y-2
//       hover:border-[3px] hover:border-[#FFD700]
//       hover:shadow-[0_0_40px_14px_rgba(255,215,0,0.85)]

//       /* 📱 MOBILE / TOUCH */
//       active:-translate-y-2
//       active:border-[3px] active:border-[#FFD700]
//       active:shadow-[0_0_40px_14px_rgba(255,215,0,0.85)]

//       focus-visible:-translate-y-2
//       focus-visible:border-[3px] focus-visible:border-[#FFD700]
//       focus-visible:shadow-[0_0_40px_14px_rgba(255,215,0,0.85)]
//     "
//     tabIndex={0}
//     style={{
//       backgroundImage: `url(${card1})`,
//       backgroundSize: "cover",
//       backgroundPosition: "center",
//     }}
//   >


//     {/* ICON */}
//     <div className="absolute top-6 sm:top-14 left-1/2 -translate-x-1/2 z-10">
//       <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#3e1c71] rounded-full border border-white/10 shadow-lg">
//         <svg 
//           className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
//           xmlns="http://www.w3.org/2000/svg" 
//           viewBox="0 0 24 24" 
//           fill="none" 
//           stroke="currentColor" 
//           strokeWidth="2.5" 
//           strokeLinecap="round" 
//           strokeLinejoin="round"
//         >
//           <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
//         </svg>
//       </div>
//     </div>

//     {/* TOP CONTENT */}
//     <div className="pt-16 sm:pt-24 flex flex-col items-center">
//       <h3 className="text-[18px] sm:text-[22px] font-semibold text-white mb-0.5">
//         Free plan
//       </h3>

//       <p className="text-[36px] sm:text-[52px] font-extrabold text-white leading-[1] flex items-end gap-1">
//         {pricing.free[billing].price}
//         <span className="text-[14px] sm:text-[18px] font-medium mb-1">
//           {pricing.free[billing].note}
//         </span>
//       </p>
//     </div>

// {/* USER SELECTOR */}
// <div className="h-[60px] sm:h-[80px] flex items-center justify-center mt-4 sm:mt-5">
//   <div className="bg-white px-5 sm:px-8 py-2 sm:py-3 rounded-full flex items-center gap-5 sm:gap-8 text-black font-semibold shadow-lg">
//     <button
//       onClick={() => setUsers((u) => Math.max(1, u - 1))}
//       className="text-[20px] sm:text-[22px] font-bold leading-none cursor-pointer select-none"
//     >
//       −
//     </button>

//     <span className="tracking-wide select-none text-[12px] sm:text-base whitespace-nowrap">
//       {users} USER
//     </span>

//     <button
//       onClick={() => setUsers((u) => u + 1)}
//       className="text-[20px] sm:text-[22px] font-bold leading-none cursor-pointer select-none"
//     >
//       +
//     </button>
//   </div>
// </div>


//     {/* FEATURES */}
//     <div className="mt-4 sm:mt-8 mb-4 text-left flex-1">
//       <ul className="space-y-2 sm:space-y-6 text-white text-[12px] sm:text-[15px] leading-tight sm:leading-relaxed">
//         <li className="font-semibold text-[13px] sm:text-[16px]">
//           Create a basic creator profile :
//         </li>

//         {[
//           "Access collaboration search (limited)",
//           "Send up to 5 invites per month",
//           "Join 1 active workspace",
//           "Basic messaging (Twilio)",
//           "Upload files up to 1 GB storage",
//           "Access community forum (read-only)",
//           "Email support (standard)",
//         ].map((item) => (
//           <li key={item} className="flex items-start gap-2 sm:gap-3">
//             <div className="mt-[2px] flex items-center justify-center w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-[1.5px] sm:border-[2px] border-white bg-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.85)] shrink-0">
//               <svg className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="20 6 9 17 4 12" />
//               </svg>
//             </div>
//             <span className="flex-1 line-clamp-1">{item}</span>
//           </li>
//         ))}
//       </ul>
//     </div>

//     {/* ACTIVE BUTTON */}
//     <div className="w-full flex justify-center mt-auto pb-2 sm:pb-8">
//       <button
//         className="
//           w-full
//           sm:w-[92%]
//           py-3 sm:py-4
//           rounded-full
//           font-semibold
//           text-[14px] sm:text-[16px]
//           text-white
//           bg-transparent
//           border-[2px] border-white
//           ring-1 ring-white/60
//           transition-all duration-300
//           hover:bg-white
//           hover:text-black
//         "
//       >
//         Active
//       </button>
//     </div>

//   </div>
// </div>


// {/* ================= SECOND CARD (FIXED HEIGHT - NO SCROLL) ================= */}
// <div
//   className="
//     /* 🔹 MOBILE CAROUSEL BEHAVIOR */
//     min-w-[280px]
//     w-[280px]
//     snap-center

//     /* 🔹 DESKTOP RESET */
//     lg:min-w-0

//     /* 🔒 FIXED HEIGHT - SYNCED WITH CARD 3 */
//     h-[740px]
//     lg:h-[959px]

//     /* Width: Fluid on mobile, fixed on desktop */
//     lg:w-full
//     lg:max-w-[384px]

//     rounded-[24px]
//     lg:rounded-[20px]
//     p-4 
//     sm:p-10
    
//     text-center
//     relative
//     flex flex-col
//     overflow-hidden

//     mx-auto 
//     lg:mx-0 

//     transition-all duration-300 ease-in-out
//     hover:-translate-y-2
//     hover:border-[3px] hover:border-[#FFD700]
//     hover:shadow-[0_0_40px_14px_rgba(255,215,0,0.85)]
//   "
//   style={{
//     background:
//       "linear-gradient(180deg, #7B3BCF 0%, #5C2FB1 25%, #3E1E78 55%, #26163B 100%)",
//   }}
// >

//   {/* ICON */}
//   <div className="absolute top-6 sm:top-14 left-1/2 -translate-x-1/2 z-10">
//     <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#3e1c71] rounded-full border border-white/10 shadow-lg">
//       <svg 
//         className="w-5 h-5 sm:w-6 sm:h-6 text-white" 
//         viewBox="0 0 24 24" 
//         fill="none" 
//         stroke="currentColor" 
//         strokeWidth="2.5" 
//         strokeLinecap="round" 
//         strokeLinejoin="round"
//       >
//         <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
//       </svg>
//     </div>
//   </div>

//   {/* HEADER */}
//   <div className="pt-16 sm:pt-24 flex flex-col items-center">
//     <h3 className="text-[18px] sm:text-[22px] font-semibold text-white mb-0.5">
//       Pro plan
//     </h3>

//     <p className="text-[36px] sm:text-[50px] font-extrabold text-white leading-[1] flex items-end gap-1">
//       {pricing.pro[billing].price}
//       <span className="text-[14px] sm:text-[18px] font-medium mb-1">
//         {pricing.pro[billing].note}
//       </span>
//     </p>

//     <p className="text-white/85 text-[12px] sm:text-[15px] mt-1">
//       Billed {billing === "monthly" ? "monthly" : "annually"}.
//     </p>
//   </div>

//   {/* USER SELECTOR */}
//   <div className="h-[60px] sm:h-[80px] flex items-center justify-center mt-2 sm:mt-4">
//     <div className="bg-white px-5 sm:px-8 py-2 sm:py-3 rounded-full flex items-center gap-5 sm:gap-8 text-black font-semibold shadow-lg">
//       <button
//         onClick={() => setProUsers((u) => Math.max(1, u - 1))}
//         className="text-[20px] sm:text-[22px] font-bold leading-none cursor-pointer select-none"
//       >
//         −
//       </button>

//       <span className="tracking-wide select-none text-[12px] sm:text-base whitespace-nowrap">
//         {proUsers} USER
//       </span>

//       <button
//         onClick={() => setProUsers((u) => u + 1)}
//         className="text-[20px] sm:text-[22px] font-bold leading-none cursor-pointer select-none"
//       >
//         +
//       </button>
//     </div>
//   </div>

//   {/* FEATURES CONTENT - Tightened for Mobile */}
//   <div className="mt-4 sm:mt-8 mb-4 text-left flex-1">
//     <h4 className="text-white font-semibold text-[13px] sm:text-[16px] mb-2 sm:mb-4">
//       Everything in Basic, plus :
//     </h4>

//     <ul className="space-y-1.5 sm:space-y-3 text-white text-[11.5px] sm:text-[15px] leading-tight sm:leading-6">
//       {[
//         "Unlimited collaboration invites",
//         "Join or create up to 5 active workspaces",
//         "Advanced messaging (read receipts, task tagging)",
//         "10 GB storage for workspace uploads",
//         "Priority placement in collaboration search",
//         "Access to resource marketplace",
//       ].map((item) => (
//         <li key={item} className="flex items-start gap-2 sm:gap-3 text-white">
//           <div className="mt-[2px] flex items-center justify-center w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-[1.5px] sm:border-[2px] border-white bg-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.85)] shrink-0">
//             <svg className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
//               <polyline points="20 6 9 17 4 12" />
//             </svg>
//           </div>
//           <span className="flex-1 line-clamp-1">{item}</span>
//         </li>
//       ))}

//       <li className="pt-1.5 sm:pt-2 text-white font-semibold text-[12px] sm:text-[16px]">
//         Workspace tools:
//       </li>

//       {[
//         "Task boards (Trello-style)",
//         "Shared library",
//         "Calendar sync (Google Calendar)",
//         "Priority email + chat support",
//       ].map((item) => (
//         <li key={item} className="flex items-start gap-2 sm:gap-3 text-white">
//           <div className="mt-[2px] flex items-center justify-center w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full border-[1.5px] sm:border-[2px] border-white bg-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.85)] shrink-0">
//             <svg className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
//               <polyline points="20 6 9 17 4 12" />
//             </svg>
//           </div>
//           <span className="flex-1 line-clamp-1">{item}</span>
//         </li>
//       ))}
//     </ul>
//   </div>

//   {/* UPGRADE BUTTON */}
//   <div className="w-full flex justify-center mt-auto pb-2 sm:pb-8">
//     <button
//   className="
//     w-full
//     sm:w-[90%]
//     py-3 sm:py-4
//     rounded-full
//     font-semibold
//     text-[14px] sm:text-[16px]
//     text-white
//     bg-transparent

//     border-2 border-white
//     ring-1 ring-white/60

//     shadow-[0_0_0_1px_rgba(255,255,255,0.6)]
//     transition-all duration-300

//     hover:bg-white
//     hover:text-black
//   "
// >
//   Upgrade to Pro
// </button>

//   </div>
// </div>


// {/* ================= THIRD CARD (FIXED HEIGHT - NO SCROLL) ================= */}
// <div
//   className="
//     /* 🔹 MOBILE CAROUSEL BEHAVIOR */
//     min-w-[280px]
//     w-[280px]
//     snap-center

//     /* 🔹 DESKTOP RESET */
//     lg:min-w-0

//     /* 🔒 FIXED HEIGHT - SYNCED */
//     h-[740px]
//     lg:h-[959px]

//     /* Width: Fluid on mobile, fixed on desktop */
//     lg:w-full
//     lg:max-w-[384px]

//     rounded-[24px]
//     lg:rounded-[20px]
//     p-4 
//     sm:p-10
    
//     text-center
//     relative
//     flex flex-col
//     overflow-hidden

//     mx-auto 
//     lg:mx-0 

//     transition-all duration-300 ease-in-out
//     hover:-translate-y-2
//     hover:border-[3px] hover:border-[#FFD700]
//     hover:shadow-[0_0_40px_14px_rgba(255,215,0,0.85)]
//   "
//   style={{
//     backgroundImage: `url(${card2})`,
//     backgroundSize: "cover",
//     backgroundPosition: "center",
//   }}
// >

//   {/* ICON */}
//   <div className="absolute top-6 sm:top-14 left-1/2 -translate-x-1/2 z-10">
//     <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-[#351a66] rounded-full shadow-lg border border-white/10">
//       <svg
//         className="w-5 h-5 sm:w-6 sm:h-6 text-white"
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2.2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <polygon points="12 3 3 8 12 13 21 8 12 3" />
//         <polyline points="3 12 12 17 21 12" />
//         <polyline points="3 16 12 21 21 16" />
//       </svg>
//     </div>
//   </div>

//   {/* TOP CONTENT */}
//   <div className="pt-16 sm:pt-24 flex flex-col items-center">
//     <h3 className="text-[18px] sm:text-[22px] font-semibold text-white mb-0.5">
//       Agent plan
//     </h3>

//     <p className="text-[36px] sm:text-[50px] font-extrabold text-white leading-[1] flex items-end gap-1">
//       {pricing.agent[billing].price}
//       <span className="text-[14px] sm:text-[18px] font-medium mb-1">
//         {pricing.agent[billing].note}
//       </span>
//     </p>

//     <p className="text-white/80 text-[12px] sm:text-[15px] mt-1">
//       {billing === "monthly" ? "Billed monthly." : "Billed annually."}
//     </p>
//   </div>

//   {/* USER SELECTOR */}
//   <div className="h-[60px] sm:h-[80px] flex items-center justify-center mt-2 sm:mt-4">
//     <div className="bg-white px-5 sm:px-8 py-2 sm:py-3 rounded-full flex items-center gap-5 sm:gap-8 text-black font-semibold shadow-lg">
//       <button
//         onClick={() => setAgentUsers((u) => Math.max(1, u - 1))}
//         className="text-[20px] sm:text-[22px] font-bold leading-none cursor-pointer"
//       >
//         −
//       </button>
//       <span className="tracking-wide select-none text-[12px] sm:text-base whitespace-nowrap">
//         {agentUsers} USER
//       </span>
//       <button
//         onClick={() => setAgentUsers((u) => u + 1)}
//         className="text-[20px] sm:text-[22px] font-bold leading-none cursor-pointer"
//       >
//         +
//       </button>
//     </div>
//   </div>

//   {/* FEATURES LIST - Tightened spacing for Mobile visibility */}
//   <div className="mt-4 sm:mt-8 mb-4 text-left flex-1">
//     <h4 className="text-white font-bold text-[13px] sm:text-[16px] mb-2 sm:mb-4">
//       Everything in Pro, plus :
//     </h4>

//     <ul className="space-y-1.5 sm:space-y-4 text-white text-[11.5px] sm:text-[15px] leading-tight sm:leading-6">
//       {[
//         "Unlimited team members",
//         "Unlimited workspaces",
//         "Unlimited storage",
//         "Advanced analytics dashboard",
//         "Custom roles & permissions",
//         "Collaboration contract templates",
//         "Revenue Split Manager",
//         "Dedicated account manager",
//         "Fast-track dispute resolution",
//         "API integrations",
//         "24/7 premium support",
//       ].map((item) => (
//         <li key={item} className="flex items-start gap-2 sm:gap-3 text-white">
//           <div
//             className="
//               mt-[2px]
//               flex items-center justify-center
//               w-3.5 h-3.5 sm:w-5 sm:h-5
//               rounded-full
//               border-[1.5px] sm:border-[2px] border-white
//               bg-transparent
//               shadow-[0_0_0_1px_rgba(255,255,255,0.4)]
//               shrink-0
//             "
//           >
//             <svg
//               className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="4"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <polyline points="20 6 9 17 4 12" />
//             </svg>
//           </div>
//           <span className="flex-1 line-clamp-1">{item}</span>
//         </li>
//       ))}
//     </ul>
//   </div>

//   {/* UPGRADE BUTTON */}
//   <div className="w-full flex justify-center mt-auto pb-2 sm:pb-8">
//     <button
//       className="
//         w-full
//         sm:w-[90%]
//         py-3 sm:py-4
//         rounded-full
//         font-semibold
//         text-[14px] sm:text-[16px]
//         text-white
//         bg-transparent
//         border-[2px] border-white
//         ring-1 ring-white/30
//         shadow-md
//         transition-all duration-300
//         hover:bg-white
//         hover:text-black
//       "
//     >
//       Upgrade to Agent
//     </button>
//   </div>
// </div>





// {/* CARDS + DISCLAIMER WRAPPER */}
// <div className="relative z-10 pb-16">

//  <div
//   ref={cardsRef}
//   className="
//     max-w-[1200px]
//     mx-auto
//     flex
//     flex-nowrap
//     gap-6
//     overflow-x-auto
//     snap-x
//     snap-mandatory
//     px-4
//     md:grid
//     md:grid-cols-3
//     md:gap-10
//     md:overflow-visible
//     md:px-0
//     items-start
//     no-scrollbar
//   "
// >
//   {/* cards here */}
// </div>


// {/* DISCLAIMER */}
// <div className="w-full mt-6 px-10 hidden sm:block">
//   <p
//     className="text-white/90 font-medium whitespace-nowrap ml-28"
//     style={{ fontSize: "clamp(12px, 1vw, 14px)" }}
//   >
//     ★ Please read these terms and conditions carefully before using (www.talenta.com)
//   </p>
// </div>

// </div>
//   </div>


// {/* ================= MOBILE NAV BUTTON (SMALL STYLED) ================= */}
// <div className="lg:hidden w-full flex justify-center py-4">
//   <div className="flex items-center gap-3">

//    {/* LEFT ARROW — OUTLINED CIRCLE */}
// <button
//   onClick={scrollLeft}
//   className="
//     w-10 h-10
//     rounded-full

//     border-2 border-gray-300   /* stronger border */
//     ring-1 ring-gray-300/70    /* visible outline ring */
//     shadow-[0_0_6px_rgba(255,255,255,0.35)]  /* subtle glow */

//     flex items-center justify-center
//     text-[#5822b4]

//     active:scale-90
//     transition-all
//   "
// >
//   <svg
//     className="w-5 h-5"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="3"
//     viewBox="0 0 24 24"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M19 12H5m0 0l7 7m-7-7l7-7"
//     />
//   </svg>
// </button>

//     {/* CENTER INDICATORS */}
//     <div className="flex items-center gap-1.5">
//       {/* Active Pill */}
//       <span className="w-7 h-1.5 rounded-full bg-[#5822b4]" />
//       {/* Inactive Pills */}
//       <span className="w-5 h-1.5 rounded-full bg-gray-400/50" />
//       <span className="w-5 h-1.5 rounded-full bg-gray-400/50" />
//     </div>

//     {/* RIGHT ARROW — SOLID GRADIENT */}
//     <button
//       onClick={scrollRight}
//       className="
//         w-10 h-10
//         rounded-full
//         bg-gradient-to-b
//         from-[#4c1d95]
//         to-[#1e1b4b]
//         flex items-center justify-center
//         text-white
//         shadow-md
//         active:scale-90
//         transition-all
//       "
//     >
//       <svg
//         className="w-5 h-5"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="3"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M5 12h14m0 0l-7-7m7 7l-7 7"
//         />
//       </svg>
//     </button>

//   </div>
// </div>

  
// <div className="-mx-4 mt-8 sm:mt-0">
//   <Footer />
// </div>


//       </div>
//     </div>
//   );
// };

// export default Subscription;


import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import bgImage from "../../assets/Subscription.png";
import card1 from "../../assets/card1.png";
import card2 from "../../assets/card2.png";
import Footer from "../../component/Footer";
import Header from "../../component/Header";
import api from "../../utils/axiosConfig";

const Subscription = () => {
  const cardsRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Added for checking URL params
  const [billing, setBilling] = useState("monthly");
  const [activeIndex, setActiveIndex] = useState(0);
  const [plans, setPlans] = useState({ monthly: [], yearly: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [currentUserPlan, setCurrentUserPlan] = useState(null);
  const [currentUserPlanDuration, setCurrentUserPlanDuration] = useState(null); // NEW: Store duration separately
  const [users, setUsers] = useState(1);
  const [proUsers, setProUsers] = useState(2);
  const [agentUsers, setAgentUsers] = useState(5);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false); // Added
  const CARD_WIDTH = 320;

  // Card backgrounds mapping
  const cardBackgrounds = [card1, card2, card1];

  // Custom cookie utility functions
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Debug function to log all cookies
  const logAllCookies = () => {
    console.log("=== ALL COOKIES ===");
    console.log("document.cookie:", document.cookie);
    
    const allCookies = document.cookie.split(';');
    allCookies.forEach(cookie => {
      console.log("Cookie:", cookie.trim());
    });
    console.log("===================");
  };

  // Function to check if user is authenticated
  const checkAuthentication = () => {
    console.log("=== AUTHENTICATION CHECK ===");
    logAllCookies();
    
    // Check for any auth-related cookies
    const cookieNames = [
      'auth_token', 'access_token', 'session_token', 'token', 
      'authToken', 'Authorization', 'Bearer', 'session',
      'refresh_token', 'accessToken', 'jwt', 'JWT'
    ];
    
    let isAuth = false;
    
    for (const cookieName of cookieNames) {
      const token = getCookie(cookieName);
      if (token) {
        console.log(`✓ Found authentication cookie: ${cookieName}`);
        isAuth = true;
        break;
      }
    }
    
    // Check localStorage as fallback
    if (!isAuth) {
      const localStorageKeys = [
        'access_token', 'auth_token', 'token', 
        'user', 'userData', 'authToken'
      ];
      
      for (const key of localStorageKeys) {
        const item = localStorage.getItem(key);
        if (item) {
          console.log(`✓ Found authentication in localStorage: ${key}`);
          isAuth = true;
          break;
        }
      }
    }
    
    // Check if user state is already loaded
    if (user) {
      console.log("✓ User data already loaded in state");
      isAuth = true;
    }
    
    console.log(`Authentication status: ${isAuth ? 'AUTHENTICATED' : 'NOT AUTHENTICATED'}`);
    return isAuth;
  };

  // Fetch user data from API
  const fetchUserData = async () => {
    try {
      console.log("Fetching user data from /auth/me...");
      const response = await api.get("/auth/me");
      console.log("User data fetched successfully:", response.data);
      setUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user data:", error.response?.status, error.message);
      setUser(null);
      return null;
    }
  };

  // Fetch user subscription data - UPDATED to get full subscription object
  const fetchUserSubscription = async (userEmail) => {
    try {
      console.log("Fetching subscription data for:", userEmail);
      const response = await api.get("/payment/user/subscription", {
        params: { user_email: userEmail }
      });
      console.log("Subscription data:", response.data);
      
      if (response.data.has_subscription && response.data.subscription) {
        // Store the full subscription object, not just plan_name
        setCurrentUserPlan(response.data.subscription);
        return response.data.subscription;
      } else {
        // Explicitly set to null if no subscription
        setCurrentUserPlan(null);
        setCurrentUserPlanDuration(null);
        return null;
      }
    } catch (error) {
      console.log("Could not fetch subscription:", error.message);
      setCurrentUserPlan(null);
      setCurrentUserPlanDuration(null);
      return null;
    }
  };

  // ✅ NEW FUNCTION: Verify payment after returning from Stripe
  const verifyPayment = async () => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    const userEmail = query.get('user_email');
    const planName = query.get('plan_name');
    
    if (sessionId && userEmail && planName) {
      console.log("Verifying payment...", { sessionId, userEmail, planName });
      setIsVerifyingPayment(true);
      
      try {
        const response = await api.get("/payment/verify-payment", {
          params: { 
            session_id: sessionId, 
            user_email: userEmail, 
            plan_name: planName 
          }
        });
        
        console.log("Verification response:", response.data);
        
        if (response.data.success) {
          alert('✅ Payment successful! Your subscription is now active.');
          // Refresh user data to show updated plan
          await fetchUserData();
          if (userEmail) await fetchUserSubscription(userEmail);
          
          // Clean URL params
          navigate('/subscription', { replace: true });
        } else {
          alert(`❌ Payment verification failed: ${response.data.status || 'Unknown error'}`);
        }
      } catch (err) {
        console.error("Verification error:", err);
        alert("Error verifying payment. Please contact support.");
      } finally {
        setIsVerifyingPayment(false);
      }
    }
  };

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("=== INITIAL DATA FETCH ===");
        
        // First check if we're authenticated
        const isAuth = checkAuthentication();
        
        if (isAuth) {
          // Try to fetch user data
          const userData = await fetchUserData();
          if (userData) {
            // Fetch subscription if we got user data
            await fetchUserSubscription(userData.email);
          }
        } else {
          console.log("User is not authenticated, skipping user data fetch");
        }

        // Always fetch subscription plans (public endpoint)
        console.log("Fetching subscription plans...");
        const response = await api.get("/plans/list", {
          params: { is_active: true }
        });
        
        console.log("Plans API Response:", response.data);
        
        if (response.data && response.data.plans) {
          const allPlans = response.data.plans;
          
          const monthlyPlans = allPlans.filter(plan => {
            const duration = plan.duration ? plan.duration.toLowerCase() : '';
            return duration === "monthly";
          }).sort((a, b) => a.price - b.price);
          
          const yearlyPlans = allPlans.filter(plan => {
            const duration = plan.duration ? plan.duration.toLowerCase() : '';
            return duration === "yearly";
          }).sort((a, b) => a.price - b.price);
          
          console.log("Monthly plans:", monthlyPlans);
          console.log("Yearly plans:", yearlyPlans);
          
          setPlans({
            monthly: monthlyPlans,
            yearly: yearlyPlans
          });
        } else {
          console.warn("No plans data in response");
        }
        
        setLoading(false);
        console.log("=== DATA FETCH COMPLETE ===");
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Failed to load subscription plans. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ NEW EFFECT: Check for payment verification on component mount
  useEffect(() => {
    verifyPayment();
  }, [location.search]);

  // Get current plans based on selected billing cycle
  const currentPlans = billing === "monthly" ? plans.monthly : plans.yearly;

  // Handle subscription purchase - UPDATED to include params in success URL
  const handleSubscribe = async (plan) => {
    console.log("=== SUBSCRIBE CLICKED ===");
    console.log("Plan:", plan);
    console.log("Current user state:", user);
    console.log("Is authenticated?", checkAuthentication());
    
    // If no user data but we might be authenticated, try to fetch user first
    if (!user) {
      console.log("No user data, checking authentication...");
      const isAuth = checkAuthentication();
      
      if (isAuth) {
        console.log("User appears authenticated but no user data. Fetching...");
        setIsCheckingAuth(true);
        
        try {
          const userData = await fetchUserData();
          if (userData) {
            console.log("User data fetched successfully, proceeding with subscription");
            // Now that we have user data, call handleSubscribe again
            handleSubscribe(plan);
            return;
          } else {
            console.log("Failed to fetch user data despite auth check");
            alert("Unable to load your account information. Please try logging in again.");
            navigate("/login");
            return;
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert("Authentication error. Please login again.");
          navigate("/login");
          return;
        } finally {
          setIsCheckingAuth(false);
        }
      } else {
        // Not authenticated at all
        alert("Please login to subscribe");
        navigate("/login");
        return;
      }
    }
    
    // At this point, we should have user data
    if (!user) {
      alert("Please login to subscribe");
      navigate("/login");
      return;
    }

    try {
      console.log("Creating checkout session for:", user.email);
      const response = await api.post("/payment/create-checkout-session", {
        email: user.email,
        plan_name: plan.name,
        duration: plan.duration
      });

      console.log("Checkout response:", response.data);
      
      if (response.data.checkout_url) {
        window.location.href = response.data.checkout_url;
      } else {
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (err) {
      console.error("Error creating checkout:", err);
      alert(`Failed to start checkout: ${err.response?.data?.detail || err.message}`);
    }
  };

  const scrollLeft = () => {
    if (!cardsRef.current) return;
    cardsRef.current.scrollBy({
      left: -CARD_WIDTH,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    if (!cardsRef.current) return;
    cardsRef.current.scrollBy({
      left: CARD_WIDTH,
      behavior: "smooth",
    });
  };

  // Get features for a plan
  const getPlanFeatures = (plan) => {
    if (!plan || !plan.features) return [];
    
    if (typeof plan.features === 'string') {
      try {
        return JSON.parse(plan.features);
      } catch {
        return [];
      }
    }
    
    if (Array.isArray(plan.features)) {
      return plan.features.map(feature => {
        if (typeof feature === 'string') {
          return { title: feature, description: "", is_active: true };
        }
        return {
          title: feature.title || "",
          description: feature.description || "",
          is_active: feature.is_active !== false
        };
      });
    }
    
    return [];
  };

  // Helper function to get plan duration display
  const getPlanDuration = (plan) => {
    const duration = plan.duration?.toLowerCase() || "";
    if (duration.includes('year') || duration.includes('annual')) {
      return 'year';
    }
    return 'month';
  };

  // Get button text based on plan and user's current plan - COMPLETELY FIXED VERSION
  const getButtonText = (plan) => {
    console.log(`getButtonText called for plan: ${plan?.name}, duration: ${plan?.duration}`);
    console.log("Current user plan object:", currentUserPlan);
    
    // If we're still checking auth or loading
    if (isCheckingAuth) {
      return "Checking...";
    }
    
    if (loading) {
      return "Loading...";
    }

    // If verifying payment
    if (isVerifyingPayment) {
      return "Processing...";
    }
    
    // If no user data
    if (!user) {
      return "Login to Subscribe";
    }
    
    // We have user data
    const planName = plan.name?.toLowerCase() || "";
    const planDuration = plan.duration?.toLowerCase() || "";
    const isYearlyPlan = planDuration.includes('year') || planDuration.includes('annual');
    
    // If no current subscription
    if (!currentUserPlan) {
      // For free/basic plan
      if (planName.includes("free") || planName.includes("basic")) {
        return "Active";
      }
      // For other plans - show proper duration
      if (isYearlyPlan) {
        return `Subscribe Yearly`;
      } else {
        return `Subscribe Monthly`;
      }
    }
    
    // User has a subscription - IMPORTANT: Get current plan details from the object
    const currentPlanName = (currentUserPlan.plan_name || currentUserPlan.current_plan || "").toLowerCase();
    const currentDuration = (currentUserPlan.duration || "").toLowerCase();
    const isCurrentPlanYearly = currentDuration.includes('year') || currentDuration.includes('annual');
    
    console.log(`Comparing: Plan=${planName}(${planDuration}) vs Current=${currentPlanName}(${currentDuration})`);
    
    // Check for EXACT match - both plan name AND duration must match
    const isExactMatch = (
      // Check if plans match (case-insensitive)
      (planName === currentPlanName || 
       planName.includes(currentPlanName) || 
       currentPlanName.includes(planName)) &&
      // Check if durations match EXACTLY
      (planDuration === currentDuration ||
       (isYearlyPlan && isCurrentPlanYearly) ||
       (!isYearlyPlan && !isCurrentPlanYearly))
    );
    
    if (isExactMatch) {
      return isYearlyPlan ? "Current Yearly Plan" : "Current Monthly Plan";
    }
    
    // Check if same plan but different duration (Pro Monthly vs Pro Yearly)
    const isSamePlanDifferentDuration = (
      (planName === currentPlanName || 
       planName.includes(currentPlanName) || 
       currentPlanName.includes(planName)) &&
      // Durations are different
      ((isYearlyPlan && !isCurrentPlanYearly) || 
       (!isYearlyPlan && isCurrentPlanYearly))
    );
    
    if (isSamePlanDifferentDuration) {
      if (isYearlyPlan) {
        return "Switch to Yearly";
      } else {
        return "Switch to Monthly";
      }
    }
    
    // Different plan altogether
    if (planName.includes("free") || planName.includes("basic")) {
      return "Downgrade to Basic";
    } else if (planName.includes("pro")) {
      return isYearlyPlan ? "Upgrade to Pro (Yearly)" : "Upgrade to Pro";
    } else if (planName.includes("agent")) {
      return isYearlyPlan ? "Upgrade to Agent (Yearly)" : "Upgrade to Agent";
    } else {
      return isYearlyPlan ? `Subscribe Yearly` : `Subscribe Monthly`;
    }
  };

  // Check if button should be disabled - FIXED VERSION
  const isButtonDisabled = (plan) => {
    // Disable if loading or checking auth or verifying payment
    if (loading || isCheckingAuth || isVerifyingPayment) return true;
    
    // If we have user data
    if (user) {
      const planName = plan.name?.toLowerCase() || "";
      const planDuration = plan.duration?.toLowerCase() || "";
      const isYearlyPlan = planDuration.includes('year') || planDuration.includes('annual');
      
      // If no current subscription
      if (!currentUserPlan) {
        // Disable only the basic/free plan button
        if (planName.includes("free") || planName.includes("basic")) {
          return true; // Disable "Active" button
        }
        return false; // Enable upgrade buttons
      }
      
      // User has a subscription
      const currentPlanName = (currentUserPlan.plan_name || currentUserPlan.current_plan || "").toLowerCase();
      const currentDuration = (currentUserPlan.duration || "").toLowerCase();
      const isCurrentPlanYearly = currentDuration.includes('year') || currentDuration.includes('annual');
      
      // Check for EXACT match - both plan name AND duration
      const isExactMatch = (
        (planName === currentPlanName || 
         planName.includes(currentPlanName) || 
         currentPlanName.includes(planName)) &&
        (planDuration === currentDuration ||
         (isYearlyPlan && isCurrentPlanYearly) ||
         (!isYearlyPlan && !isCurrentPlanYearly))
      );
      
      // Disable only if it's the EXACT same plan AND duration
      return isExactMatch;
    }
    
    // No user data - not disabled
    return false;
  };

  // Render plan card - EXACT design as in image
  const renderPlanCard = (plan, index) => {
    const features = getPlanFeatures(plan);
    
    // Get user count for this plan based on plan name
    let userCount = 1;
    let setUserCount = () => {};
    
    if (plan.name?.toLowerCase().includes("free") || plan.name?.toLowerCase().includes("basic")) {
      userCount = users;
      setUserCount = setUsers;
    } else if (plan.name?.toLowerCase().includes("pro")) {
      userCount = proUsers;
      setUserCount = setProUsers;
    } else if (plan.name?.toLowerCase().includes("agent")) {
      userCount = agentUsers;
      setUserCount = setAgentUsers;
    }
    
    // Get max users from plan or default
    const maxUsers = plan.max_users || 
      (plan.name?.toLowerCase().includes("free") || plan.name?.toLowerCase().includes("basic") ? 1 : 
       plan.name?.toLowerCase().includes("pro") ? 2 : 
       plan.name?.toLowerCase().includes("agent") ? 5 : 1);

    // Get the correct duration display for this specific plan
    const planDurationDisplay = getPlanDuration(plan);

    return (
      <div key={plan.id || index} className="snap-center shrink-0">
        <div
          className="
            min-w-[280px]
            w-[280px]
            lg:min-w-0
            h-[740px]
            lg:h-[959px]
            lg:w-full
            lg:max-w-[384px]
            rounded-[24px]
            lg:rounded-[20px]
            p-4 
            sm:p-10
            text-center
            relative
            flex flex-col
            overflow-hidden
            mx-auto 
            lg:mx-0 
            transition-all duration-300 ease-in-out
            hover:-translate-y-2
            hover:border-[3px] hover:border-[#FFD700]
            hover:shadow-[0_0_40px_14px_rgba(255,215,0,0.85)]
            active:-translate-y-2
            active:border-[3px] active:border-[#FFD700]
            active:shadow-[0_0_40px_14px_rgba(255,215,0,0.85)]
          "
          style={{
            backgroundImage: `url(${cardBackgrounds[index % cardBackgrounds.length]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* TOP CONTENT - Clean design like image */}
          <div className="pt-12 sm:pt-16 flex flex-col items-center">
            <h3 className="text-[20px] sm:text-[24px] font-bold text-white mb-1">
              {plan.name || `Plan ${index + 1}`}
            </h3>

            <p className="text-[34px] sm:text-[48px] font-extrabold text-white leading-[1] flex items-end gap-1">
              ${plan.price || 0}
              <span className="text-[15px] sm:text-[18px] font-medium mb-1">
                /{planDurationDisplay}
              </span>
            </p>
            
            {/* USER SELECTOR - Always shown */}
            <div className="h-[50px] sm:h-[70px] flex items-center justify-center mt-4 sm:mt-5">
              <div className="bg-white px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-full flex items-center gap-3 sm:gap-6 text-black font-bold shadow-lg">
                <button
                  onClick={() => setUserCount(prev => Math.max(1, prev - 1))}
                  className="text-[18px] sm:text-[20px] font-bold leading-none cursor-pointer select-none"
                  disabled={isVerifyingPayment}
                >
                  −
                </button>

                <span className="tracking-wide select-none text-[12px] sm:text-[15px] whitespace-nowrap">
                  {userCount} USER
                </span>

                <button
                  onClick={() => setUserCount(prev => Math.min(maxUsers, prev + 1))}
                  className="text-[18px] sm:text-[20px] font-bold leading-none cursor-pointer select-none"
                  disabled={isVerifyingPayment}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* FEATURES - Scrollable area with clean design */}
          <div className="mt-4 sm:mt-6 mb-2 text-left flex-1">
            {/* Plan description if available */}
            {plan.description && (
              <div className="mb-3 text-center px-2">
                <p className="text-white/95 text-[13px] sm:text-[15px] font-medium">
                  {plan.description}
                </p>
              </div>
            )}
            
            {/* Features list with custom scrollbar */}
            <div className="h-[300px] sm:h-[350px] overflow-y-auto pr-1 custom-scrollbar">
              <ul className="space-y-2.5 sm:space-y-3.5 text-white">
                {features.length > 0 ? (
                  features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 sm:gap-3 list-none">
                      {/* Clear tick mark bullet */}
                      <div className="mt-[3px] flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full border-[1.5px] sm:border-[2px] border-white bg-transparent shrink-0 flex-shrink-0">
                        <svg 
                          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-[13px] sm:text-[15px] leading-tight block">
                          {feature.title || `Feature ${idx + 1}`}
                        </span>
                        {feature.description && (
                          <p className="text-white/80 text-[11px] sm:text-[13px] mt-0.5 leading-snug">
                            {feature.description}
                          </p>
                        )}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-white/70 text-sm text-center list-none py-8">
                    No features listed for this plan
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="w-full flex justify-center mt-auto pb-2 sm:pb-4 pt-4">
            <button
              onClick={() => handleSubscribe(plan)}
              className="
                w-full
                sm:w-[92%]
                py-3 sm:py-4
                rounded-full
                font-bold
                text-[15px] sm:text-[17px]
                text-white
                bg-transparent
                border-[2px] border-white
                ring-1 ring-white/60
                transition-all duration-300
                hover:bg-white
                hover:text-black
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:bg-transparent
                disabled:hover:text-white
                shadow-lg
              "
              disabled={isButtonDisabled(plan)}
            >
              {getButtonText(plan)}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        text-white
        pt-24
        px-4
        bg-cover
        bg-center
        bg-no-repeat
        relative
        overflow-x-hidden
      "
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[#d9d9d9]/10 backdrop-blur-[1px]" />
      
      <div className="mt-[-80px]">
        <Header />
      </div>

      <div className="relative z-10">
        {/* Payment Verification Loading Overlay */}
        {isVerifyingPayment && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-xl shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                <p className="text-white text-lg font-semibold">Verifying Payment...</p>
                <p className="text-gray-300 text-sm mt-2">Please wait while we confirm your subscription</p>
              </div>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="text-center mb-20">
          <h1 className="text-white text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-lg">
            Simple Pricing, <br /> Powerful Features
          </h1>

          <p className="text-white text-lg font-semibold mt-4 drop-shadow-md">
            Simple, transparent pricing that grows with you. Try any plan free for 30 days.
          </p>

          {/* TOGGLE - Improved subtle version */}
          {!loading && (plans.monthly.length > 0 || plans.yearly.length > 0) && (
            <div className="flex justify-center mt-10">
              <div className="flex rounded-full p-1 bg-[#2D0A4A]/90 border-2 border-white/25 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <button
                  onClick={() => setBilling("monthly")}
                  className={`px-7 py-2.5 rounded-full font-semibold text-[15px]
                    ${billing === "monthly"
                      ? "bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.25)]"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                    } transition-all duration-200`}
                  disabled={loading || isVerifyingPayment}
                >
                  Monthly billing
                </button>

                <button
                  onClick={() => setBilling("yearly")}
                  className={`px-7 py-2.5 rounded-full font-semibold text-[15px]
                    ${billing === "yearly"
                      ? "bg-white text-black shadow-[0_4px_12px_rgba(255,255,255,0.25)]"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                    } transition-all duration-200`}
                  disabled={loading || isVerifyingPayment}
                >
                  Annual billing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
            <p className="text-white text-lg">Loading subscription plans...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-red-300 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* PLANS CONTENT */}
        {!loading && !error && (
          <>
            {/* CARDS CONTAINER */}
            <div
              ref={cardsRef}
              className="
                max-w-[1200px]
                mx-auto
                flex
                flex-nowrap
                gap-6
                overflow-x-auto
                snap-x
                snap-mandatory
                px-4
                md:grid
                md:grid-cols-3
                md:gap-10
                md:overflow-visible
                md:px-0
                items-start
                no-scrollbar
              "
            >
              {/* SECTION TITLE — DESKTOP ONLY */}
              <div className="col-span-full px-4 hidden md:block mb-6 md:mb-0">
                <h2 className="text-white text-[26px] md:text-4xl font-extrabold">
                  Upgrade Plan
                </h2>
                <p className="text-white text-[16px] md:text-2xl font-semibold">
                  Select a plan that matches your needs.
                </p>
              </div>

              {/* RENDER PLANS FROM BACKEND */}
              {currentPlans.length > 0 ? (
                currentPlans.map((plan, index) => renderPlanCard(plan, index))
              ) : (
                // Fallback if no plans found for current billing
                <div className="col-span-3 text-center py-20">
                  <p className="text-white text-lg">
                    No {billing} subscription plans available at the moment.
                  </p>
                </div>
              )}
            </div>

            {/* DISCLAIMER */}
            <div className="w-full mt-6 px-10 hidden sm:block">
              <p
                className="text-white/90 font-medium whitespace-nowrap ml-28"
                style={{ fontSize: "clamp(12px, 1vw, 14px)" }}
              >
                ★ Please read these terms and conditions carefully before using (www.talenta.com)
              </p>
            </div>

            {/* MOBILE NAV BUTTON */}
            {currentPlans.length > 1 && (
              <div className="lg:hidden w-full flex justify-center py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={scrollLeft}
                    className="
                      w-10 h-10
                      rounded-full
                      border-2 border-gray-300
                      ring-1 ring-gray-300/70
                      shadow-[0_0_6px_rgba(255,255,255,0.35)]
                      flex items-center justify-center
                      text-[#5822b4]
                      active:scale-90
                      transition-all
                    "
                    disabled={isVerifyingPayment}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0l7 7m-7-7l7-7" />
                    </svg>
                  </button>

                  {/* CENTER INDICATORS */}
                  <div className="flex items-center gap-1.5">
                    {currentPlans.map((_, idx) => (
                      <span
                        key={idx}
                        className={`w-5 h-1.5 rounded-full ${idx === activeIndex ? 'bg-[#5822b4] w-7' : 'bg-gray-400/50'}`}
                      />
                    ))}
                  </div>

                  {/* RIGHT ARROW */}
                  <button
                    onClick={scrollRight}
                    className="
                      w-10 h-10
                      rounded-full
                      bg-gradient-to-b
                      from-[#4c1d95]
                      to-[#1e1b4b]
                      flex items-center justify-center
                      text-white
                      shadow-md
                      active:scale-90
                      transition-all
                    "
                    disabled={isVerifyingPayment}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0l-7-7m7 7l-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="-mx-4 mt-8 sm:mt-0">
          <Footer />
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(32, 5, 49, 0.84) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default Subscription;