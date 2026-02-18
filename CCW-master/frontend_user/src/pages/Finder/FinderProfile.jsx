
// import React, { useState } from "react";

// /* ================== IMAGES ================== */
// import UserImg from "../../assets/Landing/user.png";
// import ManImg from "../../assets/Landing/man.png";
// import HalfCircle from "../../assets/Landing/half-circle.png";
// import BigScribble from "../../assets/Landing/scribble-big.png";
// import ServicesBG from "../../assets/Landing/services.png";

// import Ui1 from "../../assets/Landing/ui1.png";
// import Ui2 from "../../assets/Landing/ui2.png";
// import Ui3 from "../../assets/Landing/ui3.png";
// import Footer from "../../component/Footer";

// /* ================= DATA ================= */
// const serviceItems = [{ image: Ui1 }, { image: Ui2 }, { image: Ui3 }];
// const TimelineNode = ({ color }) => (
//   <div className="relative w-[48px] h-[48px] flex items-center justify-center z-10">

//     <svg className="absolute inset-0" viewBox="0 0 100 100">
//       <circle
//         cx="50"
//         cy="50"
//         r="46"
//         fill="none"
//         stroke="rgba(72,33,33,1)"
//         strokeWidth="4"
//         strokeDasharray="10 12"
//         strokeLinecap="round"
//       />
//     </svg>

//     <div className="absolute inset-[8px] rounded-full bg-white" />

//     <div
//       className="absolute inset-[16px] rounded-full"
//       style={{ background: color }}
//     />

//   </div>
// );

// export default function FinderProfile() {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   return (
//     <div className="w-full bg-white overflow-x-hidden">

//       {/* ================= DESKTOP (UNCHANGED) ================= */}
//       <div className="hidden lg:block">

//       {/* ======================= HEADER ======================= */}
// <header className="relative max-w-[1440px] mx-auto h-[100px] px-[70px] pt-[12px] flex items-start justify-between">

//   {/* LEFT */}
//   <div className="flex flex-col gap-1">
//     <h1
//       className="text-[50px] font-bold leading-none"
//       style={{
//         fontFamily: "Trochut, cursive",
//         background:
//           "linear-gradient(270deg, #51218F 22.62%, #030303 100%)",
//         WebkitBackgroundClip: "text",
//         WebkitTextFillColor: "transparent",
//       }}
//     >
//       Talenta
//     </h1>

//     {/* BACK BUTTON */}
//     <button
//       onClick={() => window.history.back()}
//       className="flex items-center mt-1 ml-3 text-[16px] text-black hover:opacity-70 w-fit"
//     >
//       <svg
//         width="22"
//         height="22"
//         viewBox="0 0 24 24"
//         fill="none"
//       >
//         <path
//           d="M15 18L9 12L15 6"
//           stroke="black"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//       Back
//     </button>
//   </div>

//   {/* RIGHT ICONS */}
//   <div className="flex items-center gap-6 ml-8">

//     {/* user SVG */}
//     <svg
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       className="w-[28px] h-[58px]"
//     >
//       <path
//         d="M12 12.4C14.32 12.4 16.2 10.52 16.2 8.2C16.2 5.88 14.32 4 12 4C9.68 4 7.8 5.88 7.8 8.2C7.8 10.52 9.68 12.4 12 12.4Z"
//         stroke="black"
//         strokeWidth="1.8"
//       />
//       <path
//         d="M19.2 20C19.2 16.9 15.92 14.6 12 14.6C8.08 14.6 4.8 16.9 4.8 20"
//         stroke="black"
//         strokeWidth="1.8"
//       />
//     </svg>

//     {/* message SVG */}
//     <svg
//       width="28"
//       height="24"
//       viewBox="0 0 28 24"
//       fill="none"
//       className="w-[28px] h-[24px]"
//     >
//       <path
//         d="M4 3H24C25.66 3 27 4.34 27 6V16C27 17.66 25.66 19 24 19H11L5 22V19H4C2.34 19 1 17.66 1 16V6C1 4.34 2.34 3 4 3Z"
//         stroke="black"
//         strokeWidth="1.8"
//       />
//       <path d="M7 8H21" stroke="black" strokeWidth="1.8" />
//       <path d="M7 12H17" stroke="black" strokeWidth="1.8" />
//     </svg>

//     {/* User Name */}
//     <span className="text-[18px] font-medium">Julie</span>

//     {/* Profile Image */}
//     <img
//       src={UserImg}
//       alt="profile"
//       className="w-[48px] h-[48px] rounded-full object-cover"
//     />
//   </div>

// </header>


//           {/* ======================= HERO ============================ */}

//  <section className="w-full h-[800px] relative flex items-center justify-center">

//   {/* =================== CENTER TEXT BLOCK =================== */}
//   <div className="text-center mb-100 w-[913px] h-[266px]">

// <div className="relative inline-block mt-2  ml-10">
//   {/* Hello Tag — STRONG visible outline */}
//   <p
//     className="
//       text-[18px]
//       bg-white
//       px-6
//       py-2
//       inline-block
//       rounded-full
//       font-medium
//       relative
//       z-10
//       border-[3px]
//       border-black
//       mb-2
//     "
//     style={{
//       boxShadow: "0 0 0 2px black",
//     }}
//   >
//     Hello!
//   </p>

//   {/* SCRIBBLE SVG — unchanged */}
//  <svg
//   className="absolute -top-10 -right-10 w-[55px] h-[55px] z-0"
//   viewBox="0 0 60 60"
//   fill="none"
//   xmlns="http://www.w3.org/2000/svg"
// >
//   <path
//     d="
//       M18 42 C20 32 18 22 16 14
//       M30 45 C36 34 42 26 50 18
//       M38 52 C45 48 52 44 58 40
//     "
//     stroke="#51218F"
//     strokeWidth="5"
//     strokeLinecap="round"
//   />
// </svg>

// </div>




//     {/* Heading */}
//     <h1 className="text-[90px] font-bold leading-[100px] mt-6">
//       I'm <span className="text-purple-600">Jenny</span>,
//     </h1>

//    <div className="relative inline-block">
//   <h1 className="text-[90px] font-bold leading-[100px] -mt-2">
//     UI / UX Designer
//   </h1>

//   {/* STROKE / SCRIBBLE BELOW UI TEXT */}
//  <img
//   src={BigScribble}
//   alt="ui-scribble"
//   className="
//     absolute
//     -left-[80px]   /* ⬅⬅ moved clearly more left */
//     top-[100px]
//     w-[65px]
//   "
// />

// </div>


//     {/* Half Circle Background */}
//     <img
//       src={HalfCircle}
//       alt="half bg"
//       className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[871px] h-[575px] opacity-90"
//     />

//     {/* Man Image */}
//     <img
//       src={ManImg}
//       alt="man"
//       className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[600px] object-contain"
//     />
// {/* =================== COLLABORATE REQUEST BUTTON =================== */}
// <div
//   className="
//     + absolute left-1/2 -translate-x-1/2 top-[330px]
//     w-[367px] h-[82px]
//     flex items-center justify-center
//     relative
//   "
// >

// {/* OUTER BORDER*/}
// <div
//   className="
//     absolute inset-0 rounded-[50px]
//     p-[5px]

//     bg-[#FFFFFF1A] 
//     !border !border-white
//     border-[2px]                    
//     [border-style:solid]

//     [border-image-slice:1]
//     [border-image-width:2]
//     [border-image-repeat:stretch]

//     [border-image-source:radial-gradient(
//       150.36%_227.1%_at_8.75%_100%,
//       #FFFFFF_0%,
//       rgba(169, 163, 163, 0)_100%
//     )]

//     backdrop-blur-[1px]            
//   "
// ></div>





//   {/* THIN INNER WHITE BORDER */}
//   <div
//     className="
//       absolute inset-[5px]
//       rounded-[50px]
//       border border-white/60
//       p-[5px]
//     "
//   ></div>

//   {/* INNER PANEL — UPDATED WITH YOUR NEW GRADIENT */}
// <div
//   className="
//     absolute inset-[10px]
//     rounded-[50px]

//     !border !border-white
//     shadow-[0_0_35px_#8A38F5]

//     bg-[radial-gradient(50%_50%_at_50%_50%,#8A38F5_0%,#000000_100%)]
//   "
// ></div>


// {/* ================= BUTTON CONTENT ================= */}
// <button
//   className="
//     relative z-10 w-full h-full rounded-[50px]
//     flex items-center justify-center gap-4
//     text-white text-[26px] font-semibold
//     -mt-2
//   "
// >
//   Collaborate request

//   {/* ARROW ICON – EXACT MATCH */}
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="32"
//     height="32"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="white"
//     strokeWidth="2.5"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <path d="M7 17L17 7" />
//     <path d="M7 7h10v10" />
//   </svg>
// </button>

// </div>

//   </div>

// {/* =================== LEFT TESTIMONIAL =================== */}
// <div className="absolute left-[40px] top-[520px] w-[328px] flex flex-col gap-[12px]">

//   {/* QUOTE ICON */}
//   <div className="text-[#2A3442] text-[48px] leading-none font-bold">
//     “
//   </div>

