import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Bell from "../assets/AfterSign/Bell.png";
import Msg from "../assets/AfterSign/Msg.png";
import Profile from "../assets/Landing/Card3.png";
import NotiProfile from "../assets/AfterSign/profile.png";
import api from "../utils/axiosConfig";


const Header = () => {
  const [activeTab, setActiveTab] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null); // null, 'My Project' etc
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });

  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeNotifyTab, setActiveNotifyTab] = useState("unread");
  const [readIds, setReadIds] = useState(new Set());


  // Profile & Status Menu States
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [status, setStatus] = useState("Available");

  const location = useLocation();
  const navigate = useNavigate();

  const dropdownRef = useRef();
  const navItemRefs = useRef({});
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);


  const navItems = [
    { label: "Home", path: "/home" },
    { label: "Find Collaborator", path: "/finder" },
    { label: "My Project", path: "/project", hasDropdown: true },
    { label: "Financials", path: "/choose-payment" },
  ];

  const projectDropdownItems = [
    { label: "All Contracts", path: "/activecontracts" },
    { label: "Proposal", path: "/proposalspage" },
    { label: "Hired freelancers", path: "/hiredfreelancers" },
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("readNotifications") || "[]");
    setReadIds(new Set(saved));
  }, []);


  useEffect(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    if (currentItem) {
      setActiveTab(currentItem.label);
    } else {
      const isProjectChild = projectDropdownItems.some(item => item.path === location.pathname);
      if (isProjectChild) {
        setActiveTab("My Project");
      }
    }
  }, [location.pathname]);

  // Close nav dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close Notifications when clicking outside
  useEffect(() => {
    const handleClickOutsideNotification = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideNotification);
    return () => document.removeEventListener("mousedown", handleClickOutsideNotification);
  }, []);

  useEffect(() => {
    if (!showNotifications) return;

    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const res = await api.get("/api/notifications/");

        if (Array.isArray(res.data)) {
          const saved = JSON.parse(localStorage.getItem("readNotifications") || "[]");
          const savedSet = new Set(saved);

          const updated = res.data.map(n => ({
            ...n,
            is_read: savedSet.has(n.id)
          }));

          setNotifications(updated);
        } else {
          setNotifications([]);
        }

      } catch (err) {
        console.error("Notification fetch error:", err);
        setNotifications([]);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [showNotifications]);


  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get("/api/notifications/");

        if (Array.isArray(res.data)) {

          const saved = JSON.parse(localStorage.getItem("readNotifications") || "[]");
          const savedSet = new Set(saved);

          const updated = res.data.map(n => ({
            ...n,
            is_read: savedSet.has(n.id)
          }));

          setNotifications(updated);
        }
      } catch (err) {
        console.error("Auto refresh failed");
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);



  const markAsRead = (id) => {
    setReadIds(prev => {
      const updated = new Set(prev);
      updated.add(id);

      localStorage.setItem(
        "readNotifications",
        JSON.stringify([...updated])
      );

      return updated;
    });

    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );
  };





  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((p) => !p);
    setIsStatusMenuOpen(false);
    setIsMobileMenuOpen(false); // Close mobile menu if profile opens
  };

  const toggleStatusMenu = (e) => {
    e.stopPropagation(); // Prevent closing parent menu if nested
    setIsStatusMenuOpen((p) => !p);
  };

  const changeStatus = (newStatus) => {
    setStatus(newStatus);
    setIsStatusMenuOpen(false);
  };

  // Toggle mobile drop down (accordion style)
  const toggleMobileDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const hideHeaderPaths = ['/collaborator-profile', '/creator-profile', '/signup', '/my-jobs', '/all-contacts', '/ux', '/Uploadux', '/Proposal', '/message', '/collabration', '/collabration-filter', '/collabration-recent', '/collabration-saved', '/'];
  if (hideHeaderPaths.includes(location.pathname)) {
    return null;
  }

  // Handle navigation item click (Desktop)
  const handleNavItemClick = (item, e) => {
    setActiveTab(item.label);

    if (item.hasDropdown) {
      e.preventDefault();
      e.stopPropagation();

      const navItem = navItemRefs.current[item.label];
      if (navItem) {
        const rect = navItem.getBoundingClientRect();
        const left = rect.left + (rect.width / 2);
        const top = rect.bottom + window.scrollY;
        setDropdownPosition({ left, top });
      }

      setOpenDropdown(openDropdown === item.label ? null : item.label);
    } else {
      navigate(item.path);
      setOpenDropdown(null);
    }
  };

  // Handle Dropdown Arrow Click (Desktop)
  const handleDropdownArrowClick = (item, e) => {
    e.stopPropagation();

    if (item.hasDropdown) {
      const navItem = navItemRefs.current[item.label];
      if (navItem) {
        const rect = navItem.getBoundingClientRect();
        const left = rect.left + (rect.width / 2);
        const top = rect.bottom + window.scrollY;
        setDropdownPosition({ left, top });
      }

      setOpenDropdown(openDropdown === item.label ? null : item.label);
    }
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const setNavItemRef = (label, element) => {
    if (element) {
      navItemRefs.current[label] = element;
    }
  };



  return (
    <header className="w-full max-w-[1251px] h-[72px] mx-auto mt-6 flex items-center justify-between px-4 md:px-8 relative z-50">

      {/* 0. MOBILE HAMBURGER ICON (Left) */}
      <div className="md:hidden flex items-center justify-start flex-1">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-[#030303] focus:outline-none"
        >
          {isMobileMenuOpen ? (
            // Close Icon
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            // Hamburger Icon
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Left Logo (Centered on Mobile, Left on Desktop) */}
      <div className="flex-1 md:flex-none flex justify-center md:justify-start">
        <h1 className="font-bold text-[36px] md:text-[50px] leading-[100%] trochut-font bg-gradient-to-l from-[#51218F] to-[#030303] bg-clip-text text-[#030303] cursor-pointer"
        >
          Talenta
        </h1>
      </div>

      {/* Middle Navbar (Desktop Only) */}
      <nav className="hidden md:flex w-[609px] h-[52px] items-center justify-between rounded-[50px] px-5 bg-#FFFFFF30 backdrop-blur-sm relative z-50">

        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative"
            ref={(el) => setNavItemRef(item.label, el)}
          >
            <div className="flex items-center">
              <button
                onClick={(e) => handleNavItemClick(item, e)}
                className={`
                  relative text-[20px] leading-[100%] text-center poppins-font transition-all duration-300
                  py-3 px-1 z-10
                  ${activeTab === item.label
                    ? "text-[#51218F] font-medium"
                    : "text-white"
                  }
                  hover:text-[#51218F]
                `}
              >
                {item.label}
                {activeTab === item.label && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#51218F]"></div>
                )}
              </button>

              {item.hasDropdown && (
                <button
                  onClick={(e) => handleDropdownArrowClick(item, e)}
                  className="ml-1 focus:outline-none"
                >
                  <svg
                    className={`transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''} ${activeTab === item.label ? 'text-[#51218F]' : 'text-white'} hover:text-[#51218F]`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </nav>

      {/* Right Profile Section */}
      <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
        {/* Message and Notification Icons Container */}
        <div className="w-auto md:w-[80px] h-[44px] flex items-center justify-between p-[10px] gap-2">
          {/* Message Icon */}
          <div className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity">
            <img
              src={Msg}
              alt="Messages"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Notification Bell Icon */}
          <div
            className="w-6 h-6 cursor-pointer hover:opacity-80 transition-opacity relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <img
              src={Bell}
              alt="Notifications"
              className="w-full h-full object-contain"
            />

            {notifications.filter(n => !n.is_read).length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5">
                {notifications.filter(n => !n.is_read).length}
              </span>
            )}
          </div>
        </div>

        {/* Profile and Name Container - CLICKABLE */}
        <div className="w-auto md:w-[120px] h-[64px] flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
          {/* Name (Hidden on small mobile) */}
          <div className="text-white font-poppins font-normal text-[20px] leading-[100%] hidden sm:block">
            Julie
          </div>

          {/* Profile Image */}
          <div onClick={toggleProfileMenu}
            className="w-10 h-10 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white">
            <img
              src={Profile}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      {
        isMobileMenuOpen && (
          <div
            className="absolute top-[80px] left-4 w-[170px] rounded-[16px] p-3 flex flex-col gap-2 z-40 shadow-2xl md:hidden"
            style={{
              background: "linear-gradient(180deg, rgba(81, 33, 143, 0.95) 0%, #020202 100%)",
              backdropFilter: "blur(10px)"
            }}
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.label;
              const isExpanded = openDropdown === item.label;

              return (
                <div key={item.label} className="relative group">
                  {/* Main Item */}
                  {item.hasDropdown ? (
                    <div
                      onClick={() => toggleMobileDropdown(item.label)}
                      className={`
                                    flex items-center justify-between text-[18px] outfit font-medium cursor-pointer px-3 py-2 rounded-[8px] transition-all
                                    ${isExpanded ? "bg-white text-black shadow-md" : "text-white hover:bg-white/10"}
                                `}
                    >
                      <span>{item.label}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90 text-[#51218F]" : "text-white"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        navigate(item.path);
                        setIsMobileMenuOpen(false);
                        setActiveTab(item.label);
                      }}
                      className={`
                                    flex items-center justify-between text-[18px] outfit font-medium cursor-pointer px-3 py-2 rounded-[8px] transition-all
                                    ${isActive ? "bg-white/20 text-white" : "text-white hover:bg-white/10"}
                                `}
                    >
                      <span>{item.label}</span>
                    </div>
                  )}

                  {/* Sub Items (Popping out to the RIGHT) for My Project */}
                  {item.hasDropdown && isExpanded && item.label === "My Project" && (
                    <div
                      className="absolute top-0 left-[115%] w-[160px] rounded-[16px] p-3 flex flex-col gap-2 z-50 shadow-2xl"
                      style={{
                        background: "linear-gradient(180deg, rgba(81, 33, 143, 0.95) 0%, #020202 100%)",
                        backdropFilter: "blur(10px)"
                      }}
                    >
                      {projectDropdownItems.map((subItem) => (
                        <div
                          key={subItem.label}
                          onClick={() => handleDropdownItemClick(subItem.path)}
                          className="text-[16px] text-white/90 hover:text-white hover:bg-white/10 cursor-pointer py-1.5 px-3 rounded-[6px] transition-colors"
                        >
                          {subItem.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      }

      {/* ================= PROFILE DROPDOWN ================= */}
      {
        isProfileMenuOpen && (
          <div
            className="
            absolute
            right-4
            md:right-20
            top-[74px] 
            w-[150px]
            rounded-[12px]
            overflow-hidden
            z-[60]
            pt-4
            pb-2
          "
            style={{
              background: "linear-gradient(180deg, #7242B8 0%, #030016 100%)",
            }}
          >
            {/* Profile */}
            <button onClick={() => navigate("/creator-edit-profile")}
              type="button"
              className="
              w-full
              px-[20px] md:px-[40px]
              py-2
              text-left
              text-white
              text-[16px]
              outfit
              font-normal
              cursor-pointer
              flex
              items-center
              hover:bg-white
              hover:text-black
              transition-colors
            "
            >
              Profile
            </button>

            {/* AVAILABLE ROW → opens status dropdown */}
            <button
              type="button"
              onClick={toggleStatusMenu}
              className="
              w-full
              px-2
              py-2
              text-[16px]
              outfit
              font-normal
              cursor-pointer
              flex
              items-center
              justify-between
              gap-3
              text-white
              bg-transparent
              hover:bg-white
              hover:text-black
              transition-colors
            "
            >
              <span className="flex items-center gap-3">
                {status === "Available" ? (
                  <span className="w-[18px] h-[18px] rounded-full bg-[#00D27F] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      className="w-3 h-3"
                      fill="none"
                    >
                      <path
                        d="M4 8.2L6.4 10.6L12 5"
                        stroke="black"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : (
                  <span className="w-[18px] h-[18px] rounded-full bg-[#E09E9E] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      className="w-3 h-3"
                      fill="none"
                    >
                      <circle
                        cx="8"
                        cy="8"
                        r="5.5"
                        stroke="black"
                        strokeWidth="1.4"
                      />
                      <path
                        d="M8 4.5V8L10.5 9.5"
                        stroke="black"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
                <span>{status}</span>
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                className="w-3 h-3"
                fill="none"
              >
                <path
                  d="M6 3L10 8L6 13"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Log Out */}
            <button onClick={() => navigate("/")}
              type="button"
              className="
              w-full
              px-[20px] md:px-[40px]
              py-2
              text-left
              text-white
              text-[16px]
              outfit
              font-normal
              cursor-pointer
              flex
              items-center
              hover:bg-white
              hover:text-black
              transition-colors
            "
            >
              Log Out
            </button>
          </div>
        )
      }

      {/* ================= STATUS DROPDOWN ================= */}
      {
        isStatusMenuOpen && (
          <div
            className="
            absolute
            top-[150px]
            right-4
            md:right-[-40px]
            w-[114px]
            rounded-[4px]
            py-1
            flex
            flex-col
            gap-2
            z-[70]
          "
            style={{
              background:
                "linear-gradient(180deg, #7242B8 0%, #030016 100%)",
            }}
          >
            <button
              type="button"
              onClick={() => changeStatus("Available")}
              className="
              w-full
              flex
              items-center
              gap-3
              text-left
              text-white
              text-[16px]
              outfit
              font-normal
              cursor-pointer
              hover:bg-white
              hover:text-black
              rounded-[2px]
              px-2
              py-1.5
              transition-colors
            "
            >
              <span className="w-[18px] h-[18px] rounded-full bg-[#00D27F] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  className="w-3 h-3"
                  fill="none"
                >
                  <path
                    d="M4 8.2L6.4 10.6L12 5"
                    stroke="black"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>Available</span>
            </button>

            <button
              type="button"
              onClick={() => changeStatus("Away")}
              className="
              w-full
              flex
              items-center
              gap-3
              text-left
              text-white
              text-[16px]
              outfit
              font-normal
              cursor-pointer
              hover:bg-white
              hover:text-black
              rounded-[2px]
              px-2
              py-1.5
              transition-colors
            "
            >
              <span className="w-[18px] h-[18px] rounded-full bg-[#E09E9E] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  className="w-3 h-3"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="5.5"
                    stroke="black"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M8 4.5V8L10.5 9.5"
                    stroke="black"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>Away</span>
            </button>
          </div>
        )
      }

      {/* ================= NOTIFICATION POPUP ================= */}
      {
        showNotifications && (
          <div
            ref={notificationRef}
            className="absolute bg-white shadow-2xl z-[9999] flex flex-col right-2 md:right-0 w-[60vw] max-w-[550px] md:w-[500px] rounded-[8px] overflow-hidden"
            style={{
              top: "74px",
              minHeight: "460px",
            }}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNotifyTab("unread")}
                  className="px-3 py-1 text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Unread</span>
                  <span className="text-xs">
                    {Array.isArray(notifications)
                      ? notifications.filter(n => !n.is_read).length
                      : 0}

                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveNotifyTab("read")}
                  className="px-4 py-1 text-sm cursor-pointer"
                >
                  Readed
                </button>
              </div>

              <button
                onClick={() => setShowNotifications(false)}
                className="w-8 h-8 flex items-center justify-center text-white text-lg font-bold cursor-pointer bg-[#51218F] rounded-full"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-1 px-2 pb-2 overflow-y-auto max-h-[calc(100vh-110px)]">
              {loadingNotifications ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Loading...
                </div>
              ) : (
                Array.isArray(notifications) &&
                notifications
                  .filter(item =>
                    activeNotifyTab === "unread"
                      ? !item.is_read
                      : item.is_read
                  )
                  .map(item => (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className="flex items-start gap-2 px-2 py-1.5 pr-4 border-b relative cursor-pointer hover:bg-gray-50"
                    >

                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs bg-[#51218F80]">
                        {item.title?.charAt(0)}
                      </div>

                      <div className="flex-1">
                        <p className="text-[13px] font-medium text-gray-900">
                          {item.title}
                        </p>

                        <p className="text-[11px] text-gray-500">
                          {item.time ? new Date(item.time).toLocaleString() : ""}
                        </p>
                      </div>

                      {!item.is_read && (
                        <span className="w-1.5 h-1.5 bg-[#51218F] rounded-full absolute right-3 top-4"></span>
                      )}
                    </div>
                  ))
              )}

            </div>
          </div>
        )
      }

      {/* My Project Dropdown (Desktop) - Fixed positioning */}
      {
        openDropdown === 'My Project' && !isMobileMenuOpen && (
          <div
            ref={dropdownRef}
            className="fixed rounded-[8px] z-[9999] shadow-2xl mt-2 hidden md:block"
            style={{
              background: 'linear-gradient(180deg, rgba(81, 33, 143, 0.95) 0%, #020202 100%)',
              width: '188px',
              left: `${dropdownPosition.left - 124}px`,
              top: `${dropdownPosition.top}px`,
            }}
          >
            <div className="pt-6 pb-6 px-[15px] flex flex-col gap-[11px] h-full">
              {projectDropdownItems.map((dropdownItem) => {
                const isActive = location.pathname === dropdownItem.path;
                return (
                  <button
                    key={dropdownItem.label}
                    onClick={() => handleDropdownItemClick(dropdownItem.path)}
                    className={`
                    w-[158px] px-2 py-1 rounded
                    font-outfit font-normal text-[18px] leading-[100%] text-left 
                    transition-all duration-200
                    ${isActive
                        ? "bg-white text-black"
                        : "text-white hover:bg-white hover:text-black"
                      }
                  `}
                  >
                    {dropdownItem.label}
                  </button>
                );
              })}
            </div>
          </div>
        )
      }

    </header >
  );
};

export default Header;