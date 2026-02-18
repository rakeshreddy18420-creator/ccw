import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import api from "../../utils/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "../../component/ColHeader";
import Footer from "../../component/Footer";
import HomeBg from "../../assets/AfterSign/HomeBg.png";
import Dp1 from "../../assets/AfterSign/Dp1.jpg";
import USAFlag from "../../assets/AfterSign/Usa.png";
import UKFlag from "../../assets/AfterSign/Chn.jpg";
import CanadaFlag from "../../assets/AfterSign/Trc.jpg";
import HomeSub from "../../assets/AfterSign/HomeSub.png";
import Folder from "../../assets/AfterSign/Folder.png";
import Cloud from "../../assets/AfterSign/Cloud.png";
import Cancel from "../../assets/AfterSign/Cancel.png";
import Success from "../../assets/Auth/Succes.png";

const ColHome = () => {
  const [activeTab, setActiveTab] = useState("best");
  const navigate = useNavigate();
  const { userData } = useUser();

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

  // State for jobs
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State for saved jobs interactions
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [likedJobs, setLikedJobs] = useState(new Set());

  // State for expanded descriptions
  const [expandedJobs, setExpandedJobs] = useState(new Set());

  // Fetch user verification status
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      if (!userData?.id) return;
      
      try {
        const response = await api.get(`/auth/me`);
        if (response.data) {
          setPhoneVerified(response.data.phone_verified || false);
          setEmailVerified(response.data.email_verified || false);
        }
      } catch (error) {
        console.error('Error fetching verification status:', error);
      }
    };

    fetchVerificationStatus();
  }, [userData]);

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

  // ========== HELPER FUNCTIONS FOR JOB DISPLAY ==========
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffHours < 1) {
        return "Recently";
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays === 1) {
        return "1 day ago";
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      return "Recently";
    }
  };

  const getFlagForCountry = (country) => {
    if (!country) return USAFlag;

    const countryLower = country.toLowerCase();
    if (countryLower.includes('usa') || countryLower.includes('united states') || countryLower.includes('manhattan')) {
      return USAFlag;
    } else if (countryLower.includes('uk') || countryLower.includes('united kingdom')) {
      return UKFlag;
    } else if (countryLower.includes('canada')) {
      return CanadaFlag;
    }
    return USAFlag;
  };

  const formatBudgetType = (budgetType) => {
    if (!budgetType) return 'Fixed-price';
    return budgetType === 'fixed' || budgetType === 'Fixed' ? 'Fixed-price' : 'Hourly';
  };

  const formatBudget = (job) => {
    if (job.budget_from !== null && job.budget_to !== null) {
      return `$${job.budget_from} - $${job.budget_to}`;
    } else if (job.budget_from !== null) {
      return `$${job.budget_from}`;
    } else if (job.budget_to !== null) {
      return `$${job.budget_to}`;
    }
    return '';
  };

  const formatRateType = (budgetType) => {
    if (!budgetType) return '$ Fixed Rate';
    return budgetType === 'fixed' || budgetType === 'Fixed' ? '$ Fixed Rate' : '$ Hourly Rate';
  };

  const CountryFlag = ({ countryCode, country }) => {
    if (!countryCode) return (
      <img
        src={USAFlag}
        alt="USA"
        className="w-[18px] h-[12px] rounded-[4px] object-cover"
      />
    );

    return (
      <img
        src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
        alt={country}
        title={country}
        className="w-[18px] h-[12px] rounded-[4px] object-cover"
        onError={(e) => {
          e.target.src = USAFlag;
        }}
      />
    );
  };

  // Toggle description expansion
  const toggleDescription = (jobId, e) => {
    e.stopPropagation();
    setExpandedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  // ========== FETCH JOBS BASED ON ACTIVE TAB ==========
  useEffect(() => {
    if (!userData?.id) return;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        let response;
        let endpoint = '';

        switch (activeTab) {
          case "best":
            endpoint = `/collaborator/jobs/best-match/${userData.id}`;
            break;
          case "recent":
            endpoint = `/collaborator/jobs/recent/${userData.id}`;
            break;
          case "saved":
            endpoint = `/collaborator/jobs/saved/${userData.id}`;
            break;
          default:
            endpoint = `/collaborator/jobs/best-match/${userData.id}`;
        }

        response = await api.get(endpoint);
        
        if (response.data && response.data.length > 0) {
          const jobsWithDetails = await Promise.all(
            response.data.map(async (job) => {
              try {
                // Get job details with creator info
                const jobResponse = await api.get(`/collaborator/jobs/${job.id}`);
                const jobData = jobResponse.data || {};
                const creatorData = jobData.creator || {};

                // Determine the posted date based on tab
                let postedDate;
                if (activeTab === "saved") {
                  postedDate = job.saved_at || job.created_at;
                } else if (activeTab === "recent") {
                  postedDate = job.viewed_at || job.created_at;
                } else {
                  postedDate = job.created_at;
                }

                return {
                  ...job,
                  meta: `${formatBudgetType(job.budget_type)} - ${job.expertise_level || 'Intermediate'} - Est. Budget: ${formatBudget(job)} - Posted ${formatTimeAgo(postedDate)}`,
                  rateType: formatRateType(job.budget_type),
                  rating: creatorData.rating || 0,
                  reviewsCount: creatorData.reviews_count || 0,
                  country: creatorData.country,
                  state: creatorData.state,
                  country_code: creatorData.country_code,
                  posted_at: postedDate,
                  full_description: job.description || "No description available",
                  creator_name: creatorData.first_name || creatorData.name || "Anonymous",
                  status: job.status || 'active'
                };
              } catch (error) {
                console.error(`Error fetching job ${job.id}:`, error);
                return {
                  ...job,
                  meta: `${formatBudgetType(job.budget_type)} - ${job.expertise_level || 'Intermediate'} - Est. Budget: ${formatBudget(job)} - Posted ${formatTimeAgo(job.created_at)}`,
                  rateType: formatRateType(job.budget_type),
                  rating: 0,
                  reviewsCount: 0,
                  country: null,
                  state: null,
                  country_code: null,
                  posted_at: job.created_at,
                  full_description: job.description || "No description available",
                  status: job.status || 'active'
                };
              }
            })
          );
          setJobs(jobsWithDetails);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [activeTab, userData]);

  // ========== LOAD SAVED JOBS ==========
  useEffect(() => {
    if (!userData?.id) return;

    const loadSavedJobs = async () => {
      try {
        const response = await api.get(`/collaborator/jobs/saved/${userData.id}`);
        if (response.data && response.data.length > 0) {
          const savedJobIds = new Set(response.data.map(job => job.id));
          setSavedJobs(savedJobIds);
        }
      } catch (error) {
        console.error('Error loading saved jobs:', error);
      }
    };

    loadSavedJobs();
  }, [userData]);

  // ========== HANDLE SAVE/UNSAVE JOB ==========
  const handleSaveJob = async (jobId, e) => {
    if (e) e.stopPropagation();
    
    if (!userData?.id) {
      toast.error('Please login to save jobs');
      return;
    }

    try {
      const response = await api.post('/collaborator/jobs/toggle-save', null, {
        params: {
          user_id: userData.id,
          job_id: jobId
        }
      });

      if (response.data.status === 'saved') {
        setSavedJobs(prev => new Set([...prev, jobId]));
        toast.success('Job saved successfully');
      } else {
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
        toast.info('Job removed from saved');
      }
    } catch (error) {
      console.error('Error toggling save job:', error);
      toast.error('Failed to save job');
    }
  };

  // ========== HANDLE LIKE JOB (local only) ==========
  const handleLikeJob = (jobId, e) => {
    if (e) e.stopPropagation();
    
    if (likedJobs.has(jobId)) {
      setLikedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    } else {
      setLikedJobs(prev => new Set([...prev, jobId]));
    }
  };

  // Track job view
  const handleTrackView = async (jobId) => {
    if (!userData?.id) return;

    try {
      await api.post('/collaborator/jobs/track-view', null, {
        params: {
          user_id: userData.id,
          job_id: jobId
        }
      });
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  // Handle job click to track view
  const handleJobClick = (jobId) => {
    handleTrackView(jobId);
    navigate('/ux', {
      state: { jobId: jobId }
    });
  };

  // ========== HANDLE SEARCH ==========
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.length > 0) {
      navigate('/collabration-filter', {
        state: { searchQuery: value }
      });
    }
  };

  const handleSearch = async () => {
    const query = searchQuery.trim();
    if (!query) return;

    setLoading(true);

    try {
      const response = await api.get("/collaborator/job-search", {
        params: { search: query }
      });

      if (!response.data || response.data.length === 0) {
        setJobs([]);
        toast.info("No jobs found");
        return;
      }

      const jobsWithDisplayFields = await Promise.all(
        response.data.map(async (job) => {
          try {
            const jobResponse = await api.get(`/collaborator/jobs/${job.id}`);
            const jobData = jobResponse.data || {};
            const creatorData = jobData.creator || {};

            return {
              ...job,
              meta: `${formatBudgetType(job.budget_type)} - ${job.expertise_level || "Intermediate"} - Est. Budget: ${formatBudget(job)} - Posted ${formatTimeAgo(job.created_at)}`,
              rateType: formatRateType(job.budget_type),
              rating: creatorData.rating || 0,
              reviewsCount: creatorData.reviews_count || 0,
              country: creatorData.country,
              state: creatorData.state,
              country_code: creatorData.country_code,
              full_description: job.description || "No description available",
              posted_at: job.created_at,
              status: job.status || 'active'
            };
          } catch (error) {
            console.error(`Error fetching job ${job.id}:`, error);
            return {
              ...job,
              meta: `${formatBudgetType(job.budget_type)} - ${job.expertise_level || "Intermediate"} - Est. Budget: ${formatBudget(job)} - Posted ${formatTimeAgo(job.created_at)}`,
              rateType: formatRateType(job.budget_type),
              rating: 0,
              reviewsCount: 0,
              country: null,
              state: null,
              country_code: null,
              full_description: job.description || "No description available",
              posted_at: job.created_at,
              status: job.status || 'active'
            };
          }
        })
      );

      setJobs(jobsWithDisplayFields);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

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

    if (!userData?.email) {
      toast.error('User email not found');
      return;
    }

    setIsVerifying(true);
    try {
      // Add +91 prefix to the phone number before sending
      const fullPhoneNumber = `+91${phoneNumber}`;
      
      const response = await api.post('/verification/phone/send-otp', {
        email: userData.email,
        phone_number: fullPhoneNumber  // Send with +91 prefix
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

  const handleResendOTP = async () => {
    try {
      if (currentVerificationType === 'phone') {
        // Add +91 prefix for resend as well
        const fullPhoneNumber = `+91${phoneNumber}`;
        
        const response = await api.post('/verification/phone/send-otp', {
          email: userData?.email,
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

  const verifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    if (!userData?.email && currentVerificationType === 'phone') {
      toast.error('User email not found');
      return;
    }

    setIsVerifying(true);
    try {
      const endpoint = currentVerificationType === 'phone' 
        ? '/verification/phone/verify-otp' 
        : '/verification/email/verify-otp';
      
      const payload = currentVerificationType === 'phone'
        ? { email: userData.email, otp_code: otpString }
        : { email: email, otp_code: otpString };

      const response = await api.post(endpoint, payload);

      if (response.data.status === 'success') {
        if (currentVerificationType === 'phone') {
          setPhoneVerified(true);
        } else {
          setEmailVerified(true);
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

  const getProfileCompletion = () => {
    if (!userData) return 0;

    let basePercentage = 80;
    
    let verificationPercentage = 0;
    if (phoneVerified) verificationPercentage += 10;
    if (emailVerified) verificationPercentage += 10;
    
    return Math.min(basePercentage + verificationPercentage, 100);
  };

  const profilePercent = getProfileCompletion();

  const getJobStats = () => {
    const active = jobs.filter(j => j.status === 'active' || j.status === 'posted').length;
    const completed = jobs.filter(j => j.status === 'completed').length;
    const canceled = jobs.filter(j => j.status === 'cancelled' || j.status === 'canceled').length;
    
    return { active, completed, canceled };
  };

  const jobStats = getJobStats();

  const getDisplayDescription = (job) => {
    if (!job.full_description) return "No description available";
    
    if (expandedJobs.has(job.id) || job.full_description.length <= 200) {
      return job.full_description;
    }
    return `${job.full_description.substring(0, 200)}...`;
  };

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
        <div className="absolute top-[150px] md:top-[187px] w-full px-4 flex flex-col items-center justify-center gap-4 md:gap-[24px] z-10">
          <h1
            className="text-3xl sm:text-4xl md:text-[48px] leading-tight md:leading-[100%] text-center text-white font-normal"
            style={{ fontFamily: "Milonga" }}
          >
            Welcome back,<br />
            {userData?.first_name || userData?.name || 'User'}
          </h1>

          {/* SEARCH BAR */}
          <div
            className="
              w-full max-w-[890px]
              h-[44px] md:h-[48px]
              flex flex-row
              items-center
              bg-white
              border border-[#6D3BC1]
              rounded-[10px]
              overflow-hidden
            "
          >
            <input
              type="text"
              placeholder="Search Jobs"
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="
                flex-1
                h-full
                px-4 md:px-6
                text-[14px] md:text-[15px]
                text-gray-600
                outline-none
                bg-transparent
                placeholder:text-gray-400
              "
            />
            <button
              onClick={handleSearch}
              className="
                h-full
                px-4 sm:px-6 md:px-10
                text-[14px] md:text-[15px]
                font-medium
                text-white
                bg-gradient-to-br from-[#4B1D8C] to-[#2B0A4F]
                rounded-r-[10px]
                flex items-center justify-center gap-2
                whitespace-nowrap
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
              <span className="hidden xs:inline sm:inline">Search</span>
            </button>
          </div>
        </div>

        <Header />

        {/* Main Content Container */}
        <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-8 mt-[350px] md:mt-[412px] pb-[100px] relative">
          
          {/* Right Sidebar */}
          <div className="w-full lg:w-[400px] xl:w-[392px] opacity-100 order-1 lg:order-2 px-4 sm:px-6 lg:px-0">
            <div className="flex flex-col gap-4 sm:gap-[30px]">
              
              {/* Profile completion card */}
              <div className="w-full h-auto opacity-100 rounded-[10px] bg-white shadow-[0px_4px_45px_0px_#0000001F] flex flex-col items-center p-4 sm:p-6">
                
                {/* Profile Header with Image - Mobile Only */}
                <div className="w-full flex items-center gap-3 mb-3 lg:hidden">
                  <div className="w-[45px] h-[45px] rounded-full overflow-hidden flex-shrink-0 border-2 border-[#51218F]">
                    <img 
                      src={userData?.profile_picture || Dp1} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[18px] leading-[120%] text-[#2A1E17]">
                      {userData?.first_name || 'User'}
                    </h3>
                    <p className="font-medium text-[12px] leading-[100%] text-[#2A1E17E5] mt-1">
                      Collaborator
                    </p>
                  </div>
                </div>

                {/* Name and Designation - Desktop Only */}
                <div className="hidden lg:block w-full">
                  <div className="w-full mb-2">
                    <h3 className="font-bold text-[22px] leading-[100%] text-[#2A1E17] text-center">
                      {userData?.first_name || 'User'}
                    </h3>
                  </div>
                  <div className="w-full mb-6">
                    <p className="font-medium text-[14px] leading-[100%] text-[#2A1E17E5] text-center">
                      Collaborator
                    </p>
                  </div>
                </div>

                {/* Progress section */}
                <div className="w-full flex justify-between items-center mb-2 sm:mb-4">
                  <div className="text-left">
                    <span className="font-bold text-[12px] sm:text-[14px] leading-[100%] text-[#2A1E17]">
                      Set up your account
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[12px] sm:text-[14px] leading-[100%] text-[#2A1E17]">
                      {profilePercent}%
                    </span>
                  </div>
                </div>

                <div className="w-full h-[4px] sm:h-[6px] opacity-100 mb-4 sm:mb-8 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${profilePercent}%`,
                      backgroundColor: '#51218F',
                    }}
                  />
                </div>

                {/* Complete Profile Button */}
                <button
                  onClick={() => navigate('/collaborator-role-profile')}
                  className={`w-full max-w-[180px] sm:max-w-[210px] h-[32px] sm:h-[39px] opacity-100 rounded-[100px] flex items-center justify-center px-[24px] sm:px-[36px] py-[8px] sm:py-[12px] gap-[8px] sm:gap-[10px] bg-transparent transition-all duration-200 cursor-pointer mb-2 sm:mb-3 group ${
                    profilePercent === 100 
                      ? 'border border-green-500 hover:bg-green-500' 
                      : 'border border-black hover:border-[#51218F]'
                  }`}
                  style={{
                    backgroundColor: 'transparent',
                    color: profilePercent === 100 ? '#10B981' : '#51218F'
                  }}
                  onMouseEnter={(e) => {
                    if (profilePercent !== 100) {
                      e.currentTarget.style.backgroundColor = '#51218F';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#51218F';
                    } else {
                      e.currentTarget.style.backgroundColor = '#10B981';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = '#10B981';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (profilePercent !== 100) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#51218F';
                      e.currentTarget.style.borderColor = 'black';
                    } else {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#10B981';
                      e.currentTarget.style.borderColor = '#10B981';
                    }
                  }}
                >
                  <span className="font-bold text-[11px] sm:text-[12px] leading-[100%] whitespace-nowrap">
                    {profilePercent === 100 ? 'Completed successfully!' : 'Complete your profile'}
                  </span>
                </button>

                {/* Bottom paragraph */}
                <div className="w-full opacity-100">
                  <p className="font-normal italic text-[10px] sm:text-[12px] leading-[120%] sm:leading-[100%] text-[#2A1E17E5] text-center px-2">
                    {profilePercent === 100 ? (
                      "🎉 Great! Your profile is now 100% complete!"
                    ) : (
                      `${100 - profilePercent}% more to complete your profile will help you get more reach.`
                    )}
                  </p>
                </div>
              </div>

              {/* Gradient Promo Card */}
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
              >
                <div className="relative w-full">
                  <div 
                    className="w-full h-[80px] min-[400px]:h-[85px] sm:h-auto sm:min-h-[98px] opacity-100 rounded-[8px] sm:rounded-[10px] shadow-[0px_4px_45px_0px_#0000001F] overflow-visible relative p-2 sm:p-6 flex items-center"
                    style={{
                      background: 'linear-gradient(266.38deg, #51218F 4.44%, #020202 100.18%)',
                    }}
                  >
                    <div className="absolute inset-0 z-0 rounded-[8px] sm:rounded-[10px] overflow-hidden">
                      <img
                        src={HomeSub}
                        alt="Promotional background"
                        className="w-full h-full object-cover"
                        style={{ opacity: '0.3' }}
                      />
                    </div>
                    
                    <div className="relative z-10 w-full flex items-center pr-[70px] min-[400px]:pr-[75px] sm:pr-[70px] lg:pr-[110px]">
                      <div>
                        <div className="font-medium text-[13px] min-[400px]:text-[14px] sm:text-[18px] leading-tight text-white">
                          Get Subscription
                        </div>
                        <div className="font-medium text-[13px] min-[400px]:text-[14px] sm:text-[18px] leading-tight text-white">
                          more revenue in a month
                        </div>
                      </div>
                    </div>
                  </div>
              
                  <div
                    className="absolute w-[60px] h-[60px] min-[400px]:w-[65px] min-[400px]:h-[65px] min-[480px]:w-[70px] min-[480px]:h-[70px] sm:w-[60px] sm:h-[130px] lg:w-[98px] lg:h-[98px] right-[2px] opacity-100 rounded-full flex items-center justify-center z-20 shadow-lg"
                    style={{
                      background: 'linear-gradient(180deg, #FFA412 0%, #6C4343 100%)',
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </div>
              </button>
              
              <style jsx>{`
                @keyframes pulse {
                  0% { box-shadow: 0 0 0 0 rgba(81, 33, 143, 0.4); }
                  70% { box-shadow: 0 0 0 12px rgba(81, 33, 143, 0); }
                  100% { box-shadow: 0 0 0 0 rgba(81, 33, 143, 0); }
                }
              `}</style>

              {/* Two Column Layout for Mobile */}
              <div className="flex flex-row gap-3 w-full lg:hidden">
                {/* Verification Card - Left Side */}
                <div className="w-1/2 h-auto opacity-100 bg-white rounded-[10px] shadow-[0px_4px_45px_0px_#0000001F] p-3">
                  <div className="w-full mb-1">
                    <h3 className="font-semibold text-[15px] leading-[100%] text-[#2A1E17]">
                      Verification
                    </h3>
                  </div>

                  <div className="w-full h-[0px] opacity-100 mb-3 border-b border-[#0000001A]" />

                  {/* Phone Verification */}
                  <div className="w-full mb-3 flex items-center justify-between">
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
                        <span className="font-outfit font-normal text-[11px] leading-[100%] text-[#2A1E17] whitespace-nowrap">
                          Phone
                        </span>
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
                        className="bg-transparent hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <span className="font-medium text-[11px] leading-[100%] text-[#51218F] whitespace-nowrap">
                          Verify
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Email Verification */}
                  <div className="w-full flex items-center justify-between">
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
                        <span className="font-outfit font-normal text-[11px] leading-[100%] text-[#2A1E17] whitespace-nowrap">
                          Email
                        </span>
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
                        className="bg-transparent hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <span className="font-medium text-[11px] leading-[100%] text-[#51218F] whitespace-nowrap">
                          Verify
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* All Job Stats Card - Right Side */}
                <div className="w-1/2 h-auto opacity-100 rounded-[10px] bg-white shadow-lg p-3">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-montserrat font-medium text-[15px] leading-[100%] text-[#2A1E17]">
                        Jobs
                      </h3>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <span className="font-montserrat font-medium text-[11px] leading-[100%] text-[#2A1E17]">
                        Total:
                      </span>
                      <span className="font-montserrat font-bold text-[15px] leading-[100%] text-[#2A1E17]">
                        {jobs.length}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center">
                      <div className="w-[14px] h-[14px] mr-1.5 flex items-center justify-center flex-shrink-0">
                        <img src={Folder} alt="Active" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-montserrat text-[11px] leading-[100%] text-[#2A1E17E5]">
                          <span className="font-bold">Active:</span>
                          <span className="font-medium"> {jobStats.active}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-[14px] h-[14px] mr-1.5 flex items-center justify-center flex-shrink-0">
                        <img src={Cloud} alt="Completed" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-montserrat text-[11px] leading-[100%] text-[#2A1E17E5]">
                          <span className="font-bold">Completed:</span>
                          <span className="font-medium"> {jobStats.completed}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-[14px] h-[14px] mr-1.5 flex items-center justify-center flex-shrink-0">
                        <img src={Cancel} alt="Canceled" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-montserrat text-[11px] leading-[100%] text-[#2A1E17E5]">
                          <span className="font-bold">Canceled:</span>
                          <span className="font-medium"> {jobStats.canceled}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => setActiveTab("best")}
                      className="w-[80px] h-[28px] opacity-100 rounded-[100px] flex items-center justify-center px-[18px] py-[6px] gap-[6px] bg-transparent hover:bg-[#51218F] hover:text-white transition-all duration-200 cursor-pointer group border border-[#51218F]"
                    >
                      <span className="font-montserrat font-bold text-[10px] leading-[100%] text-[#51218F] group-hover:text-white whitespace-nowrap">
                        View all
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Version - Original Layout */}
              <div className="hidden lg:flex lg:flex-col gap-[30px]">
                {/* Verification Card - Desktop */}
                <div className="w-full h-auto min-h-[242px] opacity-100 bg-white rounded-[10px] shadow-[0px_4px_45px_0px_#0000001F] p-6">
                  <div className="w-full mb-2">
                    <h3 className="font-semibold text-[20px] leading-[100%] text-[#2A1E17]">
                      Verification
                    </h3>
                  </div>
                  <div className="w-full h-[0px] opacity-100 mb-6 border-b border-[#0000001A]" />
                  
                  {/* Phone Verification - Desktop */}
                  <div className="w-full mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-[12px]">
                      <div className="w-[20px] h-[20px]">
                        {phoneVerified ? (
                          <svg className="w-[20px] h-[20px] text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="9" fill="#10B981" />
                            <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A1E17" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="font-outfit font-normal text-[16px] leading-[100%] text-[#2A1E17] whitespace-nowrap">
                          Phone verified
                        </span>
                        
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
                        className="bg-transparent hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <span className="font-medium text-[16px] leading-[100%] text-[#51218F] whitespace-nowrap">
                          Verify
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Email Verification - Desktop */}
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-[12px]">
                      <div className="w-[20px] h-[20px]">
                        {emailVerified ? (
                          <svg className="w-[20px] h-[20px] text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="9" fill="#10B981" />
                            <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2A1E17" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="font-outfit font-normal text-[16px] leading-[100%] text-[#2A1E17] whitespace-nowrap">
                          Email verified
                        </span>
                        
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
                        className="bg-transparent hover:opacity-80 transition-opacity cursor-pointer"
                      >
                        <span className="font-medium text-[16px] leading-[100%] text-[#51218F] whitespace-nowrap">
                          Verify
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* All Job Stats Card - Desktop */}
                <div className="w-full h-auto min-h-[287px] opacity-100 rounded-[10px] bg-white shadow-lg p-6">
                  <div className="flex flex-wrap justify-between items-center mb-8">
                    <div>
                      <h3 className="font-montserrat font-medium text-[20px] leading-[100%] text-[#2A1E17]">
                        All Job
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-montserrat font-medium text-[16px] leading-[100%] text-[#2A1E17]">
                        Total:
                      </span>
                      <span className="font-montserrat font-bold text-[20px] leading-[100%] text-[#2A1E17]">
                        {jobs.length}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center">
                      <div className="w-[20px] h-[19px] mr-3 flex items-center justify-center flex-shrink-0">
                        <img src={Folder} alt="Active projects" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-montserrat text-[16px] leading-[100%] text-[#2A1E17E5]">
                          <span className="font-bold">Active projects:</span>
                          <span className="font-medium"> {jobStats.active}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[20px] h-[19px] mr-3 flex items-center justify-center flex-shrink-0">
                        <img src={Cloud} alt="Completed projects" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-montserrat text-[16px] leading-[100%] text-[#2A1E17E5]">
                          <span className="font-bold">Completed:</span>
                          <span className="font-medium"> {jobStats.completed}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-[20px] h-[19px] mr-3 flex items-center justify-center flex-shrink-0">
                        <img src={Cancel} alt="Canceled projects" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-montserrat text-[16px] leading-[100%] text-[#2A1E17E5]">
                          <span className="font-bold">Canceled:</span>
                          <span className="font-medium"> {jobStats.canceled}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button 
                      onClick={() => setActiveTab("best")}
                      className="w-[122px] h-[39px] opacity-100 rounded-[100px] flex items-center justify-center px-[36px] py-[12px] gap-[10px] bg-transparent hover:bg-[#51218F] hover:text-white transition-all duration-200 cursor-pointer group border border-[#51218F]"
                    >
                      <span className="font-montserrat font-bold text-[12px] leading-[100%] text-[#51218F] group-hover:text-white whitespace-nowrap">
                        View all
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column - Job Listings */}
          <div className="w-full lg:w-[calc(100%-432px)] xl:w-[805px] opacity-100 order-2 lg:order-1">
            {/* Title */}
            <div className="px-4 sm:px-6 mb-6">
              <h2 className="font-['Montserrat'] font-bold text-[20px] leading-[100%] text-[#2A1E17]">
                Jobs you might like
              </h2>
            </div>

            {/* Tabs */}
            <div className="px-4 sm:px-6 mb-4">
              <div className="flex flex-wrap gap-6 sm:gap-8 md:gap-16 text-[14px] md:text-[15px]">
                <span
                  onClick={() => setActiveTab("best")}
                  className="cursor-pointer relative pb-3 font-semibold"
                >
                  Best match
                  <span
                    className={`absolute left-0 -bottom-[6px] h-[3px] w-full rounded-full transition-all ${activeTab === "best" ? "bg-red-500" : "bg-transparent"}`}
                  />
                </span>

                <span
                  onClick={() => setActiveTab("recent")}
                  className="cursor-pointer relative pb-3 font-semibold"
                >
                  Recent
                  <span
                    className={`absolute left-0 -bottom-[6px] h-[3px] w-full rounded-full transition-all ${activeTab === "recent" ? "bg-red-500" : "bg-transparent"}`}
                  />
                </span>

                <span
                  onClick={() => setActiveTab("saved")}
                  className="cursor-pointer relative pb-3 font-semibold"
                >
                  Saved ({savedJobs.size})
                  <span
                    className={`absolute left-0 -bottom-[6px] h-[3px] w-full rounded-full transition-all ${activeTab === "saved" ? "bg-red-500" : "bg-transparent"}`}
                  />
                </span>
              </div>

              <div className="mt-1 h-[2px] bg-gray-200 w-full" />
            </div>

            {/* Job Cards */}
            <div className="px-4 sm:px-6">
              <div className="w-full h-auto p-4 sm:p-6 md:p-[39px_47px] gap-[30px] opacity-100 rounded-[10px] shadow-[0_4px_45px_0_#0000001F] flex flex-col bg-white">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Jobs Found</h3>
                    <p className="text-gray-500">
                      {activeTab === "saved"
                        ? "You haven't saved any jobs yet. Click the heart icon on jobs to save them."
                        : activeTab === "recent"
                          ? "You haven't viewed any jobs recently. Click on jobs to view them."
                          : "No matching jobs found for your profile."}
                    </p>
                  </div>
                ) : (
                  jobs.map((job, index) => (
                    <div 
                      key={job.id || index} 
                      className={`${index !== jobs.length - 1 ? 'border-b border-gray-200 pb-6 sm:pb-8 mb-6 sm:mb-8' : ''} cursor-pointer`}
                      onClick={() => handleJobClick(job.id)}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                        {/* LEFT CONTENT */}
                        <div className="flex-1 w-full">
                          <h3 className="font-semibold text-[16px] sm:text-[17px] mb-2 text-[#2A1E17]">
                            {job.title}
                          </h3>
                          <p className="text-[12px] sm:text-[14px] text-gray-500 mb-2">
                            {job.meta}
                          </p>
                          <p className="text-[14px] sm:text-[16px] text-gray-600 mb-4 leading-relaxed">
                            {getDisplayDescription(job)}
                            {job.full_description && job.full_description.length > 200 && (
                              <span 
                                className="text-[#4B1D8C] font-medium cursor-pointer ml-1"
                                onClick={(e) => toggleDescription(job.id, e)}
                              >
                                {expandedJobs.has(job.id) ? 'less' : 'more'}
                              </span>
                            )}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-[12px] sm:text-[14px] text-gray-500">
                            <span className="text-[#4B1D8C] font-medium">{job.rateType}</span>
                            <span className="text-[#4B1D8C]">
                              {job.rating > 0 ? "★".repeat(Math.floor(job.rating)) : "☆☆☆☆☆"}
                              {job.rating > 0 && "☆".repeat(5 - Math.floor(job.rating))}
                            </span>
                            <span>
                              {job.rating > 0 ? job.rating.toFixed(1) : '0.0'}/5 
                              ({job.reviewsCount || 0} {job.reviewsCount === 1 ? 'review' : 'reviews'})
                            </span>
                            <div className="flex items-center gap-2">
                              <CountryFlag
                                countryCode={job.country_code}
                                country={job.country}
                              />
                              <span>{[job.state, job.country].filter(Boolean).join(", ") || 'Remote'}</span>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT ICONS */}
                        <div className="flex sm:flex-col items-center gap-3 self-end sm:self-start" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-3">
                            {/* Heart Circle */}
                            <div 
                              className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 relative group"
                              style={{
                                backgroundColor: savedJobs.has(job.id) ? '#FF0000' : '#C4C4C466',
                              }}
                              onClick={(e) => handleSaveJob(job.id, e)}
                            >
                              <svg 
                                className="w-4 h-4 sm:w-5 sm:h-5" 
                                fill={savedJobs.has(job.id) ? "white" : "none"} 
                                stroke={savedJobs.has(job.id) ? "white" : "#51218F"} 
                                strokeWidth="2"
                                viewBox="0 0 24 24" 
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                                />
                              </svg>
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
                                {savedJobs.has(job.id) ? "Remove from saved" : "Save job"}
                              </div>
                            </div>

                            {/* Like Circle */}
                            <div 
                              className="w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 relative group"
                              style={{
                                backgroundColor: likedJobs.has(job.id) ? '#51218F' : '#C4C4C466',
                              }}
                              onClick={(e) => handleLikeJob(job.id, e)}
                            >
                              <svg 
                                className="w-4 h-4 sm:w-5 sm:h-5" 
                                fill={likedJobs.has(job.id) ? "white" : "none"} 
                                stroke={likedJobs.has(job.id) ? "white" : "#51218F"} 
                                strokeWidth="2"
                                viewBox="0 0 24 24" 
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" 
                                />
                              </svg>
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
                                {likedJobs.has(job.id) ? "Unlike" : "Like"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
    </div>
  );
};

export default ColHome;