//   {/* TESTIMONIAL TEXT — BOLD */}
//   <p className="text-[#2A3442] text-[18px] leading-[26px] font-bold">
//     Jenny’s Exceptional product design <br />
//     ensure our website’s success. <br />
//     Highly Recommended
//   </p>

// </div>


//   {/* =================== RIGHT EXPERIENCE BLOCK =================== */}
//   <div className="absolute right-[100px] top-[560px] w-[169px] h-[125px] flex flex-col items-center gap-[21px]">

//     <div className="flex gap-1">
//       {[...Array(5)].map((_, i) => (
//         <span key={i} className="text-[32px] text-orange-500">★</span>
//       ))}
//     </div>

//     <div className="text-center">
//       <h3 className="text-[40px] font-bold leading-none">10 Years</h3>
//       <p className="text-[18px] text-[#444] -mt-1">Experience</p>
//     </div>

//   </div>

// </section>
// {/* ===================== SERVICES ========================== */}
// <section
//   className="relative w-full h-[900px] bg-cover bg-center rounded-[45px] -mt-4"
//   style={{ backgroundImage: `url(${ServicesBG})` }}
// >

//   {/* ======= TOP GLOW LINE ======= */}
//   <div className="absolute top-[40px] left-0 w-full h-[3px] bg-gradient-to-r from-[#a96bff] via-[#d8baff] to-[#9b4dff] opacity-80 blur-[1px]" />

//   {/* ======= REFLECTION LINE BELOW CARDS ======= */}
//   <div className="absolute bottom-[150px] left-0 w-full h-[6px] bg-gradient-to-r from-[#6d2cff] to-[#b57eff] opacity-60 blur-[6px]" />

//   {/* =================== TITLE ROW =================== */}
//   <div
//     className="
//       flex items-center justify-between 
//       w-[1299px] h-[52px]
//       mb-[40px]
//       mx-auto
//     "
//   >
 
// <h2 className="text-[48px] mt-44 ml-8 font-semibold text-white">
//   My <span className="ml-1 text-[#51218F]">Services</span>
// </h2>



// <p className="text-white text-[16px] w-[480px] mt-40 leading-[26px] relative right-[60px]">
//   Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
//   Duis lacus nunc, posuere in justo vulputate, bibendum sodales.
// </p>


 
//   </div>

// {/* =================== 3-GRID CARDS SECTION =================== */}
// <div
//   className="
//     w-[1099px] 
//     h-[462px]
//     mx-auto
//     flex
//     justify-between
//     gap-[29px]
//     mt-[190px]
//   "
// >
//   {serviceItems.map((item, index) => {
//     let position =
//       (index - currentIndex + serviceItems.length) %
//       serviceItems.length;

//     return (
//       <div
//         key={index}
//         className={`
//           transition-all duration-500 
//           w-[413px]
//           opacity-100
//           ${position === 1 ? "z-20" : "z-10"}
//         `}
//       >
//         {/* ===== CARD WRAPPER (FOR FULL OUTLINE) ===== */}
//         <div className="relative w-full h-full rounded-[55px]">

//           {/* OUTLINE LAYER — ALWAYS COMPLETE */}
//           <div className="absolute inset-0 rounded-[55px] border border-white/40 pointer-events-none z-20" />

//           {/* ===== CARD ===== */}
//           <div
//             className="
//               relative z-10
//               w-full h-full
//               rounded-[55px]
//               bg-white/5 backdrop-blur-s
//               p-7
//               shadow-[0_0_40px_rgba(162,95,255,0.25)]
//             "
//           >
//             <h3 className="text-white text-[24px] font-medium mb-5">
//               {item.title}
//             </h3>

//             {/* IMAGE STACK EFFECT */}
//             <div className="relative w-full h-[350px]">
//               <div className="absolute top-[10px] left-[10px] w-full h-full rounded-xl bg-white/10 blur-md" />

//               <img
//                 src={item.image}
//                 alt=""
//                 className="relative rounded-xl shadow-xl w-full h-full object-cover"
//               />
//             </div>
//           </div>

//         </div>
//       </div>
//     );
//   })}
// </div>

// {/* ===== DOTS ===== */}
// <div className="flex gap-3 justify-center mt-[100px]">
//   {serviceItems.map((_, i) => (
//     <button
//       key={i}
//       onClick={() => setCurrentIndex(i)}
//       className={`
//         w-[10px] h-[10px] rounded-full transition-all 
//         ${
//           currentIndex === i
//             ? "bg-white scale-150 shadow-[0_0_8px_white]"
//             : "bg-white/40"
//         }
//       `}
//     />
//   ))}
// </div>



// </section>

//     {/* ================= WORK EXPERIENCE ================= */}
// <section className="w-full max-w-[1440px] mx-auto px-[70px] py-[120px] bg-white">

//   {/* ===== TITLE ===== */}
//   <h2 className="text-center text-[60px] font-semibold mb-[120px]">
//     <span className="text-[#334155]">My </span>
//     <span className="text-[#6D28D9]">Work Experince</span>
//   </h2>

//   {/* ===== GRID ===== */}
//   <div className="grid grid-cols-[1fr_120px_1fr] items-start">

//     {/* ================= LEFT ================= */}
//     <div className="flex flex-col gap-[140px] text-left pr-10">

//       <div>
//         <h3 className="text-[42px] font-semibold text-[#334155]">
//           Cognizant, Mumbai
//         </h3>
//         <p className="text-[#9CA3AF] text-[22px] mt-2">
//           Sep 2016 – July 2020
//         </p>
//       </div>

//       <div>
//         <h3 className="text-[42px] font-semibold text-[#334155]">
//           Sugee Pvt limited, Mumbai
//         </h3>
//         <p className="text-[#9CA3AF] text-[22px] mt-2">
//           Sep 2020 – July 2023
//         </p>
//       </div>

//       <div>
//         <h3 className="text-[42px] font-semibold text-[#334155]">
//           Cinetstox, Mumbai
//         </h3>
//         <p className="text-[#9CA3AF] text-[22px] mt-2">
//           Sep 2023
//         </p>
//       </div>

//     </div>
// {/* ================= TIMELINE ================= */}
// <div className="relative flex flex-col mt-3 items-center">

//   {/* CONTINUOUS DASHED LINE */}
//   <div
//     className="absolute top-[80px] bottom-[80px] w-[3px]"
//     style={{
//       backgroundImage:
//         "repeating-linear-gradient(to bottom, #6B7280 0, #6B7280 6px, transparent 6px, transparent 14px)",
//     }}
//   />

//  {/* ================= TOP NODE ================= */}
// <div className="relative w-[76px] h-[76px] flex items-center justify-center z-10">

//   {/* SEGMENTED OUTER RING (VISIBLE LIKE IMAGE) */}
//   <svg
//     className="absolute inset-0"
//     viewBox="0 0 100 100"
//   >
//     <circle
//       cx="50"
//       cy="50"
//       r="46"
//       fill="none"
//       stroke="rgba(72, 33, 33, 1)"
//       strokeWidth="4"
//       strokeDasharray="10 12"
//       strokeLinecap="round"
//     />
//   </svg>

//   {/* white ring */}
//   <div className="absolute inset-[12px] rounded-full bg-white" />

//   {/* inner solid */}
//   <div className="absolute inset-[22px] rounded-full bg-[#5B2CA1]" />

// </div>


//   <div className="h-[190px]" />

// {/* ================= MIDDLE NODE ================= */}
// <div className="relative w-[76px] h-[76px] flex items-center justify-center z-10">

//   {/* SEGMENTED / DOT OUTER RING */}
//   <svg
//     className="absolute inset-0"
//     viewBox="0 0 100 100"
//   >
//     <circle
//       cx="50"
//       cy="50"
//       r="46"
//       fill="none"
//       stroke="rgba(72, 33, 33, 1)"
//       strokeWidth="4"
//       strokeDasharray="10 12"
//       strokeLinecap="round"
//     />
//   </svg>

//   {/* white ring */}
//   <div className="absolute inset-[12px] rounded-full bg-white" />

//   {/* inner solid */}
//   <div className="absolute inset-[22px] rounded-full bg-[#5B2D2D]" />

// </div>



//   <div className="h-[190px]" />

// {/* ================= NODE ================= */}
// <div className="relative w-[76px] h-[76px] flex items-center justify-center z-10">

//   {/* SEGMENTED / DOT OUTER RING */}
//   <svg
//     className="absolute inset-0"
//     viewBox="0 0 100 100"
//   >
//     <circle
//       cx="50"
//       cy="50"
//       r="46"
//       fill="none"
//       stroke="rgba(72, 33, 33, 1)"
//       strokeWidth="4"
//       strokeDasharray="10 12"
//       strokeLinecap="round"
//     />
//   </svg>

//   {/* white ring */}
//   <div className="absolute inset-[12px] rounded-full bg-white" />

//   {/* inner solid — UPDATED COLOR */}
//   <div
//     className="absolute inset-[22px] rounded-full"
//     style={{ background: "rgba(81, 33, 143, 1)" }}
//   />

