import Header from "../../component/Header";
import Footer from "../../component/Footer";
import HomeBg from "../../assets/AfterSign/HomeBg.png";
import Dp1 from "../../assets/AfterSign/Dp1.jpg";
import Dp2 from "../../assets/AfterSign/Dp2.jpg";
import Dp3 from "../../assets/AfterSign/Dp3.jpg";
import Dp4 from "../../assets/AfterSign/Dp4.jpg";
import HomeSub from "../../assets/AfterSign/HomeSub.png";
import Folder from "../../assets/AfterSign/Folder.png";
import Cloud from "../../assets/AfterSign/Cloud.png";
import Cancel from "../../assets/AfterSign/Cancel.png";
import flag from "../../assets/Mywork/flag.png";
import Success from "../../assets/Auth/Succes.png"; // Import success image
import { useNavigate } from "react-router-dom";
import SavedDraft from "./SavedDraft";
import { useEffect, useState } from "react";
import api from "../../utils/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobCreated = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("discover");
  const [showAllJobsPopup, setShowAllJobsPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedDescJobId, setExpandedDescJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [userData, setUserData] = useState(null);
  
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

  const avatars = [Dp1, Dp2, Dp3, Dp4];

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

  /* ================= FETCH USER DATA ================= */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/auth/me");
        setUserData(res.data);
        
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

  /* ================= FETCH JOBS - UPDATED WITH SAVEDDRAFT LOGIC ================= */
  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        setLoading(true);
        const me = await api.get("/auth/me");
        const employerId = me.data.id;

        // Fetch jobs - using the correct endpoint
        const res = await api.get(`/jobs/my-jobs/${employerId}?status=posted`);
        const rawJobs = res.data.jobs || [];

        // Process each job - UPDATED TO MATCH SAVEDDRAFT LOGIC
        const processedJobs = rawJobs.map((job) => {
          // Parse skills if needed
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

          const jobSkills = parseSkills(job.skills);

          // Calculate posted time
          const postedTime = job.created_at ? calculateTimeAgo(job.created_at) : "Posted";

          // Format expertise level
          const formatExpertiseLevel = (level) => {
            if (!level) return "Intermediate";
            return level.charAt(0).toUpperCase() + level.slice(1);
          };

          // Format budget - UPDATED TO MATCH SAVEDDRAFT LOGIC
          const formatBudget = (job) => {
            if (!job.budget_type) return "Budget not specified";

            if (job.budget_type?.toLowerCase() === "hourly" && job.budget_from && job.budget_to) {
              return `$${job.budget_from} – $${job.budget_to}/hr`;
            } else if (job.budget_type?.toLowerCase() === "hourly" && job.budget_from) {
              return `$${job.budget_from}/hr`;
            } else if (job.budget_type?.toLowerCase() === "fixed" && job.budget_from) {
              return `$${job.budget_from}`;
            }

            return "Budget not specified";
          };

          return {
            ...job,
            skills: jobSkills,
            posted_time: postedTime,
            // Location fields for flag display
            city: job.city || "",
            country: job.country || "",
            country_code: job.country_code || "",
            // Rating fields - using actual values if available
            rating: job.rating || 0,
            reviews: job.reviews || 0,
            formatted_expertise: formatExpertiseLevel(job.expertise_level),
            formatted_budget: formatBudget(job),
            // Default values for missing data
            proposals_count: job.proposals_count || 0,
            hired_count: job.hired_count || 0,
            posted_ago: postedTime // Added for consistency with SavedDraft
          };
        });

        setJobs(processedJobs);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, [userData]);

  // Helper function to calculate time ago
  const calculateTimeAgo = (dateString) => {
    try {
      if (!dateString) return "Posted";

      // FIX: make backend datetime ISO-compatible
      const jobDate = new Date(dateString.replace(" ", "T") + "Z");
      const now = new Date();

      const diffMs = now - jobDate;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 1) return "Posted just now";
      if (diffMinutes < 60) return `Posted ${diffMinutes} min ago`;
      if (diffHours === 1) return "Posted 1 hour ago";
      if (diffHours < 24) return `Posted ${diffHours} hours ago`;
      if (diffDays === 1) return "Posted 1 day ago";
      if (diffDays < 30) return `Posted ${diffDays} days ago`;

      const diffMonths = Math.floor(diffDays / 30);
      if (diffMonths === 1) return "Posted 1 month ago";
      return `Posted ${diffMonths} months ago`;
    } catch {
      return "Posted";
    }
  };

  // Helper function to format budget - UPDATED TO MATCH SAVEDDRAFT
  const formatBudget = (job) => {
    if (!job.budget_type) return "Budget not specified";

    if (job.budget_type?.toLowerCase() === "hourly" && job.budget_from && job.budget_to) {
      return `$${job.budget_from} – $${job.budget_to}/hr`;
    } else if (job.budget_type?.toLowerCase() === "hourly" && job.budget_from) {
      return `$${job.budget_from}/hr`;
    } else if (job.budget_type?.toLowerCase() === "fixed" && job.budget_from) {
      return `$${job.budget_from}`;
    }

    return "Budget not specified";
  };

  // Helper function to format expertise level
  const formatExpertiseLevel = (level) => {
    if (!level) return "Intermediate";
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  /* ================= STATISTICS ================= */
  const latestJob = jobs.length > 0 ? jobs[0] : null;
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === "posted").length;
  const completedJobs = jobs.filter(j => j.status === "completed").length;
  const cancelledJobs = jobs.filter(j => j.status === "cancelled").length;

  // UPDATED: Render stars with actual rating - MATCHING SAVEDDRAFT LOGIC
  const renderStars = (rating) => {
    const roundedRating = Math.round(rating || 0);
    return (
      <span className="text-[#4B1D8C]">
        {"★".repeat(roundedRating)}
        {"☆".repeat(5 - roundedRating)}
      </span>
    );
  };

  // UPDATED: Format rating display - MATCHING SAVEDDRAFT LOGIC
  const formatRatingDisplay = (rating, reviews) => {
    const ratingValue = rating || 0;
    const reviewsCount = reviews || 0;

    if (reviewsCount === 0) {
      return "No reviews yet";
    }
    return `${ratingValue}/5 (${reviewsCount} Review${reviewsCount !== 1 ? 's' : ''})`;
  };

  /* ================= VERIFICATION HANDLERS ================= */

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
          // Update user object locally
          setUserData(prev => ({
            ...prev,
            phone_verified: true
          }));
        } else {
          setEmailVerified(true);
          // Update user object locally
          setUserData(prev => ({
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

  // Calculate profile completion
  const getProfileCompletion = () => {
    if (!userData) return 75;

    let basePercentage = 75;
    
    let verificationPercentage = 0;
    if (phoneVerified) verificationPercentage += 10;
    if (emailVerified) verificationPercentage += 10;
    
    return Math.min(basePercentage + verificationPercentage, 100);
  };

  const profilePercent = getProfileCompletion();

  // Handler for edit job
  const handleEditJob = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  // Handler for delete job
  const handleDeleteJob = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        // Try the correct endpoint structure
        await api.delete(`/jobs/${jobId}/delete`)

        // Remove job from state
        setJobs(jobs.filter(job => job.id !== jobId));
        alert("Job deleted successfully");
      } catch (err) {
        console.error("Failed to delete job", err);

        // Fallback: still remove from UI if API fails
        setJobs(jobs.filter(job => job.id !== jobId));
        alert("Job removed from view (API may have failed)");
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col overflow-x-hidden relative bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      
      <section className="w-full flex flex-col items-center justify-start px-4 relative min-w-0">

        {/* ================= BACKGROUND ================= */}
        <div
          className="absolute top-[-104px] left-0 w-full h-[382px] md:h-[582px] z-0"
          style={{
            backgroundImage: `url(${HomeBg})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-black opacity-30" />
        </div>

        {/* ================= WELCOME ================= */}
        <div className="absolute top-[70px] lg:top-[187px] w-full flex items-center justify-center z-10">
          <h1
            className="text-[20px] lg:text-[48px] leading-tight text-center text-white font-normal"
            style={{ fontFamily: "Milonga" }}
          >
            Welcome back, {userData?.first_name || "User"}
          </h1>
        </div>

        <Header />

        {/* ================= MAIN ================= */}
        <div className="w-full max-w-[1400px] mx-auto mt-[240px] lg:mt-[412px] px-4 flex flex-col lg:flex-row gap-8">

          {/* ================= LEFT ================= */}
          <main className="w-full lg:w-[860px] flex flex-col gap-6">

            {/* ===== POSTED JOB SUMMARY ===== */}
            <div className="w-full rounded-[8px] bg-white shadow-md p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-[18px] text-[#2A1E17]">
                  Your Had Posted a Job
                </h3>
                <button
                  onClick={() => setShowAllJobsPopup(true)}
                  className="ring-1 ring-[#51218F] rounded-full px-3 py-1.5 text-[#51218F] text-[10px] font-bold hover:bg-[#51218F] hover:text-white transition"
                >
                  View all jobs
                </button>
              </div>

              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : !latestJob ? (
                <p className="text-gray-500">You have not posted any job yet.</p>
              ) : (
                <div className="flex justify-between text-[12px]">
                  <div>
                    <p className="font-bold">{latestJob.title}</p>
                    <p className="text-gray-600">
                      {latestJob.budget_type === "fixed" ? "Fixed-price" : "Hourly"} · Est. Budget:{" "}
                      {latestJob.formatted_budget}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="font-bold">Proposals</p>
                      <p className="text-gray-600">{latestJob.proposals_count}</p>
                    </div>
                    <div>
                      <p className="font-bold">Hired</p>
                      <p className="text-gray-600">{latestJob.hired_count}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===== TABS ===== */}
            <div className="relative">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200" />
              <div className="flex">
                {["discover", "saved"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-3 font-medium ${activeTab === tab
                      ? "text-[#51218F] font-semibold"
                      : "text-gray-600"
                      }`}
                  >
                    {tab === "discover" ? "View All Jobs" : "Saved Draft"}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#51218F]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ===== DISCOVER/JOB LIST ===== */}
            {activeTab === "discover" ? (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading jobs...</p>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-lg p-6">
                    <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                    <button
                      onClick={() => navigate("/post-job")}
                      className="bg-[#51218F] text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-[#3f1872]"
                    >
                      Post Your First Job
                    </button>
                  </div>
                ) : (
                  jobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      {/* Job Title and Posted Time Row */}
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-[18px] text-[#2A1E17] mb-1">
                            {job.title}
                          </h4>
                          <p className="text-gray-500 text-[14px]">
                            {job.budget_type === "fixed" ? "Fixed-price" : "Hourly"} ·{" "}
                            {job.formatted_expertise} · Est. Budget: {job.formatted_budget} ·{" "}
                            {job.posted_time}
                          </p>
                        </div>
                      </div>

                      {/* Job Description */}
                      <p className="text-gray-600 text-[15px] mb-4 leading-relaxed">
                        {expandedDescJobId === job.id
                          ? job.description || "No description available"
                          : `${job.description?.slice(0, 150) || "No description available"}...`}

                        {job.description && job.description.length > 150 && (
                          <button
                            onClick={() => setExpandedDescJobId(expandedDescJobId === job.id ? null : job.id)}
                            className="text-[#51218F] ml-1 font-medium hover:underline"
                          >
                            {expandedDescJobId === job.id ? "Show less" : "more"}
                          </button>
                        )}
                      </p>

                      {/* Footer with Rating, Location, and Actions */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 flex-wrap gap-4">
                        {/* LEFT: Rating + Location - UPDATED TO MATCH SAVEDDRAFT */}
                        <div className="flex items-center gap-3 md:gap-5 text-[12px] md:text-[14px] text-gray-500 flex-wrap font-['Montserrat']">
                          {/* Budget Type */}
                          <span className="text-[#4B1D8C] font-medium">
                            {job.budget_type?.toLowerCase() === "fixed"
                              ? "$ Fixed Rate"
                              : "$ Hourly Rate"}
                          </span>

                          {/* Rating - UPDATED */}
                          <div className="flex items-center gap-2">
                            <span className="text-[#4B1D8C]">
                              {"★".repeat(Math.round(job.rating || 0))}
                              {"☆".repeat(5 - Math.round(job.rating || 0))}
                            </span>
                            <span>
                              {job.rating || 0}/5 ({job.reviews || 0} Review{job.reviews !== 1 ? 's' : ''})
                            </span>
                          </div>

                          {/* Location with Flag - UPDATED TO MATCH SAVEDDRAFT */}
                          <div className="flex items-center gap-2">
                            {job.country_code ? (
                              <img
                                src={`https://flagcdn.com/w20/${job.country_code.toLowerCase()}.png`}
                                alt={job.country}
                                className="w-[18px] h-[12px] rounded-[4px] object-cover"
                              />
                            ) : (
                              <img
                                src={flag}
                                alt="flag"
                                className="w-[18px] h-[12px] rounded-[4px] object-cover"
                              />
                            )}
                            <span>
                              {job.city}
                              {job.city && job.country ? ", " : ""}
                              {job.country}
                            </span>
                          </div>
                        </div>

                        {/* Edit and Delete Buttons */}
                        <div className="flex items-center gap-3">
                          {/* EDIT BUTTON */}
                          <button
                            onClick={() => handleEditJob(job.id)}
                            className="w-[25px] h-[25px] rounded-full flex items-center justify-center
                              bg-gradient-to-br from-[#51218F] to-[#2E0F55]
                              hover:opacity-90 transition"
                            title="Edit job"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                          </button>

                          {/* DELETE BUTTON */}
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="w-[25px] h-[25px] rounded-full flex items-center justify-center
                              bg-[#FF3B3B] hover:bg-[#E02E2E] transition"
                            title="Delete job"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <SavedDraft />
            )}
          </main>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="hidden lg:flex flex-col w-[420px] gap-8">
            <button
              onClick={() => navigate("/finder")}
              className="w-[190px] self-end h-[39px] rounded-full bg-gradient-to-r from-[#51218F] to-[#170929] text-white font-bold text-[12px]"
            >
              Find collaborator
            </button>

            {/* PROFILE CARD - UPDATED WITH DYNAMIC COMPLETION */}
            <div className="bg-white rounded-[10px] shadow-lg p-6 text-center">
              <h3 className="font-bold text-[22px]">
                {userData?.first_name || "User"}
              </h3>
              <p className="text-[14px] text-gray-600">
                {userData?.role === "creator" ? "Creator" : "Collaborator"}
              </p>

              <div className="mt-4">
                <div className="flex justify-between font-bold text-[14px]">
                  <span>Set up your account</span>
                  <span>{profilePercent}%</span>
                </div>
                <div className="w-full h-[6px] bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-full bg-[#51218F] rounded-full" 
                    style={{ width: `${profilePercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => navigate("/profile")}
                className="w-full mt-6 rounded-full py-3 text-[#51218F] border border-[#51218F] font-bold text-[12px] hover:bg-[#51218F] hover:text-white transition-colors"
              >
                {profilePercent === 100 ? 'Update Profile' : 'Complete your profile'}
              </button>
              
              <p className="hidden lg:block text-[10px] sm:text-[11px] italic text-[#2A1E17E5] text-center mt-3">
                {profilePercent === 100 ? (
                  "🎉 Great! Your profile is now 100% complete!"
                ) : (
                  `${100 - profilePercent}% more to complete your profile will help you get more reach.`
                )}
              </p>
            </div>

            {/* ================= VERIFICATION - UPDATED TO MATCH COLCREATOR DESIGN ================= */}
            <div className="w-full bg-white rounded-[10px] shadow-lg p-6">
              <h3 className="font-semibold text-[20px] mb-4">Verification</h3>
              <div className="w-full h-px bg-black/10 mb-4" />

              {/* Phone Verification */}
              <div className="flex justify-between items-center mb-4">
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
                  <span className="text-[14px] lg:text-[15px] text-[#2A1E17]">Phone verified</span>
                  {phoneVerified && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-[10px] rounded-full">
                      Verified
                    </span>
                  )}
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

              {/* Email Verification */}
              <div className="flex justify-between items-center">
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
                  <span className="text-[14px] lg:text-[15px] text-[#2A1E17]">Email verified</span>
                  {emailVerified && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-[10px] rounded-full">
                      Verified
                    </span>
                  )}
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

            {/* ================= GRADIENT PROMO ================= */}
            <div className="relative">
              <div
                className="w-full h-[98px] rounded-[10px] shadow-[0px_4px_45px_0px_#0000001F] overflow-hidden relative"
                style={{
                  background: "linear-gradient(266.38deg, #51218F 4.44%, #020202 100.18%)",
                }}
              >
                <div className="absolute inset-0">
                  <img
                    src={HomeSub}
                    alt=""
                    className="w-full h-full object-cover opacity-30"
                  />
                </div>

                <div className="relative z-10 h-full flex items-center pl-6 pr-24">
                  <div>
                    <div className="font-medium text-[18px] text-white">
                      Get Subscription for getting
                    </div>
                    <div className="font-medium text-[18px] text-white">
                      more revenue in a month
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute w-[65px] h-[65px] lg:w-[102px] lg:h-[102px] top-1/2 right-[-15px] lg:right-[-30px] -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                style={{
                  background: "linear-gradient(180deg, #FFA412 0%, #6C4343 100%)",
                }}
              >
                <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>

            {/* ================= JOB STATS ================= */}
            <div className="w-full h-[287px] rounded-[10px] bg-white shadow-lg p-6">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[20px] font-medium text-[#2A1E17]">All Job</h3>
                <div className="flex gap-1">
                  <span className="text-[16px]">Total:</span>
                  <span className="font-bold text-[20px]">{totalJobs}</span>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <img src={Folder} className="w-5 mr-3" alt="Folder" />
                  <span>Active projects: {activeJobs}</span>
                </div>

                <div className="flex items-center">
                  <img src={Cloud} className="w-5 mr-3" alt="Cloud" />
                  <span>Completed projects: {completedJobs}</span>
                </div>

                <div className="flex items-center">
                  <img src={Cancel} className="w-5 mr-3" alt="Cancel" />
                  <span>Cancelled projects: {cancelledJobs}</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowAllJobsPopup(true)}
                  className="w-[122px] h-[39px] rounded-full border border-[#51218F] text-[#51218F] font-bold hover:bg-[#51218F] hover:text-white transition-colors"
                >
                  View all
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ================= VIEW ALL JOBS POPUP ================= */}
      {showAllJobsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="relative bg-white w-full max-w-[760px] max-h-[85vh] rounded-[18px] shadow-2xl flex flex-col">

            {/* ===== HEADER ===== */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h2 className="text-[22px] font-bold text-[#2A1E17]">
                  All Posted Jobs ({totalJobs})
                </h2>
                <p className="text-[13px] text-gray-500 mt-1">
                  Showing all jobs you have posted
                </p>
              </div>

              <button
                onClick={() => setShowAllJobsPopup(false)}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
              >
                ✕
              </button>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="px-6 py-6 overflow-y-auto space-y-6">
              {loading ? (
                <div className="text-center text-gray-500 py-12">
                  Loading jobs...
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No jobs found.</p>
                  <button
                    onClick={() => navigate("/post-job")}
                    className="bg-[#51218F] text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-[#3f1872]"
                  >
                    Post Your First Job
                  </button>
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="pb-6 border-b last:border-none">
                    <h3 className="text-[18px] font-semibold text-[#2A1E17] mb-2">
                      {job.title}
                    </h3>

                    <p className="text-[14px] text-gray-500 mb-3">
                      {job.budget_type === "fixed" ? "Fixed-price" : "Hourly"} ·{" "}
                      {job.formatted_expertise} · Est. Budget: {job.formatted_budget} ·{" "}
                      {job.posted_time}
                    </p>

                    {job.description && (
                      <p className="text-[15px] text-gray-600 mb-4 leading-relaxed">
                        {expandedDescJobId === job.id
                          ? job.description
                          : `${job.description.slice(0, 120)}...`}

                        {job.description.length > 120 && (
                          <button
                            onClick={() =>
                              setExpandedDescJobId(
                                expandedDescJobId === job.id ? null : job.id
                              )
                            }
                            className="text-[#51218F] ml-1 font-medium hover:underline"
                          >
                            {expandedDescJobId === job.id ? "Show less" : "more"}
                          </button>
                        )}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      {/* UPDATED: Rating and location display in popup */}
                      <div className="flex items-center gap-3 text-[12px] md:text-[14px] text-gray-500">
                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <span className="text-[#4B1D8C]">
                            {"★".repeat(Math.round(job.rating || 0))}
                            {"☆".repeat(5 - Math.round(job.rating || 0))}
                          </span>
                          <span>
                            {job.rating || 0}/5 ({job.reviews || 0} Review{job.reviews !== 1 ? 's' : ''})
                          </span>
                        </div>

                        {/* Location with Flag */}
                        <div className="flex items-center gap-2">
                          {job.country_code ? (
                            <img
                              src={`https://flagcdn.com/w20/${job.country_code.toLowerCase()}.png`}
                              alt={job.country}
                              className="w-[18px] h-[12px] rounded-[4px] object-cover"
                            />
                          ) : (
                            <img
                              src={flag}
                              alt="flag"
                              className="w-[18px] h-[12px] rounded-[4px] object-cover"
                            />
                          )}
                          <span>
                            {job.city}
                            {job.city && job.country ? ", " : ""}
                            {job.country}
                          </span>
                        </div>
                      </div>

                      {/* Edit and Delete Buttons */}
                      <div className="flex items-center gap-3">
                        {/* EDIT BUTTON */}
                        <button
                          onClick={() => handleEditJob(job.id)}
                          className="w-[25px] h-[25px] rounded-full flex items-center justify-center
                              bg-gradient-to-br from-[#51218F] to-[#2E0F55]
                              hover:opacity-90 transition"
                          title="Edit job"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="w-[25px] h-[25px] rounded-full flex items-center justify-center
                              bg-[#FF3B3B] hover:bg-[#E02E2E] transition"
                          title="Delete job"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

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

      {/* Success Popup */}
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

      <Footer />
    </div>
  );
};

export default JobCreated;