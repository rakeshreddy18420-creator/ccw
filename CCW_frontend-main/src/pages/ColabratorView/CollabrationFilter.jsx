import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from '../../contexts/UserContext';
import api from "../../utils/axiosConfig";
import bgImage from "../../assets/Mywork/hero-bg.png";
import Footer from "../../component/Footer";
import flagIcon from "../../assets/Mywork/flag.png";
import USAFlag from "../../assets/AfterSign/Usa.png";
import UKFlag from "../../assets/AfterSign/Chn.jpg";
import CanadaFlag from "../../assets/AfterSign/Trc.jpg";
import ColHeader from "../../component/ColHeader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CollabrationFilter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useUser();

  // State for jobs
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for saved jobs interactions
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [likedJobs, setLikedJobs] = useState(new Set());

  // Sort state
  const [sortOption, setSortOption] = useState("latest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    projectTypes: {
      fixed: false,
      hourly: false
    },
    fixedPriceRange: 1000,
    hourlyPriceRange: 100,
    selectedSkills: new Set(),
    location: "",
    languages: new Set()
  });

  // Sort options
  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "oldest", label: "Oldest" },
    { value: "budget_high", label: "Budget: High to Low" },
    { value: "budget_low", label: "Budget: Low to High" },
    { value: "rating_high", label: "Rating: High to Low" }
  ];

  // Skill options
  const skillOptions = [
    "Website Design",
    "Graphic Design",
    "Logo Design",
    "Illustrator",
    "Corporate Identity",
    "Photoshop Design",
    "UX design",
    "UI design"
  ];

  // Get search query from navigation state
  useEffect(() => {
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
    }
  }, [location.state]);

  // Format time ago (SAME AS ColHome)
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

  // Get flag based on country (SAME AS ColHome)
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

  // Format budget type for display (SAME AS ColHome)
  const formatBudgetType = (budgetType) => {
    if (!budgetType) return 'Fixed-price';
    return budgetType === 'fixed' || budgetType === 'Fixed' ? 'Fixed-price' : 'Hourly';
  };

  // Format budget for display (SAME AS ColHome)
  const formatBudget = (job) => {
    if (job.budget_from !== null && job.budget_to !== null) {
      return `$${job.budget_from} - $${job.budget_to}`;
    } else if (job.budget_from !== null) {
      return `$${job.budget_from}`;
    } else if (job.budget_to !== null) {
      return `$${job.budget_to}`;
    }
    return '$2,000';
  };

  // Format rate type for display (SAME AS ColHome)
  const formatRateType = (budgetType) => {
    if (!budgetType) return '$ Fixed Rate';
    return budgetType === 'fixed' || budgetType === 'Fixed' ? '$ Fixed Rate' : '$ Hourly Rate';
  };

  // Sort jobs function
  const sortJobs = (jobsToSort, option) => {
    const sorted = [...jobsToSort];
    
    switch(option) {
      case "latest":
        return sorted.sort((a, b) => new Date(b.created_at || b.posted_at) - new Date(a.created_at || a.posted_at));
      case "oldest":
        return sorted.sort((a, b) => new Date(a.created_at || a.posted_at) - new Date(b.created_at || b.posted_at));
      case "budget_high":
        return sorted.sort((a, b) => {
          const budgetA = Math.max(a.budget_to || 0, a.budget_from || 0);
          const budgetB = Math.max(b.budget_to || 0, b.budget_from || 0);
          return budgetB - budgetA;
        });
      case "budget_low":
        return sorted.sort((a, b) => {
          const budgetA = Math.min(a.budget_from || 0, a.budget_to || 0);
          const budgetB = Math.min(b.budget_from || 0, b.budget_to || 0);
          return budgetA - budgetB;
        });
      case "rating_high":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return sorted;
    }
  };

  // Country Flag Component (SAME AS ColHome)
  const CountryFlag = ({ countryCode, country }) => {
    if (!countryCode) return <span>🌍</span>;

    return (
      <img
        src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
        alt={country}
        title={country}
        className="w-[18px] h-[12px] rounded-[4px] object-cover"
        onError={(e) => {
          e.target.replaceWith(
            document.createTextNode(
              String.fromCodePoint(
                ...[...countryCode.toUpperCase()].map(
                  (c) => 127397 + c.charCodeAt()
                )
              )
            )
          );
        }}
      />
    );
  };

  // Apply filters and sorting to jobs
  const applyFiltersAndSort = () => {
    let filtered = [...jobs];

    // Filter by project type
    const { fixed, hourly } = filters.projectTypes;
    if (fixed || hourly) {
      filtered = filtered.filter(job => {
        const isFixed = job.budget_type === 'fixed' || job.budget_type === 'Fixed';
        const isHourly = job.budget_type === 'hourly' || job.budget_type === 'Hourly';
        
        return (fixed && isFixed) || (hourly && isHourly);
      });
    }

    // Filter by fixed price
    if (filters.fixedPriceRange > 0) {
      filtered = filtered.filter(job => {
        const isFixed = job.budget_type === 'fixed' || job.budget_type === 'Fixed';
        if (isFixed) {
          const budget = job.budget_to || job.budget_from || 0;
          return budget <= filters.fixedPriceRange * 1000;
        }
        return true;
      });
    }

    // Filter by hourly price
    if (filters.hourlyPriceRange > 0) {
      filtered = filtered.filter(job => {
        const isHourly = job.budget_type === 'hourly' || job.budget_type === 'Hourly';
        if (isHourly) {
          const budget = job.budget_to || job.budget_from || 0;
          return budget <= filters.hourlyPriceRange;
        }
        return true;
      });
    }

    // Filter by skills
    if (filters.selectedSkills.size > 0) {
      filtered = filtered.filter(job => {
        const jobSkills = job.skills_required || [];
        return Array.from(filters.selectedSkills).some(skill => 
          jobSkills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
      });
    }

    // Filter by location
    if (filters.location.trim()) {
      filtered = filtered.filter(job => {
        const jobLocation = [job.state, job.country].filter(Boolean).join(", ");
        return jobLocation.toLowerCase().includes(filters.location.toLowerCase());
      });
    }

    // Apply sorting
    filtered = sortJobs(filtered, sortOption);
    
    setFilteredJobs(filtered);
  };

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) return;
      
      setLoading(true);
      try {
        const response = await api.get("/collaborator/job-search", {
          params: { search: searchQuery }
        });

        if (!response.data || response.data.length === 0) {
          setJobs([]);
          setFilteredJobs([]);
          toast.info("No jobs found");
          return;
        }

        const jobsWithDisplayFields = await Promise.all(
          response.data.map(async (job) => {
            try {
              // Fetch creator details for each job (EXACTLY LIKE ColHome)
              const creatorResponse = await api.get(`/collaborator/jobs/${job.id}`);
              const jobData = creatorResponse.data || {};
              const creatorData = jobData.creator || {};

              return {
                ...job,
                meta: `${formatBudgetType(job.budget_type)} - ${job.expertise_level || 'Intermediate'} - Est. Budget: ${formatBudget(job)} - Posted ${formatTimeAgo(job.created_at)}`,
                rateType: formatRateType(job.budget_type),
                rating: creatorData.rating || 0,
                reviews: creatorData.reviews || 0,
                country: creatorData.country,
                state: creatorData.state,
                country_code: creatorData.country_code,
                flag: getFlagForCountry(creatorData.country || job.location),
                full_description: job.description || "No description available",
                posted_at: job.created_at,
                skills_required: job.skills_required || []
              };
            } catch (error) {
              console.error(`Error fetching job ${job.id}:`, error);
              return {
                ...job,
                meta: `${formatBudgetType(job.budget_type)} - ${job.expertise_level || 'Intermediate'} - Est. Budget: ${formatBudget(job)} - Posted ${formatTimeAgo(job.created_at)}`,
                rateType: formatRateType(job.budget_type),
                rating: 0,
                reviews: 0,
                country: null,
                state: null,
                country_code: null,
                flag: USAFlag,
                full_description: job.description || "No description available",
                posted_at: job.created_at,
                skills_required: job.skills_required || []
              };
            }
          })
        );

        setJobs(jobsWithDisplayFields);
        const sortedJobs = sortJobs(jobsWithDisplayFields, sortOption);
        setFilteredJobs(sortedJobs);
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Search failed");
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  // Apply filters whenever filters or sort option changes
  useEffect(() => {
    if (jobs.length > 0) {
      applyFiltersAndSort();
    }
  }, [filters, sortOption, jobs]);

  // Load saved jobs
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

  // Handle save/unsave job
  const handleSaveJob = async (jobId, e) => {
    e.stopPropagation();
    
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

  // Handle like job (local only)
  const handleLikeJob = (jobId, e) => {
    e.stopPropagation();
    
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

  // Handle job click to navigate to ux.jsx and track view
  const handleJobClick = (jobId) => {
    handleTrackView(jobId);
    navigate('/ux', { state: { jobId } });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search button click
  const handleSearch = () => {
    // Search is triggered by useEffect
  };

  // Handle project type filter change
  const handleProjectTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      projectTypes: {
        ...prev.projectTypes,
        [type]: !prev.projectTypes[type]
      }
    }));
  };

  // Handle fixed price range change
  const handleFixedPriceChange = (e) => {
    setFilters(prev => ({
      ...prev,
      fixedPriceRange: parseInt(e.target.value)
    }));
  };

  // Handle hourly price range change
  const handleHourlyPriceChange = (e) => {
    setFilters(prev => ({
      ...prev,
      hourlyPriceRange: parseInt(e.target.value)
    }));
  };

  // Handle skill selection
  const handleSkillChange = (skill, checked) => {
    setFilters(prev => {
      const newSkills = new Set(prev.selectedSkills);
      if (checked) {
        newSkills.add(skill);
      } else {
        newSkills.delete(skill);
      }
      return {
        ...prev,
        selectedSkills: newSkills
      };
    });
  };

  // Handle location change
  const handleLocationChange = (e) => {
    setFilters(prev => ({
      ...prev,
      location: e.target.value
    }));
  };

  // Handle language change
  const handleLanguageChange = (language, checked) => {
    setFilters(prev => {
      const newLanguages = new Set(prev.languages);
      if (checked) {
        newLanguages.add(language);
      } else {
        newLanguages.delete(language);
      }
      return {
        ...prev,
        languages: newLanguages
      };
    });
  };

  // Handle sort option change
  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortDropdown(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      projectTypes: {
        fixed: false,
        hourly: false
      },
      fixedPriceRange: 1000,
      hourlyPriceRange: 100,
      selectedSkills: new Set(),
      location: "",
      languages: new Set()
    });
    setFilteredJobs(sortJobs(jobs, sortOption));
  };

  return (
    <div className="w-full min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      
      <div className="absolute top-0 left-0 w-full z-50">
        <ColHeader />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section
        className="relative w-full h-[420px]"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-28">
          {/* SEARCH BAR */}
          <div className="flex items-center bg-white shadow-lg mb-2 mt-6 rounded-lg overflow-hidden">
            <input
              placeholder="Search Jobs"
              value={searchQuery}
              onChange={handleSearchChange}
              className="
                flex-1
                px-4 sm:px-6
                py-2.5 sm:py-4
                text-[13px] sm:text-sm
                text-black
                placeholder-gray-400
                outline-none
                rounded-l-lg
              "
            />

            <button
              onClick={handleSearch}
              className="
                px-4 sm:px-8
                py-2.5 sm:py-4
                text-[13px] sm:text-sm
                font-medium
                text-white
                flex
                items-center
                justify-center
                gap-1 sm:gap-2
                rounded-r-lg
                bg-gradient-to-r
                from-[#381763]
                to-[#722FC9]
                shrink-0
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>

          {/* TOP RESULTS + SORT */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 px-4 lg:px-0">
            <div className="hidden lg:block lg:w-[320px]" />

            <div className="flex-1 flex flex-row items-center justify-between w-full lg:pl-8 mt-8 lg:mt-16">
              <div className="text-[14px] lg:text-[15px] text-white font-medium">
                Top results 
                <span className="opacity-70 font-normal ml-2">
                  Showing {filteredJobs.length} of {jobs.length} results
                </span>
              </div>

              <div className="flex items-center gap-2 lg:gap-3 relative">
                <span className="hidden sm:inline-block text-sm text-white font-medium">
                  Sort by –
                </span>

                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="
                    flex
                    items-center
                    gap-2
                    px-4
                    lg:px-5
                    py-1.5
                    lg:py-2
                    text-[13px]
                    lg:text-sm
                    font-semibold
                    text-white
                    bg-transparent
                    rounded-full
                    ring-1
                    ring-white/60
                    hover:bg-white/10
                    transition
                  "
                >
                  <span>{sortOptions.find(opt => opt.value === sortOption)?.label || 'Latest'}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Sort Dropdown */}
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl z-50 py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSortChange(option.value)}
                        className={`
                          w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition
                          ${sortOption === option.value ? 'text-purple-600 font-semibold' : 'text-gray-700'}
                        `}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHITE BACKGROUND SECTION ================= */}
      <section className="relative bg-white pt-20 pb-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-6 lg:-mt-60">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ================= LEFT FILTER ================= */}
            <div className="w-full lg:w-[280px] shrink-0">
              <div className="w-full lg:w-[320px] px-4 lg:px-0">
                <div className="flex items-center justify-between">
                  <p
                    className="
                      text-[13px]
                      lg:text-sm
                      font-semibold
                      text-white
                      mb-3 lg:mb-4
                      cursor-pointer
                      hover:underline
                      transition-all
                      inline-block
                    "
                  >
                    Advanced Search
                  </p>
                  {(filters.projectTypes.fixed || filters.projectTypes.hourly || 
                    filters.selectedSkills.size > 0 || filters.location || 
                    filters.languages.size > 0) && (
                    <button
                      onClick={clearFilters}
                      className="text-[12px] text-white/80 hover:text-white underline mb-3 lg:mb-4"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg text-sm hidden lg:block" />

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-5 lg:p-6
                  shadow-lg
                  text-sm
                  -mt-45 sm:-mt-6 lg:-mt-10
                  min-h-[600px] lg:min-h-[900px]
                  flex
                  flex-col
                "
              >
                <h3 className="font-semibold text-lg mb-5 lg:mb-6">
                  Filters
                </h3>

                {/* ================= PROJECT TYPE ================= */}
                <div className="mb-7 lg:mb-8">
                  <p className="font-medium mb-4">Project type</p>

                  <label className="flex items-center gap-3 mb-4">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-blue-600"
                      checked={filters.projectTypes.fixed}
                      onChange={() => handleProjectTypeChange('fixed')}
                    />
                    Fixed Price
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-blue-600"
                      checked={filters.projectTypes.hourly}
                      onChange={() => handleProjectTypeChange('hourly')}
                    />
                    Hourly Rate
                  </label>
                </div>

                {/* ================= FIXED PRICE ================= */}
                <div className="mb-7 lg:mb-8">
                  <p className="font-medium mb-2">Fixed price (max ${filters.fixedPriceRange}k)</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>$0</span>
                    <span>${filters.fixedPriceRange}k</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={filters.fixedPriceRange}
                    onChange={handleFixedPriceChange}
                    className="w-full accent-blue-600" 
                  />
                </div>

                {/* ================= HOURLY PRICE ================= */}
                <div className="mb-7 lg:mb-8">
                  <p className="font-medium mb-2">Hourly price (max ${filters.hourlyPriceRange})</p>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>$0</span>
                    <span>${filters.hourlyPriceRange}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1000" 
                    value={filters.hourlyPriceRange}
                    onChange={handleHourlyPriceChange}
                    className="w-full accent-blue-600" 
                  />
                </div>

                {/* ================= SKILLS ================= */}
                <div className="mb-7 lg:mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium">Skills</p>
                    <span className="text-blue-600 text-sm cursor-pointer">
                      View All
                    </span>
                  </div>

                  <div className="mb-4">
                    <input
                      placeholder="Search"
                      className="
                        w-full
                        bg-white
                        rounded-xl
                        px-4
                        py-2
                        text-sm
                        outline-none
                        ring-2
                        ring-black
                        ring-offset-2
                        ring-offset-white
                      "
                    />
                  </div>

                  {skillOptions.map((skill) => (
                    <label
                      key={skill}
                      className="flex items-center gap-3 mb-3"
                    >
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-blue-600"
                        checked={filters.selectedSkills.has(skill)}
                        onChange={(e) => handleSkillChange(skill, e.target.checked)}
                      />
                      {skill}
                    </label>
                  ))}
                </div>

                {/* ================= PROJECT LOCATION ================= */}
                <div className="mb-7 lg:mb-8">
                  <p className="font-semibold mb-2 tracking-wide text-[13px]">
                    Project location
                  </p>
                  <div className="w-full h-[44px] rounded-xl ring-1 ring-black bg-white flex items-center px-4">
                    <input
                      className="w-full bg-transparent text-sm outline-none"
                      placeholder="Enter location"
                      value={filters.location}
                      onChange={handleLocationChange}
                    />
                  </div>
                </div>

                {/* ================= LANGUAGES ================= */}
                <div>
                  <p className="font-medium mb-2">Languages</p>
                  <div className="w-full h-[44px] rounded-xl ring-1 ring-black bg-white flex items-center px-4 mb-4">
                    <input
                      placeholder="Search"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-blue-600"
                      checked={filters.languages.has('UI design')}
                      onChange={(e) => handleLanguageChange('UI design', e.target.checked)}
                    />
                    UI design
                  </label>
                </div>
              </div>
            </div>

            {/* ================= RIGHT RESULTS CARD ================= */}
            <div className="flex-1 mt-12">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Jobs Found</h3>
                    <p className="text-gray-500">
                      Try adjusting your filters or search criteria.
                    </p>
                  </div>
                ) : (
                  filteredJobs.map((job, index) => (
                    <div
                      key={job.id || index}
                      className={`relative pb-6 ${index !== filteredJobs.length - 1 ? 'border-b border-gray-200 mb-6' : ''} cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4 -m-4`}
                      onClick={() => handleJobClick(job.id)}
                    >
                      <div className="flex justify-between gap-6">
                        
                        {/* ================= LEFT CONTENT ================= */}
                        <div className="pr-[160px] flex flex-col gap-3 min-h-[140px]">
                          <div></div>

                          {/* TITLE */}
                          <h3 className="font-semibold text-[17px] mb-1 pr-20 sm:pr-0">
                            {job.title || "UI / UX Designer"}
                          </h3>

                          {/* META */}
                          <p className="text-[14px] text-gray-500 mb-1 leading-snug">
                            {job.meta}
                          </p>

                          {/* DESCRIPTION */}
                          <p className="text-[16px] text-gray-600 leading-relaxed mb-3">
                            {job.full_description?.length > 200 
                              ? `${job.full_description.substring(0, 200)}...` 
                              : job.full_description}
                            <span className="text-[#6d28d9] font-medium cursor-pointer ml-1">
                              more
                            </span>
                          </p>

                          {/* ================= TAGLINE - EXACTLY LIKE ColHome ================= */}
                          <div className="mt-1 flex items-center gap-x-4 gap-y-2 text-[14px] text-gray-600 flex-wrap">
                            <span className="text-[#6d28d9] font-semibold">
                              {job.rateType}
                            </span>

                            {/* ⭐ Rating - EXACT SAME AS ColHome */}
                            <span className="text-[#6d28d9]">
                              {"★".repeat(Math.floor(job.rating || 0))}
                              {"☆".repeat(5 - Math.floor(job.rating || 0))}
                            </span>

                            <span>
                              {job.rating || 0}/5 ({job.reviews || 0} {job.reviews === 1 ? 'review' : 'reviews'})
                            </span>

                            {/* 📍 Location - EXACT SAME AS ColHome */}
                            <div className="flex items-center gap-2">
                              {job.country_code ? (
                                <CountryFlag
                                  countryCode={job.country_code}
                                  country={job.country}
                                />
                              ) : (
                                <img
                                  src={flagIcon}
                                  alt="Location"
                                  className="w-[18px] h-[12px] rounded-[4px] object-cover"
                                />
                              )}
                              <span className="text-gray-500">
                                {[job.state, job.country].filter(Boolean).join(", ") || "Remote"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* ================= RIGHT ICONS ================= */}
                        <div className="absolute top-4 right-4 flex items-center space-x-3">
                          {/* Heart Icon - Save Job */}
                          <div 
                            className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm cursor-pointer transition-all duration-300 hover:scale-110 relative group"
                            style={{
                              backgroundColor: savedJobs.has(job.id) ? '#FF5252' : '#E8E8E8',
                              border: savedJobs.has(job.id) ? '3px solid #FF5252' : '3px solid #808080'
                            }}
                            onClick={(e) => handleSaveJob(job.id, e)}
                          >
                            <svg 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill={savedJobs.has(job.id) ? "white" : "#FF5252"}
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {savedJobs.has(job.id) ? "Remove from saved" : "Save job"}
                            </div>
                          </div>

                          {/* Like Icon */}
                          <div 
                            className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm cursor-pointer transition-all duration-300 hover:scale-110 relative group"
                            style={{
                              backgroundColor: likedJobs.has(job.id) ? '#722FC9' : 'white',
                              border: likedJobs.has(job.id) ? '3px solid #722FC9' : '3px solid #808080'
                            }}
                            onClick={(e) => handleLikeJob(job.id, e)}
                          >
                            <svg 
                              width="22" 
                              height="22" 
                              viewBox="0 0 24 24" 
                              fill={likedJobs.has(job.id) ? "white" : "none"}
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path 
                                d="M7 10V20 M7 10L10.5 3C11.5 3 12.5 4 12.5 6V9H19.5 C21 9 21.5 10.5 21.5 11.5 L20 18.5C19.5 20 18.5 21 17 21H7 M7 10H4C3 10 2 11 2 12V18 C2 19 3 20 4 20H7"
                                stroke={likedJobs.has(job.id) ? "white" : "#808080"}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                              {likedJobs.has(job.id) ? "Unlike" : "Like"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* ================= LOAD MORE ================= */}
                {filteredJobs.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => toast.info('Loading more jobs...')}
                      className="
                        px-8
                        py-2
                        text-sm
                        font-semibold
                        text-[#6d28d9]
                        bg-white
                        rounded-lg
                        ring-1
                        ring-[#6d28d9]
                        hover:bg-[#6d28d9]/10
                        transition
                      "
                    >
                      Load more
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="-mx-4">
        <Footer />
      </div>
    </div>
  );
};

export default CollabrationFilter;