// </div>


// </div>




//     {/* ================= RIGHT ================= */}
//     <div className="flex flex-col gap-[80px] text-right pl-10">

//       <div>
//   <h3 className="font-['Aclonica'] text-[42px] font-semibold text-[#334155]">
//     Experience Designer
//   </h3>
//   <p className="text-[#9CA3AF] text-[22px] mt-3 leading-[34px] max-w-[540px] ml-auto">
//     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacus nunc,
//     posuere in justo vulputate, bibendum sodales
//   </p>
// </div>

// <div>
//   <h3 className="font-['Aclonica'] text-[42px] mb-0 font-semibold text-[#334155]">
//     UI / UX Designer
//   </h3>
//   <p className="text-[#9CA3AF] text-[22px] mt-3 leading-[34px] max-w-[540px] ml-auto">
//     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacus nunc,
//     posuere in justo vulputate, bibendum sodales
//   </p>
// </div>

// <div>
//   <h3 className="font-['Aclonica'] text-[42px] font-semibold text-[#334155]">
//     Lead UX Designer
//   </h3>
// </div>

//     </div>

//   </div>

// </section>
//       {/* ======================= DISCUSS ========================== */}

//       <section className="w-full h-[420px] flex flex-col items-center justify-center mb-2">

//   {/* ---------- HEADING ---------- */}
//   <h1 className="text-[60px] font-extrabold leading-tight text-center">
//     <span className="text-[#2A3442]">Have an Awsome Project </span>
//     <br />
//     <span className="text-[#2A3442]">Idea? </span>
//     <span className="text-[#7A32DB]">Let’s Discuss</span>
//   </h1>

//   {/* ---------- OUTER WHITE ROUND BORDER ---------- */}
//   <div className="w-[900px] h-[90px] !border border-gray rounded-full mt-10 flex items-center justify-center relative">

//     {/* BUTTON */}
//     <button className="w-[250px] h-[70px] bg-[#7A32DB] text-white rounded-full text-[22px] font-medium">
//       Message me
//     </button>

//   </div>

//  {/* ---------- ICONS WITH TEXT ON RIGHT (UPDATED) ---------- */}
// <div className="flex justify-center gap-[60px] mt-7 items-center select-none">

//   {/* ⭐ Design */}
//   <div className="flex items-center gap-4">
//     <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M6 24H2" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
//       <path d="M10 15L6 13" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
//       <path d="M10 33L6 35" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
//       <path d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14Z" 
//             stroke="#2A3442" strokeWidth="3"/>
//       <path d="M24 17L26.5 22H32L27.8 25.8L29.2 31.2L24 28L18.8 31.2L20.2 25.8L16 22H21.5L24 17Z" 
//             fill="#2A3442"/>
//     </svg>

//     <p className="text-[#2A3442] text-[20px] font-medium">4.9/5 Average Ratings</p>
//   </div>

//   {/* ⚙ Development */}
//   <div className="flex items-center gap-4">
//     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M12 2L19 6V14L12 18L5 14V6L12 2Z"
//             stroke="#2A3442" strokeWidth="2" strokeLinejoin="round"/>
//       <circle cx="12" cy="12" r="3" fill="#2A3442"/>
//     </svg>

//     <p className="text-[#2A3442] text-[20px] font-medium">25+ Winning Awards</p>
//   </div>

//   {/* ✔ Quality */}
//   <div className="flex items-center gap-4">
//     <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path d="M12 2L19 6V14L12 18L5 14V6L12 2Z"
//             stroke="#2A3442" strokeWidth="2" strokeLinejoin="round"/>
//       <path d="M9.5 12.2L12 14.2L15.5 10"
//             stroke="#2A3442" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>

//     <p className="text-[#2A3442] text-[20px] font-medium">Certified Product Desiginer</p>
//   </div>

// </div>





// </section>
//       </div>

//       {/* ================= MOBILE VERSION ================= */}
//       <div className="block lg:hidden">

//         {/* HEADER */}
//         <div className="flex justify-between items-center px-5 py-4">
//           <button className="text-3xl">☰</button>

//           <h1
//             className="text-[32px] font-bold"
//             style={{
//               fontFamily: "Trochut, cursive",
//               background: "linear-gradient(270deg,#51218F,#030303)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//             }}
//           >
//             Talenta
//           </h1>

//           <div className="flex items-center gap-3">
//             <span>💬</span>
//             <span>🔔</span>
//             <img src={UserImg} className="w-9 h-9 rounded-full" />
//           </div>
//         </div>

// {/* ================= MOBILE HERO ================= */}
// <section className="w-full relative bg-white overflow-hidden">

//   <div className="relative text-center pt-4 pb-24">

//     {/* ================= HELLO ================= */}
//     <div className="relative inline-block mb-3">
//       <p
//         className="text-[14px] bg-white px-5 py-[6px] rounded-full font-medium border-[2.5px] border-black"
//         style={{ boxShadow: "0 0 0 2px black" }}
//       >
//         Hello!
//       </p>

//       <svg className="absolute -top-5 -right-6 w-[36px]" viewBox="0 0 60 60" fill="none">
//         <path
//           d="M18 42 C20 32 18 22 16 14 
//              M30 45 C36 34 42 26 50 18 
//              M38 52 C45 48 52 44 58 40"
//           stroke="#51218F"
//           strokeWidth="4"
//           strokeLinecap="round"
//         />
//       </svg>
//     </div>

//     {/* ================= TITLES ================= */}
//     <h1 className="text-[34px] font-bold leading-[40px]">
//       I'm <span className="text-[#6D28D9]">Jenny</span>,
//     </h1>

//     <div className="relative">
//       <h2 className="text-[32px] font-bold leading-[38px]">UI / UX Designer</h2>
//       <img src={BigScribble} className="absolute left-[30px] top-[22px] w-[52px]" />
//     </div>

//     {/* ================= MAIN VISUAL ================= */}
//     <div className="relative mt-10 flex justify-center">

//       {/* LEFT TESTIMONIAL */}
//       <div className="absolute left-[10px] top-[8px] w-[115px] text-left">
//         <div className="text-[28px] font-bold leading-none">“</div>
//         <p className="text-[11px] leading-[14px] font-bold text-[#2A3442]">
//           Jenny’s Exceptional product design ensure our website’s success.
//         </p>
//       </div>

//       {/* CHARACTER */}
//       <div className="relative w-full h-[360px] flex justify-center">

//         <img
//           src={HalfCircle}
//           alt="half-circle"
//           className="absolute bottom-[140px]"
//           style={{ width: "355px", height: "296px" }}
//         />

//         <img
//           src={ManImg}
//           alt="man"
//           className="absolute"
//           style={{ width: "188px", bottom: "170px" }}
//         />

//       </div>

//       {/* RIGHT EXPERIENCE */}
//       <div className="absolute right-[10px] top-[8px] w-[115px] text-center">
//         <div className="flex justify-center gap-[2px] mb-[2px]">
//           {[...Array(5)].map((_, i) => (
//             <span key={i} className="text-[14px] text-orange-500">★</span>
//           ))}
//         </div>
//         <h3 className="text-[18px] font-bold leading-none">10 Years</h3>
//         <p className="text-[11px] text-gray-600">Experience</p>
//       </div>

//     </div>

//     {/* ================= COLLABORATE BUTTON ================= */}
// <div className="flex justify-center mt-[-215px]">
//       <div className="relative w-[205px] h-[58px] ml-4">

//         <div className="absolute inset-0 rounded-full !border !border-[#E5D9FF] bg-white/10 backdrop-blur-sm" />
//         <div className="absolute inset-[3px] rounded-full !border !border-white/40" />
//         <div className="absolute inset-[7px] rounded-full 
//           bg-[radial-gradient(circle_at_30%_0%,#9D5CFF,#1A082F)]
//           shadow-[0_0_35px_rgba(157,92,255,0.9)]
//         " />

//         <button className="relative z-10 w-full h-full flex items-center justify-center gap-2 text-white text-[15px] font-semibold tracking-wide">
//           Collaborate request
//           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M7 17L17 7" />
//             <path d="M7 7h10v10" />
//           </svg>
//         </button>

//       </div>
//     </div>

//   </div>
// </section>


//        {/* ================= MOBILE SERVICES ================= */}
// <section
//   className="relative w-full mt-[-81px] px-4 py-14 rounded-[28px] overflow-hidden"

//   style={{ backgroundImage: `url(${ServicesBG})`, backgroundSize: "cover" }}
// >

//   {/* Top glow line */}
//   <div className="absolute top-6 left-0 w-full h-[2px] bg-gradient-to-r from-[#a96bff] via-[#d8baff] to-[#9b4dff] opacity-70 blur-[1px]" />

//   {/* Reflection glow */}
//   <div className="absolute bottom-[90px] left-0 w-full h-[5px] bg-gradient-to-r from-[#6d2cff] to-[#b57eff] opacity-60 blur-[6px]" />

  
//   {/* ================= HEADER ROW ================= */}
//   <div className="relative z-10 flex items-start justify-between text-white">

