import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import api from "../../utils/axiosConfig";
import TopBanner from "../../assets/Colabwork/banner.png";
import Footer from "../../component/Footer";
import ColHeader from "../../component/ColHeader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UX() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useUser();

  const [job, setJob] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [creatorStats, setCreatorStats] = useState({
    total_jobs_posted: 0,
    hire_rate: 0,
    total_spent: 0,
    total_hires: 0,
    avg_hourly_rate: 0,
    total_hours: 0,
    company_size: '',
    member_since: null,
    rating: 0,
    reviews: 0,
    phone_verified: true,
    email_verified: true,
    country: null,
    city: null,
    country_code: null
  });
  const [userConnects, setUserConnects] = useState(0);

  // Get job ID from navigation state
  useEffect(() => {
    if (location.state?.jobId) {
      fetchJobDetails(location.state.jobId);
    }
  }, [location.state]);

  // Fetch user connects
  const fetchUserConnects = async () => {
    if (!userData?.id) return;
    try {
      const response = await api.get(`/collaborator/connects/${userData.id}`);
      setUserConnects(response.data?.connects || 0);
    } catch (error) {
      console.error('Error fetching connects:', error);
      setUserConnects(0);
    }
  };

  // ==================== FIXED FETCH CREATOR STATS - USING REAL BACKEND DATA ====================
  const fetchCreatorStats = async (creatorId) => {
    if (!creatorId) return;

    try {
      // Fetch creator's jobs from your actual backend
      const jobsResponse = await api.get(`/jobs/my-jobs/${creatorId}?status=posted`);
      const jobs = jobsResponse.data?.jobs || [];

      // Calculate from actual backend data
      const totalJobsPosted = jobs.length;

      // Get creator details from the job data
      const creatorData = jobs[0]?.creator || creator;

      setCreatorStats({
        total_jobs_posted: totalJobsPosted, // Real data from backend
        hire_rate: 0, // Not available in backend yet
        total_spent: 0, // Set to 0 until you have payment data
        total_hires: 0, // Not available in backend yet
        avg_hourly_rate: 0, // Not available in backend yet
        total_hours: 0, // Not available in backend yet
        company_size: creatorData?.company_size || 'Individual',
        member_since: creatorData?.created_at || null,
        rating: 0, // Not available in backend yet
        reviews: 0, // Not available in backend yet
        phone_verified: creatorData?.phone_verified || true,
        email_verified: creatorData?.email_verified || true,
        country: creatorData?.country || null,
        city: creatorData?.city || null,
        country_code: creatorData?.country_code || null
      });

    } catch (error) {
      console.error('Error fetching creator stats:', error);
      // If API fails, use data from creator object
      if (creator) {
        setCreatorStats(prev => ({
          ...prev,
          country: creator.country || null,
          city: creator.city || null,
          country_code: creator.country_code || null,
          member_since: creator.created_at || null,
          phone_verified: creator.phone_verified || true,
          email_verified: creator.email_verified || true,
        }));
      }
    }
  };

  // Fetch job details
  const fetchJobDetails = async (jobId) => {
    setLoading(true);
    try {
      const response = await api.get(`/collaborator/jobs/${jobId}`);
      const jobData = response.data || {};
      const creatorData = jobData.creator || {};

      setJob(jobData);
      setCreator(creatorData);

      // Fetch creator stats using the actual jobs endpoint
      if (creatorData.id) {
        await fetchCreatorStats(creatorData.id);
      }

    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  // Load saved jobs and user connects
  useEffect(() => {
    if (!userData?.id) return;

    const loadUserData = async () => {
      try {
        // Load saved jobs
        const savedResponse = await api.get(`/collaborator/jobs/saved/${userData.id}`);
        if (savedResponse.data && savedResponse.data.length > 0) {
          const savedJobIds = new Set(savedResponse.data.map(job => job.id));
          setSavedJobs(savedJobIds);
        }

        // Load user connects
        await fetchUserConnects();

      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [userData]);

  // Handle save/unsave job
  const handleSaveJob = async () => {
    if (!userData?.id || !job?.id) {
      toast.error('Please login to save jobs');
      return;
    }

    try {
      const response = await api.post('/collaborator/jobs/toggle-save', null, {
        params: {
          user_id: userData.id,
          job_id: job.id
        }
      });

      if (response.data.status === 'saved') {
        setSavedJobs(prev => new Set([...prev, job.id]));
        toast.success('Job saved successfully');
      } else {
        setSavedJobs(prev => {
          const newSet = new Set(prev);
          newSet.delete(job.id);
          return newSet;
        });
        toast.info('Job removed from saved');
      }
    } catch (error) {
      console.error('Error toggling save job:', error);
      toast.error('Failed to save job');
    }
  };

  // Handle submit proposal
  const handleSubmitProposal = () => {
    navigate('/Uploadux', {
      state: {
        jobId: job?.id,
        jobTitle: job?.title,
        budget: job?.budget,
        budget_type: job?.budget_type
      }
    });
  };

  // Format time ago
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

  // Format budget display
  const formatBudget = () => {
    if (!job) return '$0.00';

    if (job.budget_from && job.budget_to) {
      return `$${job.budget_from} - $${job.budget_to}`;
    } else if (job.budget_from) {
      return `$${job.budget_from}`;
    } else if (job.budget_to) {
      return `$${job.budget_to}`;
    }
    return '$0.00';
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '$0';
    if (amount >= 1000) {
      return `$${Math.round(amount/1000)}k+`;
    }
    return `$${amount}`;
  };

  // Format member since date
  const formatMemberSince = (dateString) => {
    if (!dateString) return 'Jan 22, 2020';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Jan 22, 2020';
    }
  };

  // Country flag component
  const CountryFlag = ({ countryCode, country }) => {
    if (!countryCode) {
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" stroke="#6B6B6B" strokeWidth="1.5"/>
          <path d="M12 8v4l3 3" stroke="#6B6B6B" strokeWidth="1.5"/>
        </svg>
      );
    }

    return (
      <img
        src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
        alt={country}
        title={country}
        className="w-[18px] h-[12px] rounded-[4px] object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://flagcdn.com/w20/us.png";
        }}
      />
    );
  };

  if (loading) {
    return (
      <div className="w-full bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />

      {/* ======================= BANNER + HEADER ======================= */}
      <div className="relative w-full h-[420px] md:h-[520px] xl:h-[582px]">
        <div className="absolute top-0 left-0 w-full z-50">
          <ColHeader />
        </div>
        <img
          src={TopBanner}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover blur-[1px]"
        />
      </div>

      {/* ======================= CENTER WRAPPER ======================= */}
      <div className="min-h-screen flex justify-center">
        <div
          className="
            relative w-full
            max-w-[1200px]
            2xl:max-w-[1320px]
            mx-4 sm:mx-auto
            -mt-[240px] lg:-mt-[300px]
            bg-white
            border border-black
            rounded-none
          "
        >
          {/* ================= TOP BORDER ================= */}
          <div className="border-b border-gray-200 px-6 md:px-8 pt-4 pb-0">
            {/* BACK BUTTON */}
            <button 
              onClick={() => navigate(-1)}
              className="hidden sm:flex items-center text-[16px] text-[#111111] mb-4"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#111111"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Back</span>
            </button>

            <div className="hidden sm:block h-px bg-gray-200 w-full"></div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="flex flex-col lg:flex-row">
            {/* ================= LEFT ================= */}
            <div className="flex-1 px-4 md:px-8 py-3 sm:py-6">
              {/* TITLE + META ROW */}
              <div className="flex justify-between items-start sm:items-start mb-1 sm:mb-3">
                <div>
                  <h2
                    className="
                      text-[14px] sm:text-[20px]
                      font-semibold
                      leading-tight
                      tracking-tight
                      whitespace-normal
                    "
                  >
                    {job?.title || "Looking for a UX Web Designer"}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1 sm:hidden">
                    {formatTimeAgo(job?.created_at)}
                  </p>
                </div>

                <div className="text-right mt-3 sm:mt-0">
                  <p className="text-[16px] font-semibold text-left sm:text-right">
                    {formatBudget()} USD
                  </p>
                  <p className="text-[11px] text-gray-400 uppercase mt-1">
                    {job?.budget_type === 'fixed' ? 'Fixed Price' : 'Hourly Rate'}
                  </p>
                </div>
              </div>

              {/* POSTED — DESKTOP */}
              <p className="hidden sm:block text-sm text-gray-500 mb-5">
                {formatTimeAgo(job?.created_at)}
              </p>

              {/* DESCRIPTION */}
              <p className="text-[14px] leading-[22px] text-gray-700 mt-9 sm:mt-0 mb-4">
                {job?.description || "No description available"}
              </p>

              {/* KEY AREAS - These would come from job.skills_required */}
              <p className="text-[14px] font-semibold mb-2">Required Skills</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job?.skills_required?.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-[12px] text-gray-700">
                    {skill}
                  </span>
                ))}
                {(!job?.skills_required || job.skills_required.length === 0) && (
                  <p className="text-[14px] text-gray-500">No specific skills listed</p>
                )}
              </div>

              <div className="h-[1px] bg-gray-200 mb-4"></div>

              {/* SKILLS */}
              <h3 className="font-semibold text-[14px] mb-4">
                Skills and Expertise
              </h3>

              <div className="flex gap-2 mb-6 flex-wrap">
                {job?.skills_required?.map((tag, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`
                      px-4 py-1
                      rounded-full
                      bg-gray-100
                      text-[12px]
                      text-gray-600
                      hover:bg-gray-200
                      transition
                      cursor-pointer
                      ${i > 1 ? "hidden sm:inline-flex" : ""}
                    `}
                  >
                    {tag}
                  </button>
                ))}
                {(!job?.skills_required || job.skills_required.length === 0) && (
                  <p className="text-[14px] text-gray-500">No skills listed</p>
                )}
              </div>

              <div className="h-[1px] bg-gray-200 mb-4"></div>

              {/* JOB ACTIVITY */}
              <h3 className="font-semibold text-[14px] mb-3">Job Activity</h3>

              <div className="grid grid-cols-2 gap-y-3 gap-x-6 sm:grid-cols-1 text-[13px] text-gray-700">
                <p><b>Proposals:</b> {job?.proposal_count || 0}</p>
                <p><b>Last viewed by client:</b> {formatTimeAgo(job?.last_viewed_at) || 'Recently'}</p>
                <p><b>Interviewing:</b> {job?.interviewing_count || 0}</p>
                <p><b>Invites sent:</b> {job?.invites_sent || 0}</p>
                <p className="col-span-2 sm:col-span-1">
                  <b>Unanswered invites:</b> {job?.unanswered_invites || 0}
                </p>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="hidden lg:block w-[1px] bg-gray-200"></div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <div className="w-full lg:w-[340px] px-6 lg:px-8 py-8">
              {/* BUTTONS */}
              <button
                onClick={handleSubmitProposal}
                className="
                  w-full
                  bg-[#5B2D91]
                  text-white
                  py-3
                  rounded-full
                  text-[14px] sm:text-[15px]
                  font-semibold
                  mb-4 sm:mb-4
                  hover:bg-[#4a2373]
                  transition-colors
                "
              >
                Submit a proposal
              </button>

              <button
                onClick={handleSaveJob}
                className="
                  w-full
                  border border-[#2F3A40]
                  text-[#2F3A40]
                  py-3
                  rounded-full
                  text-[14px] sm:text-[15px]
                  font-semibold
                  mb-5 sm:mb-6
                  hover:bg-[#5B2D91] hover:text-white hover:border-[#5B2D91]
                  transition-colors
                "
              >
                {savedJobs.has(job?.id) ? 'Saved ✓' : 'Save the project'}
              </button>

              {/* CONNECTS */}
              <div className="text-[13px] text-[#2F3A40] leading-[22px] sm:leading-[24px] mt-2">
                <p>
                  Required Connects to submit a proposal: <b>6</b>
                </p>
                <p className="mt-1">
                  Available Connects: <b>{userConnects || 0}</b>
                </p>
              </div>

              {/* DIVIDER */}
              <div className="h-[1px] bg-gray-200 mb-6 mr-10 w-77"></div>

              {/* ABOUT CLIENT - UPDATED WITH REAL DATA FROM BACKEND */}
              <div className="bg-white rounded-xl p-4 sm:p-0 ml-0 sm:ml-auto">
                <h3 className="text-[16px] sm:text-[18px] font-semibold mb-3 sm:mb-4">
                  About the client
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-6">
                  {/* LEFT COLUMN - LOCATION, TIME, JOINED */}
                  <div className="order-1 sm:order-1">
                    <div className="space-y-2 sm:space-y-3 text-[13px] sm:text-[14px] text-[#3A3A3A] mb-4">
                      {/* LOCATION */}
                      <div className="flex items-center gap-2">
                        <CountryFlag
                          countryCode={creatorStats.country_code || creator?.country_code}
                          country={creatorStats.country || creator?.country}
                        />
                        <span>{creatorStats.city || creator?.city || creatorStats.country || creator?.country || "Remote"}</span>
                      </div>

                      {/* TIME */}
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="9" stroke="#6B6B6B" strokeWidth="1.5"/>
                          <path d="M12 7V12L15 14" stroke="#6B6B6B" strokeWidth="1.5"/>
                        </svg>
                        <span>Local time unknown</span>
                      </div>

                      {/* JOINED */}
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 21h12M9 17V5l3-2 3 2v12" stroke="#6B6B6B" strokeWidth="1.5"/>
                        </svg>
                        <span>Joined {creator?.created_at ? formatTimeAgo(creator.created_at) : 'Recently'}</span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN – STATS - REAL DATA FROM BACKEND */}
                  <div className="order-2 sm:order-2 space-y-1.5 sm:space-y-2 text-[13px] sm:text-[14px] text-[#3A3A3A]">
                    <p className="font-semibold">{creatorStats.city || creator?.city || creatorStats.country || creator?.country || "Remote"}</p>
                    <p className="font-semibold">{creatorStats.total_jobs_posted} jobs posted</p>
                    <p className="text-[#6B6B6B]">{creatorStats.hire_rate}% hire rate</p>
                    <p className="font-semibold">{formatCurrency(creatorStats.total_spent)}+ total spent</p>
                    <p className="text-[#6B6B6B]">{creatorStats.total_hires} hires</p>
                    <p className="font-semibold">${creatorStats.avg_hourly_rate}/hr avg hourly rate</p>
                    <p className="text-[#6B6B6B]">{creatorStats.total_hours} hours</p>
                    <p className="font-semibold">{creatorStats.company_size || 'Individual'}</p>
                    <p className="text-[#6B6B6B]">Member since {formatMemberSince(creatorStats.member_since || creator?.created_at)}</p>
                  </div>

                  {/* RATING AND VERIFICATIONS */}
                  <div className="order-2 sm:order-3 col-span-1">
                    <div className="-mt-48 sm:mt-4">
                      <div className="flex gap-[2px] text-purple-600 text-[16px] sm:text-[18px]">
                        {"★".repeat(Math.floor(creatorStats.rating))}
                        {"☆".repeat(5 - Math.floor(creatorStats.rating))}
                      </div>
                      <span className="text-[13px] sm:text-[14px] text-[#6B6B6B]">
                        {creatorStats.rating}/5 ({creatorStats.reviews} Reviews)
                      </span>
                    </div>

                    {/* DIVIDER */}
                    <div className="hidden sm:block h-[1px] bg-gray-200 my-6"></div>

                    {/* VERIFICATIONS */}
                    <div className="space-y-3 sm:space-y-4 text-[13px] sm:text-[14px] text-[#2b2b2b]">
                      {/* Phone */}
                      <div className="flex items-center gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 A19.8 19.8 0 0 1 3 5.2 A2 2 0 0 1 5 3h3 a2 2 0 0 1 2 1.7l.5 2.5 a2 2 0 0 1-.6 1.8l-1.2 1.2 a16 16 0 0 0 6.6 6.6l1.2-1.2 a2 2 0 0 1 1.8-.6l2.5.5 a2 2 0 0 1 1.7 2.2Z" stroke={creatorStats.phone_verified ? "#5B2D91" : "#9CA3AF"} strokeWidth="1.5" />
                        </svg>
                        <span className={`font-semibold ${creatorStats.phone_verified ? 'text-[#5B2D91]' : 'text-gray-400'}`}>
                          {creatorStats.phone_verified ? 'Phone Verified' : 'Phone not verified'}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="5" width="18" height="14" rx="2" stroke={creatorStats.email_verified ? "#5B2D91" : "#9CA3AF"} strokeWidth="1.5" />
                          <path d="M3 7l9 6 9-6" stroke={creatorStats.email_verified ? "#5B2D91" : "#9CA3AF"} strokeWidth="1.5" />
                        </svg>
                        <span className={`font-semibold ${creatorStats.email_verified ? 'text-[#5B2D91]' : 'text-gray-400'}`}>
                          {creatorStats.email_verified ? 'Email Verified' : 'Email not verified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="-mx-4 mt-4">
        <Footer />
      </div>
    </div>
  );
}