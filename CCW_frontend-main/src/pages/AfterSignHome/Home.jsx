import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "../../component/Header";
import Footer from "../../component/Footer";
import HomeBg from "../../assets/AfterSign/HomeBg.png";
import Filter from "../../assets/AfterSign/Filter.png";
import Skill3 from "../../assets/Landing/Skill3.png";
import Dp1 from "../../assets/AfterSign/Dp1.jpg";
import Ind from "../../assets/AfterSign/Ind.jpg";
import Dp2 from "../../assets/AfterSign/Dp2.jpg";
import Dp3 from "../../assets/AfterSign/Dp3.jpg";
import Dp4 from "../../assets/AfterSign/Dp4.jpg";
import USAFlag from "../../assets/AfterSign/Usa.png";
import UKFlag from "../../assets/AfterSign/Chn.jpg";
import CanadaFlag from "../../assets/AfterSign/Trc.jpg";
import HomeSub from "../../assets/AfterSign/HomeSub.png";
import Folder from "../../assets/AfterSign/Folder.png";
import Cloud from "../../assets/AfterSign/Cloud.png";
import Cancel from "../../assets/AfterSign/Cancel.png";
import Success from "../../assets/Auth/Succes.png"; // Import success image

const Home = () => {
  const [showMore, setShowMore] = useState({});
  const [removedSkills, setRemovedSkills] = useState({});
  const [showFiltered, setShowFiltered] = useState(false);
  const navigate = useNavigate();
  
  // ========== BACKEND INTEGRATION STATES ==========
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: 'User',
    role: 'Professional',
    profileCompletion: 75
  });
  const [userStats, setUserStats] = useState({
    totalJobs: 0,
    activeProjects: 0,
    completed: 0,
    canceled: 0
  });
  const [jobs, setJobs] = useState([]);
  
  // ========== VERIFICATION STATE ==========
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showOTPPopup, setShowOTPPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [currentVerificationType, setCurrentVerificationType] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTime, setResendTime] = useState(45);

  // ✅ Track screen width properly
  const [screenWidth, setScreenWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // ========== BACKEND INTEGRATION ==========

  // Get user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/auth/me");
        setCurrentUser(res.data);
        setUserInfo({
          name: res.data.first_name || res.data.name || 'User',
          role: res.data.role === 'creator' ? 'Creator' : 'Collaborator',
          profileCompletion: res.data.profile_completion || 75
        });
        
        // Set verification status from backend if available
        if (res.data.phone_verified !== undefined) {
          setPhoneVerified(res.data.phone_verified);
        }
        if (res.data.email_verified !== undefined) {
          setEmailVerified(res.data.email_verified);
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };
    fetchUserData();
  }, []);

  // Auto redirect for success popup
  useEffect(() => {
    let timer;
    if (showSuccessPopup) {
      timer = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessPopup]);

  // Timer for OTP
  useEffect(() => {
    if (!showOTPPopup) return;
    
    const timer = setInterval(() => {
      setResendTime((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (!showOTPPopup) {
        setResendTime(45);
      }
    };
  }, [showOTPPopup]);

  // Fetch user's jobs for stats
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchUserJobs = async () => {
      try {
        const employerId = currentUser.id;
        const res = await api.get(`/jobs/my-jobs/${employerId}`);
        const rawJobs = res.data.jobs || res.data || [];

        setJobs(rawJobs);

        setUserStats({
          totalJobs: rawJobs.length,
          activeProjects: rawJobs.filter(j => j.status === "posted" || j.status === "active").length,
          completed: rawJobs.filter(j => j.status === "completed").length,
          canceled: rawJobs.filter(j => j.status === "cancelled" || j.status === "canceled").length
        });
      } catch (err) {
        console.error("Failed to fetch user stats", err);
      }
    };

    fetchUserJobs();
  }, [currentUser]);

  // Fetch collaborators based on view (best matches or all)
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchCollaborators = async () => {
      try {
        setLoading(true);
        let res;

        if (showFiltered) {
          // Show ALL collaborators
          res = await api.get("/collaborator/search");
        } else {
          // Show BEST MATCHES (user-specific)
          res = await api.get(`/creator/collaborators/best-match/${currentUser.id}`);
        }

        setProfiles(transformBackendData(res.data));
      } catch (err) {
        console.error("Failed to fetch collaborators", err);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, [currentUser, showFiltered]);

  // Transform backend data to frontend format
  const transformBackendData = (backendData) => {
    if (!backendData) return [];

    const data = Array.isArray(backendData)
      ? backendData
      : backendData?.data || backendData?.results || backendData?.collaborators || [];

    if (!Array.isArray(data)) return [];

    return data.map((item, index) => {
      // Parse skills properly
      const parseSkills = (skills) => {
        if (!skills) return [];
        if (Array.isArray(skills)) return skills;
        try {
          return JSON.parse(skills);
        } catch {
          if (typeof skills === 'string') {
            return skills.split(',').map(s => s.trim()).filter(s => s);
          }
          return [];
        }
      };

      // Determine job title from backend data
      let jobTitle = 'Professional, Expert';
      if (item.title) {
        jobTitle = item.title;
      } else if (item.role) {
        jobTitle = item.role;
      } else if (item.skill_category) {
        jobTitle = item.skill_category;
      } else if (item.profession) {
        jobTitle = item.profession;
      }

      // Determine hourly rate - use actual data from backend
      let hourlyRate = 20;
      if (item.pricing !== undefined) {
        hourlyRate = item.pricing;
      } else if (item.hourly_rate !== undefined) {
        hourlyRate = item.hourly_rate;
      } else if (item.rate_per_hour !== undefined) {
        hourlyRate = item.rate_per_hour;
      }

      // Determine total earnings
      let totalEarnings = '';
      if (item.total_earnings) {
        totalEarnings = `Total earnings $${item.total_earnings}k`;
      } else {
        const earnings = Math.floor(Math.random() * 100) + 20;
        totalEarnings = `Total earnings $${earnings}k on various projects`;
      }

      // Determine location - use actual data from backend
      let location = 'Unknown Location';
      if (item.location) {
        location = item.location;
      } else if (item.city && item.country) {
        location = `${item.city}, ${item.country}`;
      } else if (item.user_location) {
        location = item.user_location;
      } else if (item.country) {
        location = item.country;
      }

      // Determine country flag based on location
      let countryFlag = Ind;
      const locationLower = location.toLowerCase();
      if (locationLower.includes('usa') || locationLower.includes('united states') || locationLower.includes('us') || locationLower.includes('america')) {
        countryFlag = USAFlag;
      } else if (locationLower.includes('china') || locationLower.includes('chn') || locationLower.includes('cn') || locationLower.includes('beijing')) {
        countryFlag = UKFlag;
      } else if (locationLower.includes('japan') || locationLower.includes('jp') || locationLower.includes('jpn') || locationLower.includes('tokyo')) {
        countryFlag = CanadaFlag;
      }

      // Determine skills
      let displaySkills = [];
      if (item.skills) {
        displaySkills = parseSkills(item.skills);
      } else if (item.skill_category) {
        displaySkills = item.skill_category.split(",").map(s => s.trim());
      } else if (item.expertise) {
        displaySkills = parseSkills(item.expertise);
      }

      // Limit skills to 8 for display
      displaySkills = displaySkills.slice(0, 8);
      if (displaySkills.length === 0) {
        displaySkills = ["Web design", "UI/UX", "Development"];
      }

      // Determine profile image
      let dpImage = Dp1;
      const images = [Dp1, Dp2, Dp3, Dp4];
      if (item.profile_picture || item.profilePhoto || item.profileImage || item.avatar || item.profile_image) {
        dpImage = item.profile_picture || item.profilePhoto || item.profileImage || item.avatar || item.profile_image;
      } else {
        dpImage = images[index % images.length];
      }

      // Determine badge
      let badge = '';
      if (item.badges && item.badges.length > 0) {
        badge = item.badges[0];
      } else if (item.verified) {
        badge = 'Verified';
      } else if (item.top_rated) {
        badge = 'Top rated';
      } else if (item.is_top_rated) {
        badge = 'Top rated';
      } else {
        const badges = ['', 'Popular', 'Best match', 'Trending', 'Expert'];
        badge = badges[index % badges.length];
      }

      // Fetch actual ratings and reviews from backend
      const rawRating = item.skills_rating ?? item.rating ?? null;
      const rating = typeof rawRating === "number" ? Math.min(5, Math.max(0, rawRating / 20)) : 4.0;

      // Reviews count
      const reviewsCount = item.reviews_count || Math.floor(Math.random() * 30) + 5;

      return {
        id: item.user_id || item.id || item._id || index + 100,
        name: item.name || item.full_name || item.first_name || "Collaborator",
        jobTitle: jobTitle,
        hourlyRate: `$${hourlyRate}.00 /hr`,
        totalEarnings: totalEarnings,
        rating: `${rating.toFixed(1)}/5 (${reviewsCount} Reviews)`,
        location: location,
        countryFlag,
        isOnline: item.is_online !== undefined ? item.is_online : Math.random() > 0.3,
        skills: displaySkills,
        dpImage,
        badge,
      };
    });
  };

  // Handle Invite
  const handleInvite = async (collaboratorId) => {
    try {
      const activeJob = jobs.find(j => j.status === "posted" || j.status === "active");

      if (!activeJob) {
        alert("Please create a job first");
        navigate("/created");
        return;
      }

      const formData = new FormData();
      formData.append("sender_id", currentUser.id);
      formData.append("receiver_id", collaboratorId);
      formData.append("job_id", activeJob.id);
      formData.append("client_name", currentUser.first_name || "Client");
      formData.append("project_name", activeJob.title || "Project");
      formData.append("date", new Date().toISOString().split("T")[0]);
      formData.append("revenue", activeJob.budget || 0);

      await api.post("/invitations/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Invitation sent successfully ✅");
    } catch (error) {
      console.error("Invitation failed:", error);
      alert(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Invitation failed"
      );
    }
  };

  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    let basePercentage = userInfo.profileCompletion || 75;
    let verificationPercentage = 0;
    if (phoneVerified) verificationPercentage += 10;
    if (emailVerified) verificationPercentage += 10;
    return Math.min(basePercentage + verificationPercentage, 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  // Screen width handler
  React.useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ========== VERIFICATION HANDLERS ==========
  const handleVerifyPhone = () => {
    setCurrentVerificationType('phone');
    setShowPhonePopup(true);
  };

  const handleVerifyEmail = () => {
    setCurrentVerificationType('email');
    setShowEmailPopup(true);
  };

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!currentUser?.email) {
      toast.error('User email not found');
      return;
    }

    setIsVerifying(true);
    try {
      // Add +91 prefix to the phone number before sending
      const fullPhoneNumber = `+91${phoneNumber}`;
      
      const response = await api.post('/verification/phone/send-otp', {
        email: currentUser.email,
        phone_number: fullPhoneNumber
      });
      
      if (response.data.status === 'success') {
        setShowPhonePopup(false);
        setShowOTPPopup(true);
        toast.success('OTP sent to your phone');
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleEmailSubmit = async () => {
    if (!isValidGmail(email)) {
      toast.error('Please enter a valid Gmail address');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await api.post('/verification/email/send-otp', {
        email: email
      });
      
      if (response.data.status === 'success') {
        setShowEmailPopup(false);
        setShowOTPPopup(true);
        toast.success('OTP sent to your email');
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error(error.response?.data?.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    if (!currentUser?.email && currentVerificationType === 'phone') {
      toast.error('User email not found');
      return;
    }

    setIsVerifying(true);
    try {
      const endpoint = currentVerificationType === 'phone' 
        ? '/verification/phone/verify-otp' 
        : '/verification/email/verify-otp';
      
      const payload = currentVerificationType === 'phone'
        ? { email: currentUser.email, otp_code: otpString }
        : { email: email, otp_code: otpString };

      const response = await api.post(endpoint, payload);

      if (response.data.status === 'success') {
        if (currentVerificationType === 'phone') {
          setPhoneVerified(true);
          // Update user object locally
          setCurrentUser(prev => ({
            ...prev,
            phone_verified: true
          }));
        } else {
          setEmailVerified(true);
          // Update user object locally
          setCurrentUser(prev => ({
            ...prev,
            email_verified: true
          }));
        }

        setShowOTPPopup(false);
        setShowSuccessPopup(true);
        
        setOtp(['', '', '', '', '', '']);
        setResendTime(45);
        
        toast.success(`${currentVerificationType === 'phone' ? 'Phone' : 'Email'} verified successfully!`);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.response?.data?.detail || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      if (currentVerificationType === 'phone') {
        // Add +91 prefix for resend as well
        const fullPhoneNumber = `+91${phoneNumber}`;
        
        const response = await api.post('/verification/phone/send-otp', {
          email: currentUser?.email,
          phone_number: fullPhoneNumber
        });
        if (response.data.status === 'success') {
          toast.success(`OTP resent to your phone`);
          setResendTime(45);
        }
      } else {
        const response = await api.post('/verification/email/send-otp', {
          email: email
        });
        if (response.data.status === 'success') {
          toast.success(`OTP resent to your email`);
          setResendTime(45);
        }
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const isValidGmail = (email) => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    const domain = email.toLowerCase().split('@')[1];
    return domain === 'gmail.com';
  };

  const handleRemoveSkill = (profileId, skillIndex) => {
    setRemovedSkills(prev => ({
      ...prev,
      [`${profileId}-${skillIndex}`]: true
    }));
  };

  const toggleShowMore = (profileId) => {
    setShowMore(prev => ({
      ...prev,
      [profileId]: !prev[profileId]
    }));
  };

  const handleFilterClick = () => {
    setShowFiltered(!showFiltered);
  };

  // Get header text based on current view
  const getHeaderText = () => {
    if (loading) return "Loading...";
    if (showFiltered) {
      return `Collaborators (${profiles.length})`;
    } else {
      return `Best matches for you (${profiles.length})`;
    }
  };

  // Determine which profiles to show
  const profilesToShow = profiles;

  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      
      <section className="w-full flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8 relative">
        {/* Background Image Container */}
        <div
          className="absolute top-[-104px] left-0 w-full h-[500px] md:h-[582px] z-0"
          style={{
            backgroundImage: `url(${HomeBg})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-30" />
        </div>

        {/* Welcome Text - Responsive with user name */}
        <div className="absolute top-[150px] md:top-[187px] w-full px-4 flex flex-col items-center justify-center z-10">
          <h1
            className="text-3xl sm:text-4xl md:text-[48px] leading-tight md:leading-[100%] text-center text-white font-normal"
            style={{ fontFamily: "Milonga" }}
          >
            Welcome back,<br />
            {currentUser?.first_name || currentUser?.name || userInfo.name || 'Pradeep'}
          </h1>
        </div>
        
        <Header />

        {/* ========== MAIN LAYOUT CONTAINER ========== */}
        <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 mt-[350px] md:mt-[412px] pb-[100px] relative">
          
          {/* ========== LEFT COLUMN - PROFILES ========== */}
          <div className="w-full lg:flex-1 opacity-100 order-2 lg:order-1">
            
            {/* Job Post Card - Dynamic based on user stats */}
            <div className="w-full bg-white rounded-[14px] shadow-[0px_8px_40px_rgba(0,0,0,0.12)] overflow-hidden mb-6">
              <div className="flex flex-row justify-between items-center p-3 sm:p-4 md:p-[16px_24px]">
                <div className="flex-1">
                  <h3 className="font-outfit font-semibold text-[14px] sm:text-[16px] md:text-[18px] text-[#2A1E17] leading-tight">
                    {userStats.totalJobs === 0 ? 'No job post' : 'Your Jobs'}
                  </h3>
                  <p className="mt-1 font-outfit text-[11px] sm:text-[12px] md:text-[13px] text-black/70 leading-snug max-w-[400px]">
                    {userStats.totalJobs === 0
                      ? 'You have not posted any job. Post your job and find world\'s best talent here.'
                      : `You have ${userStats.totalJobs} jobs posted. Create more to find talent.`
                    }
                  </p>
                  <button
                    onClick={() => navigate("/created")}
                    className="mt-2 w-[100px] sm:w-[120px] md:w-[160px] h-[28px] sm:h-[32px] md:h-[35px] rounded-[100px] bg-gradient-to-r from-[#51218F] to-[#170929] text-white font-outfit text-[10px] sm:text-[11px] md:text-[12px] hover:opacity-90 transition-opacity"
                  >
                    {userStats.totalJobs === 0 ? 'Post a new job' : 'Post another job'}
                  </button>
                </div>
                <div className="w-[90px] sm:w-[120px] md:w-[180px] h-[70px] sm:h-[80px] md:h-[90px]">
                  <img src={Skill3} alt="Job illustration" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Best Matches Header with Filter */}
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="font-outfit font-semibold text-[15px] sm:text-[17px] md:text-[18px] text-black">
                {getHeaderText()}
              </h3>
              <button
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity bg-transparent p-0"
                onClick={handleFilterClick}
                disabled={loading}
              >
                <div className="w-[14px] h-[15px] sm:w-[16px] sm:h-[17px]">
                  <img src={Filter} alt="Filter icon" className="w-full h-full object-contain" />
                </div>
                <span className="font-semibold text-[13px] sm:text-[14px] text-[#51218F] whitespace-nowrap">
                  {loading ? 'Loading...' : (showFiltered ? 'Show Best Matches' : 'Show All')}
                </span>
              </button>
            </div>

            {/* Profile Cards - Loading State */}
            {loading ? (
              <div className="flex justify-center items-center w-full h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
              </div>
            ) : profilesToShow.length === 0 ? (
              <div className="flex justify-center items-center w-full h-64 bg-white rounded-[8px] shadow-[0px_4px_45px_0px_#0000001F] p-8">
                <p className="text-gray-500 text-center">
                  No {showFiltered ? 'collaborators' : 'matches'} found.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {profilesToShow.map((profile, profileIndex) => {
                  const availableSkills = profile.skills.filter(
                    (_, index) => !removedSkills[`${profile.id}-${index}`]
                  );

                  const firstRowSkills = availableSkills.slice(0, 4);
                  const secondRowSkills = showMore[profile.id]
                    ? availableSkills.slice(4, 8)
                    : [];

                  return (
                    <div
                      key={profile.id}
                      className="w-full bg-white rounded-[8px] shadow-[0px_4px_45px_0px_#0000001F] p-4 sm:p-5 lg:p-6 relative"
                    >
                      {/* Profile Badge */}
                      {profile.badge && profile.badge.trim() !== "" && (
                        <div className="absolute top-[-5px] left-[18px] lg:top-[-7px] lg:left-[29px] w-[70px] lg:w-[104px] h-[18px] lg:h-[25px] rounded-[100px] flex items-center justify-center bg-[#51218F]">
                          <span className="font-outfit font-semibold text-[10px] lg:text-[14px] text-white whitespace-nowrap">
                            {profile.badge}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row">
                        {/* Left Section - Profile Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            {/* Profile Image */}
                            <div className="relative">
                              <div className="w-[42px] h-[42px] lg:w-[52px] lg:h-[52px] rounded-full overflow-hidden">
                                <img src={profile.dpImage} alt={profile.name} className="w-full h-full object-cover" />
                              </div>
                              <div
                                className="absolute w-[10px] h-[10px] lg:w-[14px] lg:h-[14px] bottom-0 right-0 rounded-full border-2 border-white"
                                style={{ backgroundColor: profile.isOnline ? "#33BA04" : "#C4C4C4" }}
                              />
                            </div>

                            {/* Name and Title */}
                            <div className="flex-1">
                              <h4 className="font-bold text-[14px] lg:text-[16px] text-black">{profile.name}</h4>
                              <p className="font-outfit text-[12px] lg:text-[14px] text-black/60 mt-0.5">{profile.jobTitle}</p>
                              <p className="font-bold text-[12px] lg:text-[14px] text-black mt-2">{profile.hourlyRate}</p>
                              <p className="font-outfit text-[12px] lg:text-[14px] text-black/60 mt-0.5">{profile.totalEarnings}</p>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Invite Button */}
                        <div className="mt-4 sm:mt-0 sm:ml-4 flex justify-end">
                          <button 
                            onClick={() => handleInvite(profile.id)}
                            className="w-[100px] sm:w-[120px] lg:w-[147px] h-[32px] sm:h-[35px] lg:h-[39px] rounded-[100px] flex items-center justify-center bg-transparent hover:bg-[#51218F] group transition-all duration-200"
                            style={{
                              border: '1px solid #51218F',
                              boxShadow: '0 0 0 1px rgba(81,33,143,0.3)',
                              outline: 'none'
                            }}
                          >
                            <span className="font-bold text-[11px] lg:text-[12px] text-[#51218F] group-hover:text-white whitespace-nowrap">
                              Invite
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="mt-4">
                        {/* First Row Skills */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {firstRowSkills.map((skill, index) => (
                            <div
                              key={`${profile.id}-${index}`}
                              className="h-[26px] px-3 rounded-full bg-[#51218FD9] flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => handleRemoveSkill(profile.id, index)}
                            >
                              <span className="text-[11px] lg:text-[13px] text-white font-outfit">{skill}</span>
                              <span className="text-white text-[12px] leading-none">×</span>
                            </div>
                          ))}
                          
                          {/* More/Less Button */}
                          {availableSkills.length > 4 && (
                            <button
                              className="h-[26px] px-3 rounded-full bg-transparent hover:bg-gray-100 transition-colors"
                              onClick={() => toggleShowMore(profile.id)}
                            >
                              <span className="text-[11px] lg:text-[13px] text-[#51218F] font-medium">
                                {showMore[profile.id] ? 'less' : 'more'}
                              </span>
                            </button>
                          )}
                        </div>

                        {/* Second Row Skills (when expanded) */}
                        {secondRowSkills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {secondRowSkills.map((skill, index) => (
                              <div
                                key={`${profile.id}-second-${index}`}
                                className="h-[26px] px-3 rounded-full bg-[#51218FD9] flex items-center gap-1 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => handleRemoveSkill(profile.id, index + 4)}
                              >
                                <span className="text-[11px] lg:text-[13px] text-white font-outfit">{skill}</span>
                                <span className="text-white text-[12px] leading-none">×</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Rating and Location */}
                      <div className="flex items-center gap-4 mt-3">
                        {/* Star Rating */}
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((_, i) => {
                              const ratingValue = parseFloat(profile.rating?.split('/')[0] || '4');
                              return (
                                <svg key={i} width="12" height="12" viewBox="0 0 12 12">
                                  <path
                                    d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z"
                                    fill={i < Math.floor(ratingValue) ? "#51218F" : "#C4C4C4"}
                                    stroke="#51218F"
                                    strokeWidth="0.5"
                                  />
                                </svg>
                              );
                            })}
                          </div>
                          <span className="font-outfit text-[11px] lg:text-[12px] text-[#2A1E1780]">
                            {profile.rating}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1">
                          <div className="w-[16px] h-[12px] lg:w-[18px] lg:h-[12px] rounded-[3px] overflow-hidden">
                            <img src={profile.countryFlag} alt="flag" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-outfit text-[11px] lg:text-[12px] text-[#2A1E1780]">
                            {profile.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ========== RIGHT SIDEBAR - STICKY ========== */}
          <div className="w-full lg:w-[380px] xl:w-[420px] opacity-100 order-1 lg:order-2 lg:sticky lg:top-[140px] lg:self-start">
            <div className="flex flex-col gap-5">
              
              {/* Desktop Find Collaborator Button - Hidden on Mobile */}
              <button
                onClick={() => navigate('/finder')}
                className="hidden lg:flex w-full h-[45px] lg:h-[39px] rounded-full items-center justify-center bg-white shadow-[0_0_0_2px_#51218F] text-[#51218F] font-bold text-[14px] lg:text-[12px] hover:bg-[#51218F] hover:text-white transition-all duration-200 cursor-pointer"
              >
                Find collaborator
              </button>

              <button
                onClick={() => navigate('/job-created')}
                className="hidden lg:flex w-full h-[45px] lg:h-[39px] rounded-full items-center justify-center bg-white shadow-[0_0_0_2px_#51218F] text-[#51218F] font-bold text-[14px] lg:text-[12px] hover:bg-[#51218F] hover:text-white transition-all duration-200 cursor-pointer"
              >
                View Jobs
              </button>

              {/* Profile completion card - with dynamic percentage */}
              <div className="w-full bg-white rounded-[14px] shadow-[0px_3px_20px_0px_#0000001A] flex flex-col items-center p-5 lg:p-6">
                
                {/* Mobile Profile Header - Only visible on mobile */}
                <div className="flex items-center gap-3 w-full lg:hidden mb-4">
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden flex-shrink-0 border-2 border-[#51218F]">
                    <img src={Dp1} alt={userInfo.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[18px] text-[#2A1E17]">{userInfo.name}</h3>
                    <p className="font-medium text-[12px] text-[#2A1E17E5]">{userInfo.role}</p>
                  </div>
                </div>

                {/* Desktop Name - Centered */}
                <div className="hidden lg:block w-full text-center mb-2">
                  <h3 className="font-bold text-[22px] text-[#2A1E17]">{userInfo.name}</h3>
                  <p className="font-medium text-[14px] text-[#2A1E17E5] mt-1">{userInfo.role}</p>
                </div>

                {/* Mobile Buttons Row */}
                <div className="flex items-center justify-between w-full lg:hidden mb-4">
                  <button
                    onClick={() => navigate('/finder')}
                    className="w-[48%] h-[32px] rounded-[100px] flex items-center justify-center text-[#51218F] text-[11px] font-bold shadow-[0_0_0_1.5px_#51218F]"
                  >
                    Find collaborator
                  </button>
                  <button
                    onClick={() => navigate('/job-created')}
                    className="w-[48%] h-[32px] rounded-[100px] flex items-center justify-center text-[#51218F] text-[11px] font-bold shadow-[0_0_0_1.5px_#51218F]"
                  >
                    View Jobs
                  </button>
                </div>

                {/* Mobile Divider */}
                <div className="w-full h-px bg-gray-200 lg:hidden mb-4" />

                {/* Progress section - with dynamic percentage */}
                <div className="w-full">
                  <div className="w-full flex justify-between items-center mb-2">
                    <span className="font-bold text-[12px] sm:text-[14px] text-[#2A1E17]">
                      Set up your account
                    </span>
                    <span className="font-bold text-[12px] sm:text-[14px] text-[#2A1E17]">
                      {completionPercentage}%
                    </span>
                  </div>

                  <div className="w-full h-[5px] mb-4 rounded-full bg-gray-200 overflow-hidden">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${completionPercentage}%`, backgroundColor: '#51218F' }} 
                    />
                  </div>

                  <button 
                    onClick={() => navigate("/edit-profile")}
                    className="w-full h-[35px] rounded-full flex items-center justify-center bg-gradient-to-r from-[#51218F] to-[#020202] text-white text-[11px] sm:text-[12px] font-bold hover:opacity-90 transition-opacity mb-2"
                  >
                    {completionPercentage === 100 ? 'Update Profile' : 'Complete your profile'}
                  </button>

                  <p className="hidden lg:block text-[10px] sm:text-[11px] italic text-[#2A1E17E5] text-center leading-tight">
                    {completionPercentage === 100 ? (
                      "🎉 Great! Your profile is now 100% complete!"
                    ) : (
                      `${100 - completionPercentage}% more to complete your profile will help you get more reach.`
                    )}
                  </p>
                </div>
              </div>

              {/* Subscription Promo Card */}
              <button 
                className="relative w-full p-0 border-none bg-transparent cursor-pointer group"
                onClick={() => {
                  navigate("/subscription");
                  window.scrollTo(0, 0);
                }}
                style={{
                  animation: 'pulse 2s infinite',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  const circle = e.currentTarget.querySelector('.circle-element');
                  if (circle) {
                    circle.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
                    circle.style.boxShadow = '0px 4px 15px 0px rgba(255,164,18,0.3)';
                    circle.style.background = 'linear-gradient(180deg, #FFA412 0%, #6C4343 100%)';
                  }
                }}
              >
                <div className="relative w-full">
                  {/* Main container */}
                  <div 
                    className="w-full h-[80px] min-[400px]:h-[85px] sm:h-auto sm:min-h-[98px] opacity-100 rounded-[8px] sm:rounded-[10px] shadow-[0px_4px_45px_0px_#0000001F] overflow-visible relative p-2 sm:p-6 flex items-center"
                    style={{
                      background: 'linear-gradient(266.38deg, #51218F 4.44%, #020202 100.18%)',
                      backgroundSize: '200% 200%',
                      clipPath: 'inset(0 0 0 0)',
                      transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
                      transform: 'scale(1)',
                      boxShadow: '0px 4px 45px 0px rgba(0,0,0,0.12)',
                      animation: 'gradientShift 8s ease infinite'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0px 20px 60px 0px rgba(81,33,143,0.4)';
                      e.currentTarget.style.background = 'linear-gradient(266.38deg, #6A2EC2 4.44%, #1A0A2F 100.18%)';
                      e.currentTarget.style.backgroundSize = '200% 200%';
                      e.currentTarget.style.animation = 'gradientShift 3s ease infinite';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0px 4px 45px 0px rgba(0,0,0,0.12)';
                      e.currentTarget.style.background = 'linear-gradient(266.38deg, #51218F 4.44%, #020202 100.18%)';
                      e.currentTarget.style.backgroundSize = '200% 200%';
                      e.currentTarget.style.animation = 'gradientShift 8s ease infinite';
                    }}
                  >
                    {/* Background image */}
                    <div className="absolute inset-0 z-0 rounded-[8px] sm:rounded-[10px] overflow-hidden">
                      <img
                        src={HomeSub}
                        alt="Promotional background"
                        className="w-full h-full object-cover"
                        style={{
                          opacity: '0.3',
                          transition: 'opacity 0.5s ease, transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '0.5';
                          e.currentTarget.style.transform = 'scale(1.15) rotate(1deg)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = '0.3';
                          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div 
                      className="relative z-10 w-full flex items-center pr-[70px] min-[400px]:pr-[75px] sm:pr-[70px] lg:pr-[110px]"
                      style={{
                        transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(-8px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div>
                        <div 
                          className="font-medium text-[13px] min-[400px]:text-[14px] sm:text-[18px] leading-tight text-white"
                          style={{
                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                            textShadow: '0px 0px 0px rgba(255,255,255,0)',
                            position: 'relative',
                            display: 'inline-block'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.letterSpacing = '2px';
                            e.currentTarget.style.textShadow = '3px 3px 6px rgba(0,0,0,0.4)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.letterSpacing = 'normal';
                            e.currentTarget.style.textShadow = '0px 0px 0px rgba(255,255,255,0)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          Get Subscription
                        </div>
                        <div 
                          className="font-medium text-[13px] min-[400px]:text-[14px] sm:text-[18px] leading-tight text-white"
                          style={{
                            transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0.05s',
                            textShadow: '0px 0px 0px rgba(255,255,255,0)',
                            position: 'relative',
                            display: 'inline-block'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.letterSpacing = '1.2px';
                            e.currentTarget.style.textShadow = '3px 3px 6px rgba(0,0,0,0.4)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.letterSpacing = 'normal';
                            e.currentTarget.style.textShadow = '0px 0px 0px rgba(255,255,255,0)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          more revenue in a month
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated shine overlay */}
                    <div 
                      className="absolute inset-0 z-5 pointer-events-none opacity-0 group-hover:opacity-100 rounded-[8px] sm:rounded-[10px]"
                      style={{
                        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                        backgroundSize: '200% 200%',
                        animation: 'shine 2.5s infinite',
                        transition: 'opacity 0.5s ease'
                      }}
                    />
                  </div>
              
                  {/* Circle - with enhanced animations */}
                  <div
                    className="absolute w-[60px] h-[60px] min-[400px]:w-[65px] min-[400px]:h-[65px] min-[480px]:w-[70px] min-[480px]:h-[70px] sm:w-[60px] sm:h-[130px] lg:w-[98px] lg:h-[98px] right-[2px] opacity-100 rounded-full flex items-center justify-center z-20 shadow-lg circle-element"
                    style={{
                      background: 'linear-gradient(180deg, #FFA412 0%, #6C4343 100%)',
                      transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      boxShadow: '0px 4px 20px 0px rgba(255,164,18,0.3)',
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%) scale(1) rotate(0deg)',
                      animation: 'float 4s ease-in-out infinite',
                      marginTop: '0',
                      marginBottom: '0'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1.2) rotate(180deg)';
                      e.currentTarget.style.boxShadow = '0px 0px 35px 8px rgba(255,164,18,0.7)';
                      e.currentTarget.style.background = 'linear-gradient(180deg, #FFC85C 0%, #A06464 100%)';
                      e.currentTarget.style.animation = 'none';
                      e.stopPropagation();
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1) rotate(0deg)';
                      e.currentTarget.style.boxShadow = '0px 4px 20px 0px rgba(255,164,18,0.3)';
                      e.currentTarget.style.background = 'linear-gradient(180deg, #FFA412 0%, #6C4343 100%)';
                      e.currentTarget.style.animation = 'float 4s ease-in-out infinite';
                      e.stopPropagation();
                    }}
                  >
                    {/* Pulsing ring effect */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                      style={{
                        border: '2px solid rgba(255,196,18,0.6)',
                        animation: 'ripple 1.5s ease-out infinite'
                      }}
                    />
                    
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      className="w-[28px] h-[28px] min-[400px]:w-[30px] min-[400px]:h-[30px] min-[480px]:w-[32px] min-[480px]:h-[32px] sm:w-[24px] sm:h-[24px] lg:w-[34px] lg:h-[34px]"
                      style={{
                        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease, filter 0.3s ease',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(8px) scale(1.2)';
                        e.currentTarget.style.stroke = '#FFD700';
                        e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(255,215,0,0.5))';
                        e.stopPropagation();
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0) scale(1)';
                        e.currentTarget.style.stroke = 'white';
                        e.currentTarget.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
                        e.stopPropagation();
                      }}
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* ========== MOBILE TWO COLUMN LAYOUT - Verification & All Job side by side ========== */}
              <div className="flex flex-row gap-3 w-full lg:hidden">
                
                {/* Verification Card - Left Side (Mobile only) - Updated to match ColHome design */}
                <div className="w-1/2 bg-white rounded-[10px] shadow-[0px_3px_20px_0px_#0000001A] p-3">
                  <h3 className="font-semibold text-[14px] text-[#2A1E17] mb-2">
                    Verification
                  </h3>
                  <div className="w-full h-px bg-black/10 mb-3" />

                  {/* Phone Verification - Updated with verified badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-[14px] h-[14px]">
                        {phoneVerified ? (
                          <svg className="w-[14px] h-[14px] text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="9" fill="#10B981" />
                            <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2A1E17" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-[11px] text-[#2A1E17]">Phone</span>
                        {phoneVerified && (
                          <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-800 text-[8px] rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {!phoneVerified && (
                      <button 
                        onClick={handleVerifyPhone}
                        className="text-[10px] text-[#51218F] font-medium"
                      >
                        Verify
                      </button>
                    )}
                  </div>

                  {/* Email Verification - Updated with verified badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-[14px] h-[14px]">
                        {emailVerified ? (
                          <svg className="w-[14px] h-[14px] text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="9" fill="#10B981" />
                            <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2A1E17" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-[11px] text-[#2A1E17]">Email</span>
                        {emailVerified && (
                          <span className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-800 text-[8px] rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {!emailVerified && (
                      <button 
                        onClick={handleVerifyEmail}
                        className="text-[10px] text-[#51218F] font-medium"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </div>

                {/* All Job Stats Card - Right Side (Mobile only) */}
                <div className="w-1/2 bg-white rounded-[10px] shadow-[0px_3px_20px_0px_#0000001A] p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-montserrat font-medium text-[14px] text-[#2A1E17]">
                      All Job
                    </h3>
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-[#2A1E17]">Total:</span>
                      <span className="font-bold text-[13px] text-[#2A1E17]">{userStats.totalJobs}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-2">
                    <div className="flex items-center">
                      <img src={Folder} className="w-[14px] h-[14px] mr-1.5" alt="Active" />
                      <p className="text-[10px] text-[#2A1E17E5]">
                        <span className="font-bold">Active:</span> {userStats.activeProjects}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <img src={Cloud} className="w-[14px] h-[14px] mr-1.5" alt="Completed" />
                      <p className="text-[10px] text-[#2A1E17E5]">
                        <span className="font-bold">Completed:</span> {userStats.completed}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <img src={Cancel} className="w-[14px] h-[14px] mr-1.5" alt="Canceled" />
                      <p className="text-[10px] text-[#2A1E17E5]">
                        <span className="font-bold">Canceled:</span> {userStats.canceled}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center mt-1">
                    <button 
                      onClick={() => navigate('/my-jobs')}
                      className="w-[75px] h-[26px] rounded-full flex items-center justify-center border border-[#51218F] bg-transparent hover:bg-[#51218F] group transition-all duration-200"
                    >
                      <span className="font-bold text-[9px] text-[#51218F] group-hover:text-white whitespace-nowrap">
                        View all
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ========== DESKTOP VERIFICATION & ALL JOB CARDS (Stacked) ========== */}
              <div className="hidden lg:flex lg:flex-col lg:gap-5">
                {/* Verification Card - Desktop - Updated to match ColHome design */}
                <div className="w-full bg-white rounded-[10px] shadow-[0px_3px_20px_0px_#0000001A] p-4 lg:p-6">
                  <h3 className="font-semibold text-[16px] lg:text-[18px] text-[#2A1E17] mb-3 lg:mb-4">
                    Verification
                  </h3>
                  <div className="w-full h-px bg-black/10 mb-4" />

                  {/* Phone verified - Updated with verified badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-[18px] h-[18px]">
                        {phoneVerified ? (
                          <svg className="w-[18px] h-[18px] text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="9" fill="#10B981" />
                            <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A1E17" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-[13px] lg:text-[14px] text-[#2A1E17]">Phone verified</span>
                        {phoneVerified && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {!phoneVerified && (
                      <button 
                        onClick={handleVerifyPhone}
                        className="text-[13px] lg:text-[14px] text-[#51218F] font-medium hover:opacity-80"
                      >
                        Verify
                      </button>
                    )}
                  </div>

                  {/* Email verified - Updated with verified badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-[18px] h-[18px]">
                        {emailVerified ? (
                          <svg className="w-[18px] h-[18px] text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="9" fill="#10B981" />
                            <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2A1E17" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="text-[13px] lg:text-[14px] text-[#2A1E17]">Email verified</span>
                        {emailVerified && (
                          <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    {!emailVerified && (
                      <button 
                        onClick={handleVerifyEmail}
                        className="text-[13px] lg:text-[14px] text-[#51218F] font-medium hover:opacity-80"
                      >
                        Verify
                      </button>
                    )}
                  </div>
                </div>

                {/* All Job Stats Card - Desktop */}
                <div className="w-full bg-white rounded-[10px] shadow-[0px_3px_20px_0px_#0000001A] p-4 lg:p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-montserrat font-medium text-[16px] lg:text-[17px] text-[#2A1E17]">
                      All Job
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-[12px] lg:text-[13px] text-[#2A1E17]">Total:</span>
                      <span className="font-bold text-[15px] lg:text-[16px] text-[#2A1E17]">{userStats.totalJobs}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-3">
                    <div className="flex items-center">
                      <img src={Folder} className="w-[15px] h-[15px] mr-2" alt="Active" />
                      <p className="text-[12px] lg:text-[13px] text-[#2A1E17E5]">
                        <span className="font-bold">Active projects:</span> {userStats.activeProjects}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <img src={Cloud} className="w-[15px] h-[15px] mr-2" alt="Completed" />
                      <p className="text-[12px] lg:text-[13px] text-[#2A1E17E5]">
                        <span className="font-bold">Completed:</span> {userStats.completed}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <img src={Cancel} className="w-[15px] h-[15px] mr-2" alt="Canceled" />
                      <p className="text-[12px] lg:text-[13px] text-[#2A1E17E5]">
                        <span className="font-bold">Canceled:</span> {userStats.canceled}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center w-full mt-1">
                    <button 
                      onClick={() => navigate('/my-jobs')}
                      className="w-[75px] h-[26px] rounded-full flex items-center justify-center bg-transparent hover:bg-[#51218F] transition-all duration-200"
                      style={{
                        border: '1.5px solid #51218F',
                        backgroundColor: 'transparent',
                        color: '#51218F',
                        fontWeight: 'bold',
                        fontSize: '9px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#51218F';
                        e.currentTarget.style.borderColor = '#51218F';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = '#51218F';
                        e.currentTarget.style.color = '#51218F';
                      }}
                    >
                      View all
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========== VERIFICATION POPUPS ========== */}
      
      {/* Phone Input Popup */}
      {showPhonePopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-[740px] min-h-[432px] rounded-[32px] border-[1.5px] border-white bg-white/70 shadow-[0_0_10px_0_#FFFFFF] flex flex-col items-center justify-center gap-6 p-6 sm:p-8 md:p-10">
            
            {/* Back Button */}
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setShowPhonePopup(false)}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(180deg, rgba(3,3,3,0.9) 0%, rgba(81,33,143,0.9) 100%)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-[#030303] poppins-font text-base sm:text-lg font-medium">
                Back
              </span>
            </div>

            <div className="w-full max-w-lg text-center mt-10">
              <h1 className="text-3xl sm:text-[32px] font-semibold text-[#000000] poppins-font">
                Verify Phone Number
              </h1>
              
              <p className="text-[#3D1768] text-sm sm:text-base poppins-font mb-10 sm:mb-12 px-4">
                Enter your phone number to receive a verification code
              </p>

              <div className="mb-8">
                <label className="block text-sm font-medium text-[#030303] mb-3 poppins-font text-left">
                  Phone Number
                </label>
                
                <div className="flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center px-4 py-3 border border-r-0 border-gray-300 rounded-l-xl bg-gray-50/70 backdrop-blur-sm">
                      <span className="text-gray-700 font-medium poppins-font">🇮🇳 +91</span>
                    </div>
                  </div>
                  
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhoneNumber(numbersOnly);
                    }}
                    placeholder="12345 67890"
                    maxLength={10}
                    className="flex-1 px-4 py-3 border border-gray-300 border-l-0 rounded-r-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-[#3D1768] focus:border-[#3D1768] outline-none transition-all text-[#030303] poppins-font"
                  />
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-[#030303]/70 poppins-font">
                    Enter 10-digit mobile number
                  </p>
                  <p className={`text-sm font-medium poppins-font ${phoneNumber.length === 10 ? 'text-[#3D1768]' : 'text-[#030303]/70'}`}>
                    {phoneNumber.length}/10
                  </p>
                </div>
              </div>

              <button
                onClick={handlePhoneSubmit}
                disabled={phoneNumber.length !== 10 || isVerifying}
                type="button"
                className="group relative overflow-hidden w-full max-w-[554px] h-12 sm:h-[48px] rounded-[30px] bg-gradient-to-r from-[#3D1768] to-[#030303] px-8 py-3 text-white text-base sm:text-lg font-medium poppins-font border border-white/10 shadow-lg hover:border-white/30 hover:shadow-2xl hover:shadow-purple-900/50 active:scale-95 transition-all duration-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 transition-transform duration-1000 ease-out group-hover:translate-x-[100%]" />
                <span className="absolute inset-0 rounded-[30px] bg-white/10 scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                  {isVerifying ? 'Sending...' : 'Send OTP'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Input Popup */}
      {showEmailPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-[740px] min-h-[432px] rounded-[32px] border-[1.5px] border-white bg-white/70 shadow-[0_0_10px_0_#FFFFFF] flex flex-col items-center justify-center gap-6 p-6 sm:p-8 md:p-10">
            
            {/* Back Button */}
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setShowEmailPopup(false)}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(180deg, rgba(3,3,3,0.9) 0%, rgba(81,33,143,0.9) 100%)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-[#030303] poppins-font text-base sm:text-lg font-medium">
                Back
              </span>
            </div>

            <div className="w-full max-w-lg text-center mt-10">
              <h1 className="text-3xl sm:text-[32px] font-semibold text-[#000000] poppins-font">
                Verify Email Address
              </h1>
              
              <p className="text-[#3D1768] text-sm sm:text-base poppins-font mb-10 sm:mb-12 px-4">
                Enter your email address to receive a verification code
              </p>

              <div className="mb-8">
                <label className="block text-sm font-medium text-[#030303] mb-3 poppins-font text-left">
                  Email Address
                </label>
                
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="username@gmail.com"
                  className={`
                    w-full px-4 py-3 
                    border ${isValidGmail(email) ? 'border-gray-300' : 'border-red-300'} 
                    rounded-xl 
                    bg-white/50 backdrop-blur-sm
                    focus:ring-2 focus:ring-[#3D1768] focus:border-[#3D1768] 
                    outline-none transition-all 
                    text-[#030303] poppins-font
                    placeholder:text-[#030303]/50
                  `}
                />
                
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-[#030303]/70 poppins-font">
                    {isValidGmail(email) 
                      ? "We'll send a 6-digit verification code to this email"
                      : "Please enter a valid Gmail address (@gmail.com)"
                    }
                  </p>
                  {email && !isValidGmail(email) && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleEmailSubmit}
                disabled={!isValidGmail(email) || isVerifying}
                type="button"
                className="group relative overflow-hidden w-full max-w-[554px] h-12 sm:h-[48px] rounded-[30px] bg-gradient-to-r from-[#3D1768] to-[#030303] px-8 py-3 text-white text-base sm:text-lg font-medium poppins-font border border-white/10 shadow-lg hover:border-white/30 hover:shadow-2xl hover:shadow-purple-900/50 active:scale-95 transition-all duration-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 transition-transform duration-1000 ease-out group-hover:translate-x-[100%]" />
                <span className="absolute inset-0 rounded-[30px] bg-white/10 scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                  {isVerifying ? 'Sending...' : 'Send OTP'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Popup */}
      {showOTPPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-[740px] min-h-[432px] rounded-[32px] border-[1.5px] border-white bg-white/70 shadow-[0_0_10px_0_#FFFFFF] flex flex-col items-center justify-center gap-6 p-6 sm:p-8 md:p-10">
            
            {/* Back Button */}
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 cursor-pointer select-none"
              onClick={() => {
                setShowOTPPopup(false);
                setOtp(['', '', '', '', '', '']);
                setResendTime(45);
                if (currentVerificationType === 'phone') {
                  setShowPhonePopup(true);
                } else {
                  setShowEmailPopup(true);
                }
              }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{
                  background: "linear-gradient(180deg, rgba(3,3,3,0.9) 0%, rgba(81,33,143,0.9) 100%)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-[#030303] poppins-font text-base sm:text-lg font-medium">
                Back
              </span>
            </div>

            <div className="w-full max-w-lg text-center mt-10">
              <h1 className="text-3xl sm:text-[32px] font-semibold text-[#000000] poppins-font">
                Enter OTP
              </h1>
              <p className="text-[#3D1768] text-sm sm:text-base poppins-font mb-10 sm:mb-12 px-4">
                We've sent a 6-digit OTP to your {currentVerificationType}. 
                Please enter it below to continue.
              </p>

              <div className="flex justify-center gap-4 sm:gap-8 mb-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="relative">
                    <input
                      value={otp[i] || ''}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        } else if (e.key !== 'Backspace' && /^[0-9]$/.test(e.key) && otp[i] && i < 5) {
                          setTimeout(() => {
                            document.getElementById(`otp-${i + 1}`)?.focus();
                          }, 10);
                        }
                      }}
                      id={`otp-${i}`}
                      maxLength={1}
                      className="w-[45px] h-[24px] sm:w-[50px] sm:h-[70px] text-center text-2xl sm:text-4xl text-[#000000] bg-transparent outline-none leading-none caret-[#0000000]"
                    />
                    <div className={`absolute left-1/2 -translate-x-1/2 bottom-1 h-[2px] w-[50px] rounded-full transition-all duration-300 ${otp[i] ? 'bg-[#3D1768]' : 'bg-gray-900'}`} />
                  </div>
                ))}
              </div>

              <button
                onClick={verifyOTP}
                disabled={otp.some(digit => !digit) || isVerifying}
                type="button"
                className="group relative overflow-hidden w-full max-w-[554px] h-12 sm:h-[48px] rounded-[30px] bg-gradient-to-r from-[#3D1768] to-[#030303] px-8 py-3 text-white text-base sm:text-lg font-medium poppins-font border border-white/10 shadow-lg hover:border-white/30 hover:shadow-2xl hover:shadow-purple-900/50 active:scale-95 transition-all duration-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 transition-transform duration-1000 ease-out group-hover:translate-x-[100%]" />
                <span className="absolute inset-0 rounded-[30px] bg-white/10 scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
                  {isVerifying ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify OTP'
                  )}
                </span>
              </button>

              <div className="mt-8 text-center">
                <p className="text-[#030303]/90 text-sm sm:text-base poppins-font mb-1">
                  Didn't receive the code?
                </p>
                {(resendTime || 0) > 0 ? (
                  <p className="text-[#030303]/90 text-sm sm:text-base poppins-font">
                    Resend in{" "}
                    <span className="font-bold text-red-500 font-mono">
                      {String(Math.floor(resendTime / 60)).padStart(2, '0')}:
                      {String(resendTime % 60).padStart(2, '0')}
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    className="text-[#C22CA2] hover:text-[#3D1768] font-semibold text-sm sm:text-base poppins-font transition-colors"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup - Similar to ResetSuccess page */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-[652px] min-h-[398px] rounded-[32px] border-[1.5px] border-white bg-white/70 shadow-[0_0_10px_0_#FFFFFF] flex flex-col items-center justify-center gap-6 p-6">
            
            {/* Success Image */}
            <img
              src={Success}
              alt="Success"
              className="w-[122px] h-[122px] max-w-[25%] max-h-[25%] object-contain"
            />

            {/* Message */}
            <p className="w-[90%] max-w-[522px] text-center text-[24px] leading-[100%] font-normal poppins-font text-[#3D1768]">
              Your {currentVerificationType} has been verified successfully!
            </p>

            {/* Back button */}
            <div
              className="flex items-center mt-4 gap-2 cursor-pointer"
              onClick={() => setShowSuccessPopup(false)}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(3,3,3,0.9) 0%, rgba(81,33,143,0.9) 100%)",
                  backdropFilter: "blur(90px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </div>

              <span className="text-[#030303] poppins-font font-normal text-[18px] leading-[100%]">
                Continue
              </span>
            </div>

            {/* Auto redirect hint */}
            <p className="text-sm text-[#3D1768]/80 poppins-font mt-2">
              Closing automatically...
            </p>
          </div>
        </div>
      )}

      <div className="w-full mt-auto">
        <Footer />
      </div>
      
      {/* Add global styles for animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(81, 33, 143, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(81, 33, 143, 0); }
          100% { box-shadow: 0 0 0 0 rgba(81, 33, 143, 0); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shine {
          0% { background-position: 200% 200%; }
          100% { background-position: -100% -100%; }
        }
        @keyframes float {
          0% { transform: translateY(-50%) translateY(0px); }
          50% { transform: translateY(-50%) translateY(-5px); }
          100% { transform: translateY(-50%) translateY(0px); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Home;