//     {/* LEFT — Title */}
//     <h2 className="text-[24px] font-semibold leading-tight">
//       My <span className="text-[#7C3AED]">Services</span>
//     </h2>

//     {/* RIGHT — Description */}
//     <p className="w-[180px] text-[12px] leading-[16px] opacity-90">
// Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacus nunc, posuere in justo vulputate, bibendum sodales     </p>

//   </div>

//  {/* ================= CARDS ================= */}
// <div className="relative z-10 mt-8 flex gap-5 overflow-x-auto pb-8 scrollbar-hide">

//   {serviceItems.map((item, index) => (
//     <div
//       key={index}
//       className="min-w-[90px]  rounded-[24px] p-3"
//     >


//       {/* Image */}
//       <div className=" rounded-[18px] p-2">

//         <img
//           src={item.image}
//           alt=""
//           className="w-full h-auto rounded-[14px]"
//         />

  

//       </div>
//     </div>
//   ))}

// </div>


//  {/* ================= DOTS ================= */}
// <div className="relative z-10 flex justify-center gap-2 mt-4">
//   {[0, 1, 2].map((i) => (
//     <div
//       key={i}
//       className="w-[8px] h-[8px] rounded-full bg-white"
//     />
//   ))}
// </div>


// </section>


//   {/* ================= MOBILE WORK EXPERIENCE ================= */}
// <section className="w-full px-6 pt-16 pb-24 bg-white">

//   {/* ===== TITLE ===== */}
//   <h2 className="text-center text-[28px] font-semibold mb-16">
//     My <span className="text-[#6D28D9]">Work Experience</span>
//   </h2>

//   <div className="relative">

//     {/* CENTER TIMELINE */}
//     <div
//       className="absolute left-1/2 -translate-x-1/2 top-[40px] bottom-[40px] w-[2px]"
//       style={{
//         backgroundImage:
//           "repeating-linear-gradient(to bottom, #6B7280 0, #6B7280 6px, transparent 6px, transparent 14px)",
//       }}
//     />

//     {/* ================= ITEM 1 ================= */}
//     <div className="grid grid-cols-[1fr_60px_1fr] items-start mb-20">

//       {/* LEFT */}
//       <div className="text-right pr-3">
//         <h3 className="text-[16px] font-semibold text-[#334155]">
//           Cognizant, Mumbai
//         </h3>
//         <p className="text-[12px] text-[#9CA3AF] mt-1">
//           Sep 2016 – July 2020
//         </p>
//       </div>

//       {/* NODE */}
//       <div className="flex justify-center">
//         <TimelineNode color="#5B2CA1" />
//       </div>

//       {/* RIGHT */}
//       <div className="text-left pl-3">
//         <h4 className="text-[15px] font-semibold text-[#334155]">
//           Experience Designer
//         </h4>
//         <p className="text-[12px] text-[#9CA3AF] mt-1 leading-[18px]">
// Lorem ipsum dolor sit amet, consectetur 
// adipiscing elit. Duis lacus nunc, posuere 
// in justo vulputate, bibendum sodales         </p>
//       </div>
//     </div>

//     {/* ================= ITEM 2 ================= */}
//     <div className="grid grid-cols-[1fr_60px_1fr] items-start mb-20">

//       <div className="text-right pr-3">
//         <h3 className="text-[16px] font-semibold text-[#334155]">
//           Sugee Pvt Limited, Mumbai
//         </h3>
//         <p className="text-[12px] text-[#9CA3AF] mt-1">
//           Sep 2020 – July 2023
//         </p>
//       </div>

//       <div className="flex justify-center">
//         <TimelineNode color="#5B2D2D" />
//       </div>

//       <div className="text-left pl-3">
//         <h4 className="text-[15px] font-semibold text-[#334155]">
//           UI / UX Designer
//         </h4>
//         <p className="text-[12px] text-[#9CA3AF] mt-1 leading-[18px]">
// Lorem ipsum dolor sit amet, consectetur 
// adipiscing elit. Duis lacus nunc, posuere 
// in justo vulputate, bibendum sodales         </p>
//       </div>
//     </div>

//     {/* ================= ITEM 3 ================= */}
//     <div className="grid grid-cols-[1fr_60px_1fr] items-start">

//       <div className="text-right pr-3">
//         <h3 className="text-[16px] font-semibold text-[#334155]">
//           Cinetstox, Mumbai
//         </h3>
//         <p className="text-[12px] text-[#9CA3AF] mt-1">
//           Sep 2023
//         </p>
//       </div>

//       <div className="flex justify-center">
//         <TimelineNode color="#51218F" />
//       </div>

//       <div className="text-left pl-3">
//         <h4 className="text-[15px] font-semibold text-[#334155]">
//           Lead UX Designer
//         </h4>
//       </div>
//     </div>

//   </div>

// </section>



//         {/* DISCUSS */}
//         <div className="mt-[-55px] px-6 text-center">
//           <h2 className="text-[21px] font-bold">
//             Have an Awsome Project Idea?
//             <span className="text-purple-600 block">Let’s Discuss</span>
//           </h2>

//         {/* ---------- MESSAGE BUTTON ---------- */}
// <div className="mt-4 flex justify-center">
//   <div className="relative w-[260px] h-[58px]">

//     {/* Outer glass border */}
//     <div className="absolute inset-0 rounded-full !border border-white/70 bg-white/10 backdrop-blur-sm"></div>

//     {/* Inner soft border */}
//     <div className="absolute inset-[4px] rounded-full border !border-white/40"></div>

//     {/* Main glowing button */}
//     <div
//       className="
//         absolute inset-[8px] rounded-full
//         bg-[radial-gradient(circle_at_top,#8A38F5,#2A0A4F)]
//         shadow-[0_0_30px_#8A38F5]
//       "
//     ></div>

//     {/* Button content */}
//     <button
//       className="
//         relative z-10 w-full h-full
//         flex items-center justify-center
//         text-white text-[16px] font-semibold
//       "
//     >
//       Message me
//     </button>

//   </div>
// </div>

// {/* ---------- MOBILE ICON STATS ---------- */}
// <div className="relative mt-8 w-full h-[40px] select-none">

//   {/* ⭐ LEFT */}
//   <div className="absolute left-0 flex items-center gap-2">
//     <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
//       <path d="M6 24H2" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
//       <path d="M10 15L6 13" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
//       <path d="M10 33L6 35" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
//       <path d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14Z"
//             stroke="#2A3442" strokeWidth="3"/>
//       <path d="M24 17L26.5 22H32L27.8 25.8L29.2 31.2L24 28L18.8 31.2L20.2 25.8L16 22H21.5L24 17Z"
//             fill="#2A3442"/>
//     </svg>

//     <p className="text-[#2A3442] text-[12px] font-medium">
//       4.9/5 Ratings
//     </p>
//   </div>

//   {/* 🏆 CENTER */}
//   <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
//     <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
//       <path d="M12 2L19 6V14L12 18L5 14V6L12 2Z"
//             stroke="#2A3442" strokeWidth="2" strokeLinejoin="round"/>
//       <circle cx="12" cy="12" r="3" fill="#2A3442"/>
//     </svg>

//     <p className="text-[#2A3442] text-[12px] font-medium">
//       25+ Awards
//     </p>
//   </div>

//   {/* ✔ RIGHT */}
//   <div className="absolute right-0 flex items-center gap-2">
//     <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
//       <path d="M12 2L19 6V14L12 18L5 14V6L12 2Z"
//             stroke="#2A3442" strokeWidth="2" strokeLinejoin="round"/>
//       <path d="M9.5 12.2L12 14.2L15.5 10"
//             stroke="#2A3442" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//     </svg>

//     <p className="text-[#2A3442] text-[12px] font-medium">
//       Certified
//     </p>
//   </div>

// </div>


//         </div >

//      <div className="mt-4">
//          <Footer />
//      </div>
//       </div>
//     </div>
//   );
// }


// <Footer />

 

// {/* ================= MOBILE VERSION ================= */}
// <div className="block lg:hidden">

//   {/* HEADER */}
//   <div className="flex justify-between items-center px-5 py-4">
//     <button className="text-3xl">☰</button>
//     <h1 className="text-[32px] font-bold"
//       style={{
//         fontFamily: "Trochut, cursive",
//         background: "linear-gradient(270deg,#51218F,#030303)",
//         WebkitBackgroundClip: "text",
//         WebkitTextFillColor: "transparent",
//       }}
//     >
//       Talenta
//     </h1>

//     <div className="flex items-center gap-3">
//       <span>💬</span>
//       <span>🔔</span>
//       <img src={UserImg} className="w-9 h-9 rounded-full" />
//     </div>
//   </div>

// {/* ================= MOBILE HERO ================= */}
// <div className="relative w-full bg-white pt-6 pb-24 text-center overflow-hidden">

//   {/* Hello + Scribble */}
//   <div className="relative inline-block mb-3">
//     <div className="bg-white text-black font-medium px-6 py-2 rounded-full border-2 border-black text-[15px] shadow-sm">
//       Hello!
//     </div>

