import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import api from "../../utils/axiosConfig";
import TopBanner from "../../assets/Colabwork/banner.png";
import Footer from "../../component/Footer";
import ColHeader from "../../component/ColHeader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function UploadUX() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useUser();

  const [showMilestones, setShowMilestones] = useState(false);
  const [paymentType, setPaymentType] = useState('milestone');
  const [milestones, setMilestones] = useState([{ description: '', due_date: '', amount: '' }]);
  const [coverLetter, setCoverLetter] = useState('');
  const [duration, setDuration] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(true);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
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

  // Get job ID from navigation state and fetch full job details
  useEffect(() => {
    if (location.state?.jobId) {
      fetchFullJobDetails(location.state.jobId);
    } else {
      toast.error('Job information missing');
      navigate('/col-home');
    }
  }, [location.state, navigate]);

  // Fetch complete job details with creator information
  const fetchFullJobDetails = async (jobId) => {
    setFetchingJob(true);
    try {
      const response = await api.get(`/collaborator/jobs/${jobId}`);
      const jobData = response.data || {};
      const creatorData = jobData.creator || {};
      
      setJobDetails({
        ...jobData,
        jobId: jobData.id,
        jobTitle: jobData.title,
        description: jobData.description,
        skills_required: jobData.skills_required || [],
        budget_from: jobData.budget_from,
        budget_to: jobData.budget_to,
        budget_type: jobData.budget_type,
        expertise_level: jobData.expertise_level,
        created_at: jobData.created_at,
        proposal_count: jobData.proposal_count || 0,
        required_connects: jobData.required_connects || 6
      });
      setCreator(creatorData);
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast.error('Failed to load job details');
      navigate('/col-home');
    } finally {
      setFetchingJob(false);
    }
  };

  // Handle milestone change
  const handleMilestoneChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  // Add new milestone
  const addMilestone = () => {
    setMilestones([...milestones, { description: '', due_date: '', amount: '' }]);
  };

  // Remove milestone
  const removeMilestone = (index) => {
    const updated = milestones.filter((_, i) => i !== index);
    setMilestones(updated);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  // Remove file
  const removeFile = (index) => {
    const updated = attachments.filter((_, i) => i !== index);
    setAttachments(updated);
  };

  // Format budget for display
  const formatBudget = () => {
    if (!jobDetails) return '$0.00';
    
    if (jobDetails.budget_from && jobDetails.budget_to) {
      return `$${jobDetails.budget_from} - $${jobDetails.budget_to}`;
    } else if (jobDetails.budget_from) {
      return `$${jobDetails.budget_from}`;
    } else if (jobDetails.budget_to) {
      return `$${jobDetails.budget_to}`;
    }
    return '$0.00';
  };

  // Format budget type
  const formatBudgetType = (budgetType) => {
    if (!budgetType) return 'Fixed-price';
    return budgetType === 'fixed' || budgetType === 'Fixed' ? 'Fixed-price' : 'Hourly';
  };

  // Submit proposal
  const handleSubmitProposal = async () => {
    if (!coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }

    if (!duration) {
      toast.error('Please select project duration');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      // Add proposal data
      formData.append('user_id', userData.id);
      formData.append('job_id', jobDetails.jobId);
      formData.append('cover_letter', coverLetter);
      formData.append('payment_type', paymentType);
      formData.append('duration', duration);
      formData.append('bid_amount', jobDetails?.budget_from || '10.00');
      
      // Add milestones if selected
      if (paymentType === 'milestone') {
        const validMilestones = milestones.filter(m => m.description && m.amount);
        if (validMilestones.length === 0) {
          toast.error('Please add at least one milestone with description and amount');
          setLoading(false);
          return;
        }
        formData.append('milestones', JSON.stringify(validMilestones));
      }
      
      // Add attachments
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      // FOR DEVELOPMENT/TESTING - Remove this when backend endpoint is ready
      if (import.meta.env.DEV) {
        console.log('📝 Development mode - Simulating successful submission');
        console.log('Proposal data:', {
          user_id: userData.id,
          job_id: jobDetails.jobId,
          cover_letter: coverLetter,
          payment_type: paymentType,
          duration: duration,
          milestones: paymentType === 'milestone' ? milestones.filter(m => m.description && m.amount) : [],
          attachments: attachments.map(f => f.name)
        });
        
        // Simulate successful response
        setTimeout(() => {
          toast.success('Proposal submitted successfully! (Demo)');
          // FIXED: Changed from '/Proposal' to '/proposal' (lowercase to match route)
          navigate('/proposal', {
            state: {
              proposalId: `demo-${Date.now()}`,
              jobId: jobDetails.jobId,
              jobTitle: jobDetails.jobTitle,
              coverLetter: coverLetter,
              bidAmount: jobDetails?.budget_from || '10.00',
              budget_type: jobDetails?.budget_type
            }
          });
          setLoading(false);
        }, 1500);
        return;
      }

      // PRODUCTION - Use this when backend endpoint is ready
      const response = await api.post('/collaborator/proposals/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        toast.success('Proposal submitted successfully!');
        // FIXED: Changed from '/Proposal' to '/proposal' (lowercase to match route)
        navigate('/proposal', {
          state: {
            proposalId: response.data.id,
            jobId: jobDetails.jobId,
            jobTitle: jobDetails.jobTitle,
            coverLetter: coverLetter,
            bidAmount: response.data.bid_amount || jobDetails?.budget_from,
            budget_type: jobDetails?.budget_type
          }
        });
      }
    } catch (error) {
      console.error('Error submitting proposal:', error);
      
      // Better error message based on status
      if (error.response?.status === 404) {
        toast.error('Proposal endpoint not found. Please contact support.');
        console.error('Backend endpoint /collaborator/proposals/submit is missing');
      } else if (error.response?.status === 401) {
        toast.error('Please login again');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to submit proposals');
      } else {
        toast.error(error.response?.data?.message || 'Failed to submit proposal');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJob) {
    return (
      <div className="w-full bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#F5F5F5] min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      
      <div className="absolute top-0 left-0 w-full z-50">
        <ColHeader />
      </div>

      {/* ======================= BANNER + HEADER ======================= */}
      <div className="relative w-full h-[420px] md:h-[520px] xl:h-[582px]">
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
            relative
            w-full
            max-w-[1200px] 2xl:max-w-[1320px]
            mx-4 sm:mx-auto
            -mt-[240px] lg:-mt-[300px]
            bg-white border border-black
            rounded-none
          "
        >
          {/* TOP BAR */}
          <div className="border-b border-gray-200 px-6 md:px-8 pt-4 pb-0">
            {/* BACK — DESKTOP ONLY */}
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

            {/* DIVIDER — DESKTOP ONLY */}
            <div className="hidden sm:block h-[1px] bg-gray-200 w-full"></div>
          </div>

          {/* CONTENT */}
          <div className="px-6 py-6">
            {/* TITLE */}
            <h2 className="text-[18px] font-semibold mb-1">
              {jobDetails?.jobTitle || "Looking for a UX Web Designer"}
            </h2>
            
            {/* POSTED TIME - ADDED */}
            <p className="text-[13px] text-gray-500 mb-4">
              Posted {formatTimeAgo(jobDetails?.created_at)}
            </p>

            {/* JOB DESCRIPTION - ADDED */}
            {jobDetails?.description && (
              <div className="mb-4">
                <p className="text-[14px] leading-[22px] text-gray-700 whitespace-pre-line">
                  {jobDetails.description}
                </p>
              </div>
            )}

            {/* JOB SUMMARY */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Client's budget:</span>
                <span className="text-[#5B2D91] font-bold">
                  {formatBudgetType(jobDetails?.budget_type)} - 
                  {formatBudget()}
                </span>
              </div>
              {creator && (
                <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
                  <span>Client:</span>
                  <span>{creator.first_name || creator.last_name ? `${creator.first_name || ''} ${creator.last_name || ''}`.trim() : 'Client'}</span>
                </div>
              )}
            </div>

            <div className="h-[1px] bg-gray-200 w-full"></div>

            <div className="border-t pt-6 mb-1">
              {/* TERMS */}
              <div className="flex justify-between mb-7">
                <h4 className="font-semibold text-[14px]">Terms</h4>
                <p className="text-[14px]">
                  Client's budget: <b>{formatBudget()} USD</b>
                </p>
              </div>
              
              <div className="h-[1px] bg-gray-200 w-full"></div>

              <div className="mt-39">
                <button
                  onClick={() => setShowMilestones(prev => !prev)}
                  className="text-[#5B2D91] text-[14px] mb-6 font-medium"
                >
                  {showMilestones ? "- Hide milestones" : "+ Add milestones"}
                </button>
              </div>

              {showMilestones && (
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  {/* PAYMENT TYPE */}
                  <h3 className="text-[16px] font-semibold mb-5 text-gray-900">
                    How do you want to be paid?
                  </h3>

                  <div className="space-y-5 mb-8">
                    {/* BY MILESTONE */}
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentType === 'milestone'}
                        onChange={() => setPaymentType('milestone')}
                        className="mt-1 accent-[#5B2D91]"
                      />
                      <div>
                        <p className="font-medium text-[14px] text-gray-900">
                          By milestone
                        </p>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          Divide the project into smaller segments, called milestones.
                          You'll be paid for milestones as they are completed and approved.
                        </p>
                      </div>
                    </label>

                    {/* BY PROJECT */}
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentType === 'project'}
                        onChange={() => setPaymentType('project')}
                        className="mt-1 accent-[#5B2D91]"
                      />
                      <div>
                        <p className="font-medium text-[14px] text-gray-900">
                          By project
                        </p>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          Get your entire payment at the end, when all work has been delivered.
                        </p>
                      </div>
                    </label>
                  </div>

                  {paymentType === 'milestone' && (
                    <>
                      {/* MILESTONE HEADER */}
                      <h4 className="text-[15px] font-semibold text-gray-900 mb-4">
                        How many milestones do you want to include?
                      </h4>

                      {/* TABLE HEADER (DESKTOP ONLY) */}
                      <div className="hidden sm:grid grid-cols-12 gap-3 text-[13px] font-semibold text-black mb-2">
                        <div className="col-span-6 pl-3">Description</div>
                        <div className="col-span-3 -ml-20">Due date</div>
                        <div className="col-span-2 -ml-15">Amount</div>
                      </div>

                      {/* MILESTONE ROWS */}
                      {milestones.map((milestone, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-3 mb-4 relative">
                          {/* INDEX */}
                          <div className="hidden sm:block col-span-1 text-[14px] text-gray-700">
                            {index + 1}
                          </div>

                          {/* DESCRIPTION */}
                          <div className="sm:col-span-4 sm:-ml-[60px]">
                            <label className="sm:hidden block text-[13px] font-medium mb-1">
                              Description
                            </label>
                            <input
                              value={milestone.description}
                              onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                              className="
                                w-full sm:w-[420px]
                                h-[45px]
                                px-4
                                text-[14px]
                                rounded-[10px]
                                bg-white
                                border border-gray-400/30
                                ring-1 ring-gray-400/30
                                outline-none
                                focus:border-[#5B2D91]
                                focus:ring-2 focus:ring-[#5B2D91]/30
                              "
                              placeholder="Write descriptions"
                            />
                          </div>

                          {/* DUE DATE */}
                          <div className="sm:col-span-3">
                            <label className="sm:hidden block text-[13px] font-medium mb-1">
                              Due date
                            </label>
                            <input
                              type="date"
                              value={milestone.due_date}
                              onChange={(e) => handleMilestoneChange(index, 'due_date', e.target.value)}
                              className="
                                w-full sm:w-[282px]
                                h-[45px]
                                px-4
                                text-[14px]
                                rounded-[10px]
                                border border-gray-400/30
                                ring-1 ring-gray-400/30
                                outline-none
                                focus:border-[#5B2D91]
                                focus:ring-2 focus:ring-[#5B2D91]/30
                              "
                            />
                          </div>

                          {/* AMOUNT */}
                          <div className="sm:col-span-2 relative sm:ml-6">
                            <label className="sm:hidden block text-[13px] font-medium mb-1">
                              Amount
                            </label>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-[18px] font-semibold">
                              $
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={milestone.amount}
                              onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                              className="
                                w-full sm:w-[220px]
                                h-[45px]
                                px-4 pl-10
                                text-[14px]
                                text-right
                                rounded-[10px]
                                bg-white
                                border border-gray-400/30
                                ring-1 ring-gray-400/30
                                outline-none
                                focus:border-[#5B2D91]
                                focus:ring-2 focus:ring-[#5B2D91]/30
                              "
                              placeholder="0.00"
                            />
                          </div>

                          {/* REMOVE BUTTON */}
                          {milestones.length > 1 && (
                            <button
                              onClick={() => removeMilestone(index)}
                              className="absolute -right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}

                      {/* ADD MORE MILESTONE */}
                      <button
                        onClick={addMilestone}
                        className="mt-4 text-[#5B2D91] text-[14px] font-medium"
                      >
                        + Add another milestone
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="h-px bg-gray-200 w-full mt-3 sm:mt-0"></div>

              {/* DURATION */}
              <div className="mb-6">
                <label className="block text-[14px] font-semibold mt-4 mb-2">
                  How long it will take?
                </label>

                <div className="relative w-[220px]">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="
                      w-full
                      h-[40px]
                      appearance-none
                      !border border-gray-300
                      rounded-md
                      px-3 pr-10
                      text-[14px]
                      focus:outline-none
                    "
                  >
                    <option value="">Select duration</option>
                    <option value="1 month">1 month</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="1 year">1 year</option>
                  </select>

                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M6 9L12 15L18 9"
                      stroke="#555"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="hidden sm:block h-px bg-gray-200 w-full mt-14"></div>

              <div className="text-[18px] mt-1 sm:mt-3 mb-2 sm:mb-4">
                <h4>Additional details</h4>
              </div>

              <div className="h-px bg-gray-200 w-full mb-4 sm:mb-14"></div>

              {/* COVER LETTER */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-[14px] font-semibold mb-2">
                  Write cover letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Write your cover letter here..."
                  className="w-full h-[200px] sm:h-[240px] !border rounded-md p-3 text-[14px] focus:ring-2 focus:ring-[#5B2D91]/30 focus:border-[#5B2D91] outline-none"
                  required
                />
              </div>

              {/* ATTACHMENTS */}
              <div className="mb-8">
                <label className="block text-[14px] font-semibold mb-2">
                  Attachments
                </label>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="projectUpload"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {/* Upload box */}
                <div
                  className="
                    !border
                    rounded-md
                    py-6
                    text-center
                    text-[14px]
                    cursor-pointer
                    hover:bg-gray-50
                  "
                  onClick={() => document.getElementById("projectUpload").click()}
                >
                  Drag or{" "}
                  <b className="text-purple-500 underline">
                    upload project
                  </b>{" "}
                  files
                </div>

                {/* File list */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="text-[13px]">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                <button
                  onClick={handleSubmitProposal}
                  disabled={loading}
                  className="bg-[#5B2D91] text-white px-6 py-3 rounded-full text-[14px] font-semibold hover:bg-[#4a2373] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit a proposal'}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="text-[14px] px-6 py-3 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
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