//     <svg
//       className="absolute -right-7 -top-6 w-10 h-10"
//       viewBox="0 0 60 60"
//       fill="none"
//     >
//       <path
//         d="M18 42 C20 32 18 22 16 14
//            M30 45 C36 34 42 26 50 18
//            M38 52 C45 48 52 44 58 40"
//         stroke="#7A32DB"
//         strokeWidth="4"
//         strokeLinecap="round"
//       />
//     </svg>
//   </div>

//   {/* Title */}
//   <h1 className="text-[36px] font-bold leading-tight text-black">
//     I'm <span className="text-[#6D28D9]">Jenny</span>,
//   </h1>
//   <h2 className="text-[34px] font-bold text-black">
//     UI / UX Designer
//   </h2>

//   {/* Small Scribbles */}
//   <div className="absolute left-8 top-[120px]">
//     <svg width="36" height="36" viewBox="0 0 60 60" fill="none">
//       <path d="M8 30 C15 18 25 15 36 12" stroke="#7A32DB" strokeWidth="4" strokeLinecap="round"/>
//       <path d="M14 40 C20 34 30 30 42 28" stroke="#7A32DB" strokeWidth="4" strokeLinecap="round"/>
//     </svg>
//   </div>

//   {/* Character */}
//   <div className="relative w-full flex justify-center mt-8">
//     <div className="w-[300px] h-[150px] bg-gradient-to-t from-[#6D28D9] to-[#8A38F5] rounded-t-full" />
//     <img
//       src={ManImg}
//       className="absolute -top-[115px] w-[190px]"
//       alt="character"
//     />
//   </div>

//   {/* Button */}
//   <div className="mt-8 flex justify-center">
//     <div className="relative w-[280px] h-[64px] rounded-full border border-[#D8C7FF]">
//       <div className="absolute inset-[5px] rounded-full border border-white/40"></div>

//       <button
//         className="
//           absolute inset-[10px]
//           rounded-full
//           bg-[radial-gradient(circle_at_top,#8A38F5,#000)]
//           text-white
//           flex items-center justify-center gap-2
//           text-[16px] font-semibold
//           shadow-[0_0_25px_#8A38F5]
//         "
//       >
//         Collaborate request
//         <span className="text-lg">↗</span>
//       </button>
//     </div>
//   </div>
// </div>

//   {/* SERVICES */}
//   <div className="mt-16 px-6 text-white">
//     <h2 className="text-[28px] font-semibold">My <span className="text-purple-500">Services</span></h2>

//     <p className="mt-2 text-sm opacity-80">
//       Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//     </p>

//     <div className="mt-6 flex gap-4 overflow-x-auto pb-6">
//       {[Ui1, Ui2, Ui3].map((img, i) => (
//         <div key={i} className="min-w-[260px] bg-black/40 rounded-3xl p-4 shadow-lg">
//           <p className="text-lg mb-2">UI / UX Design</p>
//           <img src={img} className="rounded-xl" />
//         </div>
//       ))}
//     </div>
//   </div>

//   {/* WORK EXPERIENCE */}
//   <div className="mt-16 px-6">
//     <h2 className="text-[32px] text-center font-semibold mb-10">
//       My <span className="text-purple-600">Work Experience</span>
//     </h2>

//     <div className="space-y-10">
//       <div>
//         <h3 className="font-semibold">Cognizant, Mumbai</h3>
//         <p className="text-sm text-gray-500">Sep 2016 – July 2020</p>
//         <p className="mt-2 text-sm text-gray-600">Experience Designer</p>
//       </div>

//       <div>
//         <h3 className="font-semibold">Sugee Pvt Limited</h3>
//         <p className="text-sm text-gray-500">Sep 2020 – July 2023</p>
//         <p className="mt-2 text-sm text-gray-600">UI / UX Designer</p>
//       </div>

//       <div>
//         <h3 className="font-semibold">Cinetstox</h3>
//         <p className="text-sm text-gray-500">Sep 2023</p>
//         <p className="mt-2 text-sm text-gray-600">Lead UX Designer</p>
//       </div>
//     </div>
//   </div>

//   {/* DISCUSS */}
//   <div className="mt-16 px-6 text-center">
//     <h2 className="text-[32px] font-bold">
//       Have an Awsome Project Idea?
//       <span className="text-purple-600 block">Let’s Discuss</span>
//     </h2>

//     <button className="mt-6 w-full py-4 bg-purple-600 text-white rounded-full text-lg">
//       Message me
//     </button>

//     <div className="mt-6 space-y-3 text-sm text-gray-600">
//       <p>⭐ 4.9/5 Average Ratings</p>
//       <p>🏆 25+ Winning Awards</p>
//       <p>✔ Certified Product Designer</p>
//     </div>
//   </div>

//   <Footer />
// </div>


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/* ================== IMAGES ================== */
import UserImg from "../../assets/Landing/user.png";
import ManImg from "../../assets/Landing/man.png";
import HalfCircle from "../../assets/Landing/half-circle.png";
import BigScribble from "../../assets/Landing/scribble-big.png";
import ServicesBG from "../../assets/Landing/services.png";
import Ui1 from "../../assets/Landing/ui1.png";
import Ui2 from "../../assets/Landing/ui2.png";
import Ui3 from "../../assets/Landing/ui3.png";
import Footer from "../../component/Footer";

/* ================= API CONFIG ================= */
const API_BASE_URL = "http://localhost:8000";

/* ================= COMPONENTS ================= */
const TimelineNode = ({ color }) => (
  <div className="relative w-[48px] h-[48px] flex items-center justify-center z-10">
    <svg className="absolute inset-0" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="rgba(72,33,33,1)"
        strokeWidth="4"
        strokeDasharray="10 12"
        strokeLinecap="round"
      />
    </svg>
    <div className="absolute inset-[8px] rounded-full bg-white" />
    <div
      className="absolute inset-[16px] rounded-full"
      style={{ background: color }}
    />
  </div>
);

export default function FinderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collaboratorData, setCollaboratorData] = useState(null);
  const [portfolioItems, setPortfolioItems] = useState([]);

  // Fetch collaborator profile data
  useEffect(() => {
    const fetchCollaboratorData = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error("No user ID provided");
        }

        const response = await axios.get(
          `${API_BASE_URL}/collaborator/get/${id}`
        );
        
        if (response.data) {
          setCollaboratorData(response.data);
          
          if (response.data.portfolio_items && response.data.portfolio_items.length > 0) {
            const formattedPortfolio = response.data.portfolio_items
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((item, index) => ({
                id: item.id,
                title: item.heading || `Portfolio ${index + 1}`,
                image: `${API_BASE_URL}${item.file_url}`,
                order: item.order || index
              }));
            setPortfolioItems(formattedPortfolio);
          } else {
            // Use fallback if no portfolio items
            setPortfolioItems([
              { id: 1, image: Ui1, title: "UI/UX Design" },
              { id: 2, image: Ui2, title: "Product Design" },
              { id: 3, image: Ui3, title: "Brand Identity" }
            ]);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching collaborator profile:", err);
        setError("Failed to load profile data. Please try again.");
        
        // Fallback data for testing
        setCollaboratorData({
          name: "Jenny",
          skill_category: "UI/UX Designer",
          experience: "10 Years",
          skills_rating: 4.9,
          location: "Mumbai",
          about: "Experienced UI/UX designer with a passion for creating intuitive user experiences.",
          profile_picture_url: null,
          pricing_amount: 50,
          pricing_unit: "$",
          followers: 10000,
          skills: ["UI Design", "UX Research", "Prototyping", "Figma"]
        });
        
        // Fallback portfolio items
        setPortfolioItems([
          { id: 1, image: Ui1, title: "UI/UX Design" },
          { id: 2, image: Ui2, title: "Product Design" },
          { id: 3, image: Ui3, title: "Brand Identity" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaboratorData();
  }, [id]);

  // Simple carousel navigation
  const nextSlide = () => {
    if (portfolioItems.length <= 3) return;
    setCurrentIndex((prevIndex) => 
      prevIndex + 3 >= portfolioItems.length ? 0 : prevIndex + 3
    );
  };

  const prevSlide = () => {
    if (portfolioItems.length <= 3) return;
    setCurrentIndex((prevIndex) => 
      prevIndex - 3 < 0 ? portfolioItems.length - 3 : prevIndex - 3
    );
  };

  // Get current 3 items to display
  const getCurrentItems = () => {
    if (portfolioItems.length <= 3) {
      return portfolioItems;
    }
    
    const endIndex = currentIndex + 3;
    if (endIndex > portfolioItems.length) {
      // If we're at the end, get the last 3 items
      return portfolioItems.slice(-3);
    }
    
    return portfolioItems.slice(currentIndex, endIndex);
  };

  // Calculate experience years
  const getExperienceYears = () => {
    if (!collaboratorData?.experience) return "10 Years";
    
    const exp = collaboratorData.experience.toLowerCase();
    if (exp.includes("10") || exp.includes("ten")) return "10 Years";
    if (exp.includes("5") || exp.includes("five")) return "5 Years";
    if (exp.includes("3") || exp.includes("three")) return "3 Years";
    if (exp.includes("1") || exp.includes("one")) return "1 Year";
    return collaboratorData.experience;
  };

  // Calculate star rating
  const getStarRating = () => {
    if (!collaboratorData?.skills_rating) return 5;
    const rating = parseFloat(collaboratorData.skills_rating);
    return Math.min(Math.max(rating, 0), 5);
  };

  // Handle button clicks
  const handleCollaborateRequest = () => {
    // For now, just show an alert since you don't have the page
    alert("Collaborate request feature coming soon!");
  };

  const handleMessageClick = () => {
    // For now, just show an alert since you don't have the page
    alert("Message feature coming soon!");
  };

  // Handle portfolio image error
  const handleImageError = (e, index) => {
    const fallbackImages = [Ui1, Ui2, Ui3];
    e.target.src = fallbackImages[index % fallbackImages.length];
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !collaboratorData) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600 mb-4">User ID: {id || "Not provided"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentItems = getCurrentItems();
  const showCarouselControls = portfolioItems.length > 3;

  return (
    <div className="w-full bg-white overflow-x-hidden">
      {/* ================= DESKTOP VERSION ================= */}
      <div className="hidden lg:block">
        {/* ================= HEADER ================= */}
        <header className="relative max-w-[1440px] mx-auto h-[100px] px-[70px] pt-[12px] flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1
              className="text-[50px] font-bold leading-none"
              style={{
                fontFamily: "Trochut, cursive",
                background: "linear-gradient(270deg, #51218F 22.62%, #030303 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Talenta
            </h1>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center mt-1 ml-3 text-[16px] text-black hover:opacity-70 w-fit"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>
          </div>

          <div className="flex items-center gap-6 ml-8">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="w-[28px] h-[58px]"
            >
              <path
                d="M12 12.4C14.32 12.4 16.2 10.52 16.2 8.2C16.2 5.88 14.32 4 12 4C9.68 4 7.8 5.88 7.8 8.2C7.8 10.52 9.68 12.4 12 12.4Z"
                stroke="black"
                strokeWidth="1.8"
              />
              <path
                d="M19.2 20C19.2 16.9 15.92 14.6 12 14.6C8.08 14.6 4.8 16.9 4.8 20"
                stroke="black"
                strokeWidth="1.8"
              />
            </svg>

            <svg
              width="28"
              height="24"
              viewBox="0 0 28 24"
              fill="none"
              className="w-[28px] h-[24px]"
            >
              <path
                d="M4 3H24C25.66 3 27 4.34 27 6V16C27 17.66 25.66 19 24 19H11L5 22V19H4C2.34 19 1 17.66 1 16V6C1 4.34 2.34 3 4 3Z"
                stroke="black"
                strokeWidth="1.8"
              />
              <path d="M7 8H21" stroke="black" strokeWidth="1.8" />
              <path d="M7 12H17" stroke="black" strokeWidth="1.8" />
            </svg>

            <span className="text-[18px] font-medium">
              {collaboratorData?.name?.split(' ')[0] || "User"}
            </span>

            <img
              src={collaboratorData?.profile_picture_url ? `${API_BASE_URL}${collaboratorData.profile_picture_url}` : UserImg}
              alt="profile"
              className="w-[48px] h-[48px] rounded-full object-cover border border-gray-200"
              onError={(e) => {
                e.target.src = UserImg;
              }}
            />
          </div>
        </header>

        {/* ================= HERO SECTION ================= */}
        <section className="w-full h-[800px] relative flex items-center justify-center">
          <div className="text-center mb-100 w-[913px] h-[266px]">
            <div className="relative inline-block mt-2 ml-10">
              <p
                className="
                  text-[18px]
                  bg-white
                  px-6
                  py-2
                  inline-block
                  rounded-full
                  font-medium
                  relative
                  z-10
                  border-[3px]
                  border-black
                  mb-2
                "
                style={{
                  boxShadow: "0 0 0 2px black",
                }}
              >
                Hello!
              </p>

              <svg
                className="absolute -top-10 -right-10 w-[55px] h-[55px] z-0"
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="
                    M18 42 C20 32 18 22 16 14
                    M30 45 C36 34 42 26 50 18
                    M38 52 C45 48 52 44 58 40
                  "
                  stroke="#51218F"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1 className="text-[90px] font-bold leading-[100px] mt-6">
              I'm <span className="text-purple-600">{collaboratorData?.name || "Jenny"}</span>,
            </h1>

            <div className="relative inline-block">
              <h1 className="text-[90px] font-bold leading-[100px] -mt-2">
                {collaboratorData?.skill_category || "UI / UX Designer"}
              </h1>

              <img
                src={BigScribble}
                alt="ui-scribble"
                className="absolute -left-[80px] top-[100px] w-[65px]"
              />
            </div>

            <img
              src={HalfCircle}
              alt="half bg"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[871px] h-[575px] opacity-90"
            />

            <img
              src={ManImg}
              alt="man"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[600px] object-contain"
            />

            <div className="absolute left-1/2 -translate-x-1/2 top-[330px] w-[367px] h-[82px] flex items-center justify-center relative">
              <div
                className="
                  absolute inset-0 rounded-[50px] p-[5px]
                  bg-[#FFFFFF1A] !border !border-white border-[2px]
                  [border-style:solid]
                  [border-image-slice:1]
                  [border-image-width:2]
                  [border-image-repeat:stretch]
                  [border-image-source:radial-gradient(
                    150.36%_227.1%_at_8.75%_100%,
                    #FFFFFF_0%,
                    rgba(169, 163, 163, 0)_100%
                  )]
                  backdrop-blur-[1px]
                "
              ></div>

              <div
                className="
                  absolute inset-[5px] rounded-[50px]
                  border border-white/60 p-[5px]
                "
              ></div>

              <div
                className="
                  absolute inset-[10px] rounded-[50px]
                  !border !border-white shadow-[0_0_35px_#8A38F5]
                  bg-[radial-gradient(50%_50%_at_50%_50%,#8A38F5_0%,#000000_100%)]
                "
              ></div>

              <button
                className="
                  relative z-10 w-full h-full rounded-[50px]
                  flex items-center justify-center gap-4
                  text-white text-[26px] font-semibold -mt-2
                  hover:opacity-90 transition-opacity
                "
                onClick={handleCollaborateRequest}
              >
                Collaborate request
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </button>
            </div>
          </div>

          <div className="absolute left-[40px] top-[520px] w-[328px] flex flex-col gap-[12px]">
            <div className="text-[#2A3442] text-[48px] leading-none font-bold">
              "
            </div>
            <p className="text-[#2A3442] text-[18px] leading-[26px] font-bold">
              {collaboratorData?.name || "Jenny"}'s exceptional product design<br />
              ensures our website's success.<br />
              Highly Recommended
            </p>
          </div>

          <div className="absolute right-[100px] top-[560px] w-[169px] h-[125px] flex flex-col items-center gap-[21px]">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-[32px] ${
                    i < getStarRating() ? "text-orange-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="text-center">
              <h3 className="text-[40px] font-bold leading-none">
                {getExperienceYears()}
              </h3>
              <p className="text-[18px] text-[#444] -mt-1">Experience</p>
            </div>
          </div>
        </section>

        {/* ================= SERVICES SECTION ================= */}
        <section
          className="relative w-full h-[900px] bg-cover bg-center rounded-[45px] -mt-4"
          style={{ backgroundImage: `url(${ServicesBG})` }}
        >
          {/* TOP GLOW LINE */}
          <div className="absolute top-[40px] left-0 w-full h-[3px] bg-gradient-to-r from-[#a96bff] via-[#d8baff] to-[#9b4dff] opacity-80 blur-[1px]" />

          {/* REFLECTION LINE BELOW CARDS */}
          <div className="absolute bottom-[150px] left-0 w-full h-[6px] bg-gradient-to-r from-[#6d2cff] to-[#b57eff] opacity-60 blur-[6px]" />

          {/* TITLE ROW */}
          <div className="flex items-center justify-between w-[1299px] h-[52px] mb-[40px] mx-auto">
            <h2 className="text-[48px] mt-44 ml-8 font-semibold text-white">
              My <span className="ml-1 text-[#51218F]">Services</span>
            </h2>
            <p className="text-white text-[16px] w-[480px] mt-40 leading-[26px] relative right-[60px]">
              {collaboratorData?.about || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacus nunc, posuere in justo vulputate, bibendum sodales."}
            </p>
          </div>

          {/* 3-GRID CARDS SECTION WITH CAROUSEL */}
          <div className="relative w-[1099px] h-[462px] mx-auto mt-[190px]">
            {/* CAROUSEL CONTROLS - Only show if there are more than 3 items */}
            {showCarouselControls && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <div className="flex justify-between gap-[29px]">
              {currentItems.map((item, index) => (
                <div
                  key={item.id}
                  className="
                    transition-all duration-300 w-[413px] opacity-100
                    transform hover:scale-[1.02]
                  "
                >
                  {/* CARD WRAPPER */}
                  <div className="relative w-full h-full rounded-[55px]">
                    {/* OUTLINE LAYER */}
                    <div className="absolute inset-0 rounded-[55px] border border-white/40 pointer-events-none z-20" />

                    {/* CARD */}
                    <div
                      className="
                        relative z-10 w-full h-full rounded-[55px]
                        bg-white/5 backdrop-blur-sm p-7
                        shadow-[0_0_40px_rgba(162,95,255,0.25)]
                        hover:shadow-[0_0_60px_rgba(162,95,255,0.4)]
                        transition-shadow
                      "
                    >
                      <h3 className="text-white text-[24px] font-medium mb-5">
                        {item.title || "Portfolio Item"}
                      </h3>

                      {/* IMAGE STACK EFFECT */}
                      <div className="relative w-full h-[350px]">
                        <div className="absolute top-[10px] left-[10px] w-full h-full rounded-xl bg-white/10 blur-md" />
                        <img
                          src={item.image}
                          alt={item.title}
                          className="relative rounded-xl shadow-xl w-full h-full object-cover"
                          onError={(e) => handleImageError(e, index)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DOTS INDICATOR - Only show if there are more than 3 items */}
          {showCarouselControls && (
            <div className="flex gap-3 justify-center mt-[100px]">
              {Array.from({ length: Math.ceil(portfolioItems.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i * 3)}
                  className={`
                    w-[10px] h-[10px] rounded-full transition-all cursor-pointer
                    ${currentIndex === i * 3
                      ? "bg-white scale-150 shadow-[0_0_8px_white]"
                      : "bg-white/40 hover:bg-white/60"
                    }
                  `}
                />
              ))}
            </div>
          )}
        </section>

        {/* ================= WORK EXPERIENCE ================= */}
        <section className="w-full max-w-[1440px] mx-auto px-[70px] py-[120px] bg-white">
          <h2 className="text-center text-[60px] font-semibold mb-[120px]">
            <span className="text-[#334155]">My </span>
            <span className="text-[#6D28D9]">Work Experience</span>
          </h2>

          <div className="grid grid-cols-[1fr_120px_1fr] items-start">
            <div className="flex flex-col gap-[140px] text-left pr-10">
              <div>
                <h3 className="text-[42px] font-semibold text-[#334155]">
                  Cognizant, {collaboratorData?.location || "Mumbai"}
                </h3>
                <p className="text-[#9CA3AF] text-[22px] mt-2">
                  Sep 2016 – July 2020
                </p>
              </div>

              <div>
                <h3 className="text-[42px] font-semibold text-[#334155]">
                  Sugee Pvt limited, {collaboratorData?.location || "Mumbai"}
                </h3>
                <p className="text-[#9CA3AF] text-[22px] mt-2">
                  Sep 2020 – July 2023
                </p>
              </div>

              <div>
                <h3 className="text-[42px] font-semibold text-[#334155]">
                  Cinetstox, {collaboratorData?.location || "Mumbai"}
                </h3>
                <p className="text-[#9CA3AF] text-[22px] mt-2">
                  Sep 2023
                </p>
              </div>
            </div>

            <div className="relative flex flex-col mt-3 items-center">
              <div
                className="absolute top-[80px] bottom-[80px] w-[3px]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #6B7280 0, #6B7280 6px, transparent 6px, transparent 14px)",
                }}
              />

              <div className="relative w-[76px] h-[76px] flex items-center justify-center z-10">
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="rgba(72, 33, 33, 1)"
                    strokeWidth="4"
                    strokeDasharray="10 12"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-[12px] rounded-full bg-white" />
                <div className="absolute inset-[22px] rounded-full bg-[#5B2CA1]" />
              </div>

              <div className="h-[190px]" />

              <div className="relative w-[76px] h-[76px] flex items-center justify-center z-10">
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="rgba(72, 33, 33, 1)"
                    strokeWidth="4"
                    strokeDasharray="10 12"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-[12px] rounded-full bg-white" />
                <div className="absolute inset-[22px] rounded-full bg-[#5B2D2D]" />
              </div>

              <div className="h-[190px]" />

              <div className="relative w-[76px] h-[76px] flex items-center justify-center z-10">
                <svg className="absolute inset-0" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="rgba(72, 33, 33, 1)"
                    strokeWidth="4"
                    strokeDasharray="10 12"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-[12px] rounded-full bg-white" />
                <div className="absolute inset-[22px] rounded-full bg-[#51218F]" />
              </div>
            </div>

            <div className="flex flex-col gap-[80px] text-right pl-10">
              <div>
                <h3 className="font-['Aclonica'] text-[42px] font-semibold text-[#334155]">
                  Experience Designer
                </h3>
                <p className="text-[#9CA3AF] text-[22px] mt-3 leading-[34px] max-w-[540px] ml-auto">
                  {collaboratorData?.about || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis lacus nunc, posuere in justo vulputate, bibendum sodales."}
                </p>
              </div>

              <div>
                <h3 className="font-['Aclonica'] text-[42px] mb-0 font-semibold text-[#334155]">
                  UI / UX Designer
                </h3>
                <p className="text-[#9CA3AF] text-[22px] mt-3 leading-[34px] max-w-[540px] ml-auto">
                  Specialized in creating intuitive user interfaces and conducting user research to deliver exceptional digital experiences.
                </p>
              </div>

              <div>
                <h3 className="font-['Aclonica'] text-[42px] font-semibold text-[#334155]">
                  Lead UX Designer
                </h3>
                <p className="text-[#9CA3AF] text-[22px] mt-3 leading-[34px] max-w-[540px] ml-auto">
                  Leading design teams and managing end-to-end design processes for enterprise applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= DISCUSS SECTION ================= */}
        <section className="w-full h-[420px] flex flex-col items-center justify-center mb-2">
          <h1 className="text-[60px] font-extrabold leading-tight text-center">
            <span className="text-[#2A3442]">Have an Awesome Project </span>
            <br />
            <span className="text-[#2A3442]">Idea? </span>
            <span className="text-[#7A32DB]">Let's Discuss</span>
          </h1>

          <div className="w-[900px] h-[90px] !border border-gray rounded-full mt-10 flex items-center justify-center relative">
            <button
              className="w-[250px] h-[70px] bg-[#7A32DB] text-white rounded-full text-[22px] font-medium hover:bg-[#6a27c5] transition"
              onClick={handleMessageClick}
            >
              Message me
            </button>
          </div>

          <div className="flex justify-center gap-[60px] mt-7 items-center select-none">
            <div className="flex items-center gap-4">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
                <path d="M6 24H2" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
                <path d="M10 15L6 13" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
                <path d="M10 33L6 35" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
                <path d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14Z" 
                      stroke="#2A3442" strokeWidth="3"/>
                <path d="M24 17L26.5 22H32L27.8 25.8L29.2 31.2L24 28L18.8 31.2L20.2 25.8L16 22H21.5L24 17Z" 
                      fill="#2A3442"/>
              </svg>
              <p className="text-[#2A3442] text-[20px] font-medium">
                {getStarRating().toFixed(1)}/5 Average Ratings
              </p>
            </div>

            <div className="flex items-center gap-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L19 6V14L12 18L5 14V6L12 2Z"
                      stroke="#2A3442" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="#2A3442"/>
              </svg>
              <p className="text-[#2A3442] text-[20px] font-medium">
                25+ Winning Awards
              </p>
            </div>

            <div className="flex items-center gap-4">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L19 6V14L12 18L5 14V6L12 2Z"
                      stroke="#2A3442" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M9.5 12.2L12 14.2L15.5 10"
                      stroke="#2A3442" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[#2A3442] text-[20px] font-medium">
                Certified Product Designer
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ================= MOBILE VERSION ================= */}
      <div className="block lg:hidden">
        <div className="flex justify-between items-center px-5 py-4">
          <button className="text-3xl" onClick={() => navigate(-1)}>←</button>
          <h1
            className="text-[32px] font-bold"
            style={{
              fontFamily: "Trochut, cursive",
              background: "linear-gradient(270deg,#51218F,#030303)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Talenta
          </h1>
          <div className="flex items-center gap-3">
            <span>💬</span>
            <span>🔔</span>
            <img
              src={collaboratorData?.profile_picture_url ? `${API_BASE_URL}${collaboratorData.profile_picture_url}` : UserImg}
              className="w-9 h-9 rounded-full border border-gray-200"
              onError={(e) => {
                e.target.src = UserImg;
              }}
            />
          </div>
        </div>

        <section className="w-full relative bg-white overflow-hidden">
          <div className="relative text-center pt-4 pb-24">
            <div className="relative inline-block mb-3">
              <p
                className="text-[14px] bg-white px-5 py-[6px] rounded-full font-medium border-[2.5px] border-black"
                style={{ boxShadow: "0 0 0 2px black" }}
              >
                Hello!
              </p>
              <svg className="absolute -top-5 -right-6 w-[36px]" viewBox="0 0 60 60" fill="none">
                <path
                  d="M18 42 C20 32 18 22 16 14 
                     M30 45 C36 34 42 26 50 18 
                     M38 52 C45 48 52 44 58 40"
                  stroke="#51218F"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1 className="text-[34px] font-bold leading-[40px]">
              I'm <span className="text-[#6D28D9]">{collaboratorData?.name || "Jenny"}</span>,
            </h1>
            <div className="relative">
              <h2 className="text-[32px] font-bold leading-[38px]">
                {collaboratorData?.skill_category || "UI / UX Designer"}
              </h2>
              <img src={BigScribble} className="absolute left-[30px] top-[22px] w-[52px]" />
            </div>

            <div className="relative mt-10 flex justify-center">
              <div className="absolute left-[10px] top-[8px] w-[115px] text-left">
                <div className="text-[28px] font-bold leading-none">"</div>
                <p className="text-[11px] leading-[14px] font-bold text-[#2A3442]">
                  {collaboratorData?.name || "Jenny"}'s exceptional design ensures success.
                </p>
              </div>

              <div className="relative w-full h-[360px] flex justify-center">
                <img
                  src={HalfCircle}
                  alt="half-circle"
                  className="absolute bottom-[140px]"
                  style={{ width: "355px", height: "296px" }}
                />
                <img
                  src={ManImg}
                  alt="man"
                  className="absolute"
                  style={{ width: "188px", bottom: "170px" }}
                />
              </div>

              <div className="absolute right-[10px] top-[8px] w-[115px] text-center">
                <div className="flex justify-center gap-[2px] mb-[2px]">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-[14px] ${
                        i < getStarRating() ? "text-orange-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <h3 className="text-[18px] font-bold leading-none">
                  {getExperienceYears().split(' ')[0]}
                </h3>
                <p className="text-[11px] text-gray-600">Experience</p>
              </div>
            </div>

            <div className="flex justify-center mt-[-215px]">
              <div className="relative w-[205px] h-[58px] ml-4">
                <div className="absolute inset-0 rounded-full !border !border-[#E5D9FF] bg-white/10 backdrop-blur-sm" />
                <div className="absolute inset-[3px] rounded-full !border !border-white/40" />
                <div
                  className="absolute inset-[7px] rounded-full 
                    bg-[radial-gradient(circle_at_30%_0%,#9D5CFF,#1A082F)]
                    shadow-[0_0_35px_rgba(157,92,255,0.9)]
                  "
                />
                <button
                  className="relative z-10 w-full h-full flex items-center justify-center gap-2 text-white text-[15px] font-semibold tracking-wide hover:opacity-90"
                  onClick={handleCollaborateRequest}
                >
                  Collaborate request
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="relative w-full mt-[-81px] px-4 py-14 rounded-[28px] overflow-hidden"
          style={{ backgroundImage: `url(${ServicesBG})`, backgroundSize: "cover" }}
        >
          <div className="absolute top-6 left-0 w-full h-[2px] bg-gradient-to-r from-[#a96bff] via-[#d8baff] to-[#9b4dff] opacity-70 blur-[1px]" />
          <div className="absolute bottom-[90px] left-0 w-full h-[5px] bg-gradient-to-r from-[#6d2cff] to-[#b57eff] opacity-60 blur-[6px]" />

          <div className="relative z-10 flex items-start justify-between text-white">
            <h2 className="text-[24px] font-semibold leading-tight">
              My <span className="text-[#7C3AED]">Services</span>
            </h2>
            <p className="w-[180px] text-[12px] leading-[16px] opacity-90">
              {collaboratorData?.about?.substring(0, 100) || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
            </p>
          </div>

          {/* Mobile Carousel - Horizontal Scroll Only */}
          <div className="relative z-10 mt-8">
            <div className="flex overflow-x-auto pb-8 scrollbar-hide">
              {portfolioItems.map((item, index) => (
                <div
                  key={item.id}
                  className="min-w-[85%] mx-2 rounded-[24px] p-4 bg-white/10 backdrop-blur-sm"
                >
                  <div className="rounded-[18px] p-2">
                    <h3 className="text-white text-[16px] font-medium mb-3 text-center">
                      {item.title || "Portfolio Item"}
                    </h3>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[200px] rounded-[14px] object-cover"
                      onError={(e) => handleImageError(e, index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full px-6 pt-16 pb-24 bg-white">
          <h2 className="text-center text-[28px] font-semibold mb-16">
            My <span className="text-[#6D28D9]">Work Experience</span>
          </h2>

          <div className="relative">
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[40px] bottom-[40px] w-[2px]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #6B7280 0, #6B7280 6px, transparent 6px, transparent 14px)",
              }}
            />

            <div className="grid grid-cols-[1fr_60px_1fr] items-start mb-20">
              <div className="text-right pr-3">
                <h3 className="text-[16px] font-semibold text-[#334155]">
                  Cognizant, {collaboratorData?.location || "Mumbai"}
                </h3>
                <p className="text-[12px] text-[#9CA3AF] mt-1">
                  Sep 2016 – July 2020
                </p>
              </div>
              <div className="flex justify-center">
                <TimelineNode color="#5B2CA1" />
              </div>
              <div className="text-left pl-3">
                <h4 className="text-[15px] font-semibold text-[#334155]">
                  Experience Designer
                </h4>
                <p className="text-[12px] text-[#9CA3AF] mt-1 leading-[18px]">
                  {collaboratorData?.about?.substring(0, 100) || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_60px_1fr] items-start mb-20">
              <div className="text-right pr-3">
                <h3 className="text-[16px] font-semibold text-[#334155]">
                  Sugee Pvt Limited, {collaboratorData?.location || "Mumbai"}
                </h3>
                <p className="text-[12px] text-[#9CA3AF] mt-1">
                  Sep 2020 – July 2023
                </p>
              </div>
              <div className="flex justify-center">
                <TimelineNode color="#5B2D2D" />
              </div>
              <div className="text-left pl-3">
                <h4 className="text-[15px] font-semibold text-[#334155]">
                  UI / UX Designer
                </h4>
                <p className="text-[12px] text-[#9CA3AF] mt-1 leading-[18px]">
                  Specialized in UI/UX design with focus on user-centered solutions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_60px_1fr] items-start">
              <div className="text-right pr-3">
                <h3 className="text-[16px] font-semibold text-[#334155]">
                  Cinetstox, {collaboratorData?.location || "Mumbai"}
                </h3>
                <p className="text-[12px] text-[#9CA3AF] mt-1">
                  Sep 2023
                </p>
              </div>
              <div className="flex justify-center">
                <TimelineNode color="#51218F" />
              </div>
              <div className="text-left pl-3">
                <h4 className="text-[15px] font-semibold text-[#334155]">
                  Lead UX Designer
                </h4>
                <p className="text-[12px] text-[#9CA3AF] mt-1 leading-[18px]">
                  Leading design strategy and team management.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-[-55px] px-6 text-center">
          <h2 className="text-[21px] font-bold">
            Have an Awesome Project Idea?
            <span className="text-purple-600 block">Let's Discuss</span>
          </h2>

          <div className="mt-4 flex justify-center">
            <div className="relative w-[260px] h-[58px]">
              <div className="absolute inset-0 rounded-full !border border-white/70 bg-white/10 backdrop-blur-sm"></div>
              <div className="absolute inset-[4px] rounded-full border !border-white/40"></div>
              <div
                className="
                  absolute inset-[8px] rounded-full
                  bg-[radial-gradient(circle_at_top,#8A38F5,#2A0A4F)]
                  shadow-[0_0_30px_#8A38F5]
                "
              ></div>
              <button
                className="
                  relative z-10 w-full h-full
                  flex items-center justify-center
                  text-white text-[16px] font-semibold hover:opacity-90
                "
                onClick={handleMessageClick}
              >
                Message me
              </button>
            </div>
          </div>

          <div className="relative mt-8 w-full h-[40px] select-none">
            <div className="absolute left-0 flex items-center gap-2">
              <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
                <path d="M6 24H2" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
                <path d="M10 15L6 13" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
                <path d="M10 33L6 35" stroke="#2A3442" strokeWidth="3" strokeLinecap="round"/>
                <path d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14Z"
                      stroke="#2A3442" strokeWidth="3"/>
                <path d="M24 17L26.5 22H32L27.8 25.8L29.2 31.2L24 28L18.8 31.2L20.2 25.8L16 22H21.5L24 17Z"
                      fill="#2A3442"/>
              </svg>
              <p className="text-[#2A3442] text-[12px] font-medium">
                {getStarRating().toFixed(1)}/5 Ratings
              </p>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L19 6V14L12 18L5 14V6L12 2Z"
                      stroke="#2A3442" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" fill="#2A3442"/>
              </svg>
              <p className="text-[#2A3442] text-[12px] font-medium">
                25+ Awards
              </p>
            </div>

            <div className="absolute right-0 flex items-center gap-2">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L19 6V14L12 18L5 14V6L12 2Z"
                      stroke="#2A3442" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M9.5 12.2L12 14.2L15.5 10"
                      stroke="#2A3442" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[#2A3442] text-[12px] font-medium">
                Certified
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <Footer />
        </div>
      </div>
    </div>
  );
}