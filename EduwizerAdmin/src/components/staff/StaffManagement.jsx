import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getStaff,
  getAttendanceLogs,
  addStaff,
  updateStaff,
  deleteStaff,
  checkinAttendance,
  checkoutAttendance,
} from "../../Services/api";

// ----------------------------------------------------
// Mock Data Templates & Constants
// ----------------------------------------------------

const DEPARTMENTS = [
  "Academics",
  // "Admissions",
  "Human Resources",
  "Administration",
  "IT Support",
  "Finance",
  "Other"
];

// ----------------------------------------------------
// Icons Helper
// ----------------------------------------------------

const IconUsers = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const IconClock = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconCalendar = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const IconAnalytics = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const IconEye = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const IconEdit = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const IconTrash = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const IconPlus = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconSearch = () => (
  <svg
    className="w-4 h-4 text-slate-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const IconFilter = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const IconFingerprint = ({ className = "w-8 h-8" }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 11c0-1.105.895-2 2-2s2 .895 2 2m-4 0v4m0-4c0-2.21 1.79-4 4-4s4 1.79 4 4v4m-8-4c0-3.314 2.686-6 6-6s6 2.686 6 6v4m-12 0c0 4.418 3.582 8 8 8s8-3.582 8-8m-16 0v2m16-2v2"
    />
  </svg>
);

// const IconTrendUp = () => (
//   <svg
//     className="w-4 h-4 text-emerald-450"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//     strokeWidth="2"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       d="M13 7h8m0 0v8m0-8l-9 9-4-4-6 6"
//     />
//   </svg>
// );

// ----------------------------------------------------
// Main Component
// ----------------------------------------------------

export default function StaffManagement({ activeTab = "directory" }) {
  const navigate = useNavigate();

  // Core Persistent State
  const [staffList, setStaffList] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);

  // Ticking Clock State
  const [currentTime, setCurrentTime] = useState(new Date());

  // Search & Filter State (Directory)
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // CRUD Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null); // For view profile / edit / delete

  // CRUD Forms State
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "",
    department: "Academics",
    email: "",
    phone: "",
    status: "Active",
    joinDate: new Date().toISOString().split("T")[0],
  });

  // Check-In Picker State
  const [checkinStaffId, setCheckinStaffId] = useState("");
  const [checkinSuccessMsg, setCheckinSuccessMsg] = useState(null);

  // Yearly logs viewer state
  const [logsStaffId, setLogsStaffId] = useState("");
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [expandedMonth, setExpandedMonth] = useState(new Date().getMonth()); // Default to current month index

  // ----------------------------------------------------
  // Initial data load from backend API
  // ----------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const staffRes = await getStaff();
        const staffData =
          staffRes?.data?.success === 1
            ? staffRes.data.data.map((staff) => ({
              ...staff,
              id: staff._id || staff.id,
            }))
            : [];

        setStaffList(staffData);
        if (staffData.length > 0) {
          setCheckinStaffId(staffData[0].id);
          setLogsStaffId(staffData[0].id);
        }

        const attendanceRes = await getAttendanceLogs();
        const attendanceData =
          attendanceRes?.data?.success === 1 ? attendanceRes.data.data : [];
        setAttendanceLogs(attendanceData);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load staff or attendance data.");
      }
    };
    loadData();
  }, []);

  // ----------------------------------------------------
  // Digital Clock Loop
  // ----------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ----------------------------------------------------
  // Helper calculations (Memoized Stats)
  // ----------------------------------------------------
  const statsSummary = useMemo(() => {
    if (staffList.length === 0)
      return { total: 0, checkedInToday: 0, attendanceRate: "0%" };

    const total = staffList.length;
    const todayStr = new Date().toISOString().split("T")[0];

    // Count checked-in today
    const checkedInToday = attendanceLogs.filter(
      (log) =>
        log.date === todayStr &&
        (log.status === "Present" || log.status === "Late"),
    ).length;

    // Calculate average attendance rate
    const totalRecords = attendanceLogs.length;
    const presentRecords = attendanceLogs.filter(
      (log) => log.status === "Present" || log.status === "Late",
    ).length;

    const rateVal =
      totalRecords > 0
        ? ((presentRecords / totalRecords) * 100).toFixed(1)
        : "0.0";

    return {
      total,
      checkedInToday,
      attendanceRate: `${rateVal}%`,
    };
  }, [staffList, attendanceLogs]);

  // ----------------------------------------------------
  // CRUD Actions
  // ----------------------------------------------------
  const handleOpenAddModal = () => {
    setStaffForm({
      name: "",
      role: "",
      department: "Academics",
      email: "",
      phone: "",
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    });
    setIsAddModalOpen(true);
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    if (
      !staffForm.name ||
      !staffForm.role ||
      !staffForm.email ||
      !staffForm.phone
    ) {
      return toast.error("Please fill in all required fields.");
    }

    const colors = [
      "bg-indigo-650",
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-amber-600",
      "bg-rose-600",
      "bg-purple-600",
      "bg-teal-600",
      "bg-cyan-600",
    ];
    const avatarColor = colors[Math.floor(Math.random() * colors.length)];

    try {
      const body = {
        ...staffForm,
        avatarColor,
      };
      const response = await addStaff(body);
      if (response?.data?.success === 1) {
        const created = response.data.data;
        const newStaff = {
          ...created,
          id: created._id || created.id,
          avatarColor,
        };

        const updatedList = [...staffList, newStaff];
        setStaffList(updatedList);
        if (!checkinStaffId) setCheckinStaffId(newStaff.id);
        if (!logsStaffId) setLogsStaffId(newStaff.id);

        setIsAddModalOpen(false);
        toast.success(`${staffForm.name} added to directory!`);
      } else {
        toast.error(response?.data?.message || "Unable to add staff.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to add staff.");
    }
  };

  const handleOpenEditModal = (staff) => {
    setSelectedStaff(staff);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      department: staff.department,
      email: staff.email,
      phone: staff.phone,
      status: staff.status,
      joinDate: staff.joinDate,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    if (
      !staffForm.name ||
      !staffForm.role ||
      !staffForm.email ||
      !staffForm.phone
    ) {
      return toast.error("Please fill in all required fields.");
    }

    try {
      const response = await updateStaff({
        staffId: selectedStaff.id,
        ...staffForm,
      });
      if (response?.data?.success === 1) {
        const updatedList = staffList.map((s) => {
          if (s.id === selectedStaff.id) {
            return {
              ...s,
              name: staffForm.name,
              role: staffForm.role,
              department: staffForm.department,
              email: staffForm.email,
              phone: staffForm.phone,
              status: staffForm.status,
              joinDate: staffForm.joinDate,
            };
          }
          return s;
        });
        setStaffList(updatedList);
        setIsEditModalOpen(false);
        toast.success("Staff profile updated successfully!");
      } else {
        toast.error(response?.data?.message || "Unable to update staff.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to update staff.");
    }
  };

  const handleOpenDeleteModal = (staff) => {
    setSelectedStaff(staff);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteStaff = async () => {
    try {
      const response = await deleteStaff({ staffId: selectedStaff.id });
      if (response?.data?.success === 1) {
        const updatedList = staffList.filter((s) => s.id !== selectedStaff.id);
        setStaffList(updatedList);

        const updatedLogs = attendanceLogs.filter(
          (log) => log.staffId !== selectedStaff.id,
        );
        setAttendanceLogs(updatedLogs);

        setIsDeleteModalOpen(false);
        toast.success(`${selectedStaff.name} removed from directory.`);
      } else {
        toast.error(response?.data?.message || "Unable to remove staff.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to remove staff.");
    }
  };

  // ----------------------------------------------------
  // Attendance Check-in Engine
  // ----------------------------------------------------
  const selectedCheckinStaff = staffList.find((s) => s.id === checkinStaffId);
  const todayStr = currentTime.toISOString().split("T")[0];

  // Today's specific log for selected staff
  const todayLog = useMemo(() => {
    return attendanceLogs.find(
      (log) => log.staffId === checkinStaffId && log.date === todayStr,
    );
  }, [attendanceLogs, checkinStaffId, todayStr]);

  const handleCheckinCheckIn = async () => {
    if (!checkinStaffId) return toast.error("Please select a staff member.");

    const hour = currentTime.getHours();
    const min = currentTime.getMinutes();
    const checkInTimeStr = `${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}`;

    const isLate = hour > 8 || (hour === 8 && min >= 45);
    const status = isLate ? "Late" : "Present";

    const newLog = {
      id: `${checkinStaffId}_${todayStr}`,
      staffId: checkinStaffId,
      date: todayStr,
      checkIn: checkInTimeStr,
      checkOut: null,
      status,
    };

    try {
      const response = await checkinAttendance({
        staffId: checkinStaffId,
        date: todayStr,
        checkIn: checkInTimeStr,
        status,
      });
      if (response?.data?.success === 1) {
        const updatedLogs = [
          newLog,
          ...attendanceLogs.filter(
            (log) => !(log.staffId === checkinStaffId && log.date === todayStr),
          ),
        ];
        setAttendanceLogs(updatedLogs);
        setCheckinSuccessMsg({
          name: selectedCheckinStaff?.name || "Staff",
          type: "Check-In",
          time: currentTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
          }),
          status,
        });
        toast.success(
          `${selectedCheckinStaff?.name || "Staff"} checked in successfully!`,
        );
      } else {
        toast.error(response?.data?.message || "Unable to record check-in.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to record check-in.");
    }
  };

  const handleCheckinCheckOut = async () => {
    if (!checkinStaffId || !todayLog)
      return toast.error("Check-in record not found.");

    const hour = currentTime.getHours();
    const min = currentTime.getMinutes();
    const checkOutTimeStr = `${hour < 10 ? "0" + hour : hour}:${min < 10 ? "0" + min : min}`;

    try {
      const response = await checkoutAttendance({
        staffId: checkinStaffId,
        date: todayStr,
        checkOut: checkOutTimeStr,
      });
      if (response?.data?.success === 1) {
        const updatedLogs = attendanceLogs.map((log) => {
          if (log.staffId === checkinStaffId && log.date === todayStr) {
            return {
              ...log,
              checkOut: checkOutTimeStr,
            };
          }
          return log;
        });

        setAttendanceLogs(updatedLogs);
        setCheckinSuccessMsg({
          name: selectedCheckinStaff?.name || "Staff",
          type: "Check-Out",
          time: currentTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
          }),
          status: todayLog.status,
        });
        toast.success(
          `${selectedCheckinStaff?.name || "Staff"} checked out successfully!`,
        );
      } else {
        toast.error(response?.data?.message || "Unable to record check-out.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Unable to record check-out.");
    }
  };

  // Recent 5 activity logs in check-in panel
  const recentCheckinLogs = useMemo(() => {
    return attendanceLogs
      .filter((log) => log.date === todayStr)
      .slice(0, 5)
      .map((log) => {
        const staff = staffList.find((s) => s.id === log.staffId);
        return {
          ...log,
          staffName: staff ? staff.name : "Unknown Staff",
          role: staff ? staff.role : "",
          avatarColor: staff ? staff.avatarColor : "bg-slate-400",
        };
      });
  }, [attendanceLogs, staffList, todayStr]);

  // ----------------------------------------------------
  // Full Year logs Engine
  // ----------------------------------------------------
  const selectedLogsStaff = staffList.find((s) => s.id === logsStaffId);

  // Group all attendance logs for the selected staff by month and selected year
  const yearlyStats = useMemo(() => {
    if (!logsStaffId)
      return { present: 0, late: 0, absent: 0, leave: 0, rate: "0%", total: 0 };
    const staffLogs = attendanceLogs.filter((log) => {
      const logYear = new Date(log.date).getFullYear();
      return log.staffId === logsStaffId && logYear === Number(selectedYear);
    });

    const present = staffLogs.filter((l) => l.status === "Present").length;
    const late = staffLogs.filter((l) => l.status === "Late").length;
    const absent = staffLogs.filter((l) => l.status === "Absent").length;
    const leave = staffLogs.filter((l) => l.status === "On Leave").length;
    const total = present + late + absent;

    const rate =
      total > 0 ? (((present + late) / total) * 100).toFixed(1) + "%" : "0.0%";

    return { present, late, absent, leave, total, rate };
  }, [attendanceLogs, logsStaffId, selectedYear]);

  const monthlyGroupedLogs = useMemo(() => {
    if (!logsStaffId) return [];

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const staffLogs = attendanceLogs.filter((log) => {
      const logYear = new Date(log.date).getFullYear();
      return log.staffId === logsStaffId && logYear === Number(selectedYear);
    });

    return months.map((monthName, idx) => {
      // Filter logs for this month
      const monthLogs = staffLogs
        .filter((log) => {
          const logMonth = new Date(log.date).getMonth();
          return logMonth === idx;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest days first

      const present = monthLogs.filter((l) => l.status === "Present").length;
      const late = monthLogs.filter((l) => l.status === "Late").length;
      const absent = monthLogs.filter((l) => l.status === "Absent").length;
      const total = present + late + absent;
      const rate =
        total > 0 ? (((present + late) / total) * 100).toFixed(0) + "%" : "0%";

      return {
        monthName,
        monthIndex: idx,
        logs: monthLogs,
        summary: { present, late, absent, rate },
      };
    });
  }, [attendanceLogs, logsStaffId, selectedYear]);

  // ----------------------------------------------------
  // Analytics Calculations
  // ----------------------------------------------------
  const analyticsData = useMemo(() => {
    // 1. Avg Attendance Rate
    const total = attendanceLogs.filter((l) => l.status !== "On Leave").length;
    const present = attendanceLogs.filter(
      (l) => l.status === "Present" || l.status === "Late",
    ).length;
    const avgAttendance =
      total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

    // 2. Punctuality Rating
    const totalPresent = attendanceLogs.filter(
      (l) => l.status === "Present" || l.status === "Late",
    ).length;
    const onTime = attendanceLogs.filter((l) => l.status === "Present").length;
    const punctuality =
      totalPresent > 0 ? ((onTime / totalPresent) * 100).toFixed(1) : "0.0";

    // 3. Dept Wise Attendance Rate
    const deptWise = DEPARTMENTS.map((dept) => {
      const deptStaffIds = staffList
        .filter((s) => s.department === dept)
        .map((s) => s.id);
      const deptLogs = attendanceLogs.filter(
        (log) =>
          deptStaffIds.includes(log.staffId) && log.status !== "On Leave",
      );
      const deptTotal = deptLogs.length;
      const deptPresent = deptLogs.filter(
        (l) => l.status === "Present" || l.status === "Late",
      ).length;
      const rate =
        deptTotal > 0 ? Math.round((deptPresent / deptTotal) * 100) : 0;
      return { dept, rate };
    });

    // 4. Monthly Trend Data (Last 12 Months)
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyRates = monthNames.map((name, idx) => {
      const logsInMonth = attendanceLogs.filter(
        (log) =>
          new Date(log.date).getMonth() === idx && log.status !== "On Leave",
      );
      const mTotal = logsInMonth.length;
      const mPresent = logsInMonth.filter(
        (l) => l.status === "Present" || l.status === "Late",
      ).length;
      const rate = mTotal > 0 ? Math.round((mPresent / mTotal) * 100) : 0;
      return { name, rate };
    });

    // 5. Total Count Status Distribution
    const cPresent = attendanceLogs.filter(
      (l) => l.status === "Present",
    ).length;
    const cLate = attendanceLogs.filter((l) => l.status === "Late").length;
    const cAbsent = attendanceLogs.filter((l) => l.status === "Absent").length;
    const cTotal = cPresent + cLate + cAbsent;

    const pPresent = cTotal > 0 ? Math.round((cPresent / cTotal) * 100) : 0;
    const pLate = cTotal > 0 ? Math.round((cLate / cTotal) * 100) : 0;
    const pAbsent = cTotal > 0 ? Math.round((cAbsent / cTotal) * 100) : 0;

    return {
      avgAttendance,
      punctuality,
      deptWise,
      monthlyRates,
      statusBreakdown: { present: pPresent, late: pLate, absent: pAbsent },
    };
  }, [attendanceLogs, staffList]);

  // Filtered staff list
  const filteredStaffList = useMemo(() => {
    return staffList.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept =
        deptFilter === "All" || staff.department === deptFilter;
      const matchesStatus =
        statusFilter === "All" || staff.status === statusFilter;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [staffList, searchQuery, deptFilter, statusFilter]);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 p-4 md:p-8 shadow-sm flex flex-col relative text-slate-800">
      {/* ----------------------------------------------------
          1. Header Block & Key Statistics
          ---------------------------------------------------- */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between border-b border-slate-100 pb-6 mb-6 gap-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Staff Management Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-light">
            Administer staff lists, record check-ins, monitor full-year
            attendance databases, and analyze organizational health.
          </p>
        </div>

        {/* Small Analytics Strips */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 shrink-0">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-2.5 flex flex-col justify-center min-w-[100px] md:min-w-[130px] shadow-2xs">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              Total Staff
            </span>
            <span className="text-lg md:text-xl font-bold text-slate-800 mt-0.5">
              {statsSummary.total}
            </span>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl px-4 py-2.5 flex flex-col justify-center min-w-[100px] md:min-w-[130px] shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">
                Present Today
              </span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
            <span className="text-lg md:text-xl font-bold text-emerald-700 mt-0.5">
              {statsSummary.checkedInToday}
            </span>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl px-4 py-2.5 flex flex-col justify-center min-w-[100px] md:min-w-[130px] shadow-2xs">
            <span className="text-[10px] text-amber-800 uppercase font-bold tracking-wider">
              Avg Attendance
            </span>
            <span className="text-lg md:text-xl font-bold text-amber-700 mt-0.5">
              {statsSummary.attendanceRate}
            </span>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. Tab Navigation Menu
          ---------------------------------------------------- */}
      <div className="flex border-b border-slate-200 pb-3 mb-6 gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => navigate("/staff-directory")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs.5 md:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "directory"
              ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/15 border border-brand-navy"
              : "text-slate-500 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 hover:text-brand-navy hover:border-slate-300"
          }`}
        >
          <IconUsers />
          Staff List
        </button>

        <button
          onClick={() => navigate("/staff-checkin")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs.5 md:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "checkin"
              ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/15 border border-brand-navy"
              : "text-slate-500 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 hover:text-brand-navy hover:border-slate-300"
          }`}
        >
          <IconClock />
          Attendance Check-in
        </button>

        <button
          onClick={() => navigate("/staff-logs")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs.5 md:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "yearly"
              ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/15 border border-brand-navy"
              : "text-slate-500 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 hover:text-brand-navy hover:border-slate-300"
          }`}
        >
          <IconCalendar />
          Yearly Attendance Logs
        </button>

        <button
          onClick={() => navigate("/staff-analytics")}
          className={`flex items-center gap-2 px-5 py-2.5 text-xs.5 md:text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer ${
            activeTab === "analytics"
              ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/15 border border-brand-navy"
              : "text-slate-500 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 hover:text-brand-navy hover:border-slate-300"
          }`}
        >
          <IconAnalytics />
          Analytics Dashboard
        </button>
      </div>

      {/* ----------------------------------------------------
          3. TAB CONTENT: DIRECTORY
          ---------------------------------------------------- */}
      {activeTab === "directory" && (
        <div className="flex-1 flex flex-col">
          {/* Controls Panel */}
          <div
            className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl border mb-6"
            style={{
              backgroundColor: "#f8fafc",
              borderColor: "#e2e8f0",
            }}
          >
            {/* Search Box */}
            <div className="relative w-full lg:w-72">
              <input
                type="text"
                placeholder="Search staff name, role, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 text-xs.5 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/15 transition-all text-slate-800 bg-slate-50 placeholder:text-slate-400/80"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                <IconSearch />
              </span>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1">
                  <IconFilter />
                  Dept:
                </span>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="border border-slate-200 bg-white rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-brand-gold text-slate-800 font-semibold cursor-pointer"
                >
                  <option value="All">All Departments</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-slate-200 bg-white rounded-xl px-2.5 py-1.5 text-xs outline-none focus:border-brand-gold text-slate-800 font-semibold cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="h-9 px-4 bg-brand-gold hover:bg-btn-gold-hover text-slate-950 text-xs.5 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-brand-gold/15"
              >
                <IconPlus />
                Add Staff
              </button>
            </div>
          </div>

          {/* Table Container */}
          {filteredStaffList.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-2xl h-80 flex flex-col items-center justify-center bg-slate-50 gap-2.5 text-slate-400">
              <svg
                className="w-10 h-10 text-slate-650"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <p className="text-sm font-semibold text-slate-650">
                No staff members found
              </p>
              <p className="text-xs text-slate-500 font-light">
                Try adjusting your filters or add a new record to the list.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto scrollbar-none border border-slate-100 rounded-2xl bg-white">
                <table className="min-w-full divide-y divide-slate-150 bg-white">
                  <thead className="bg-slate-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Staff Member
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Contact Info
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Department
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Join Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredStaffList.map((staff) => (
                      <tr
                        key={staff.id}
                        className="hover:bg-slate-55/20 transition-all"
                      >
                        {/* Name & Initials Avatar */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl ${staff.avatarColor} text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm`}
                            >
                              {staff.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800 font-sans">
                                {staff.name}
                              </div>
                              <div className="text-[11px] text-slate-650/80 font-medium">
                                {staff.role}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Contact Details */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <div className="text-xs text-slate-700 font-medium">
                            {staff.email}
                          </div>
                          <div className="text-[11px] text-slate-650/80 mt-0.5">
                            {staff.phone}
                          </div>
                        </td>

                        {/* Department */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <span className="bg-slate-100 border border-slate-150 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-bold tracking-wide">
                            {staff.department}
                          </span>
                        </td>

                        {/* Join Date */}
                        <td className="px-6 py-4.5 whitespace-nowrap text-xs text-slate-700 font-medium">
                          {new Date(staff.joinDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${staff.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : staff.status === "On Leave"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-750 border-red-200"
                              }`}
                          >
                            {staff.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedStaff(staff);
                              }}
                              className="p-1.5 border border-slate-200 hover:border-brand-gold bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                              title="View Full Profile Details"
                            >
                              <IconEye />
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(staff)}
                              className="p-1.5 border border-slate-200 hover:border-brand-gold bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                              title="Edit Staff Info"
                            >
                              <IconEdit />
                            </button>
                            <button
                              onClick={() => handleOpenDeleteModal(staff)}
                              className="p-1.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-700 hover:text-white hover:bg-red-500 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                              title="Remove Staff Member"
                            >
                              <IconTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-4">
                {filteredStaffList.map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-white border border-slate-150 rounded-2xl p-4 md:p-5 shadow-sm space-y-3.5"
                  >
                    {/* Header: Avatar, Name, Role & Status */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${staff.avatarColor} text-white flex items-center justify-center font-bold text-sm uppercase shadow-sm`}
                        >
                          {staff.name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <h4 className="text-sm.5 font-bold text-slate-800 leading-tight">
                            {staff.name}
                          </h4>
                          <p className="text-xs text-slate-650/80 font-medium mt-0.5">
                            {staff.role}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${staff.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : staff.status === "On Leave"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-red-50 text-red-750 border-red-200"
                          }`}
                      >
                        {staff.status}
                      </span>
                    </div>

                    {/* Details Section */}
                    <div className="grid grid-cols-2 gap-3 text-xs.5 border-t border-b border-slate-100 py-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                          Department
                        </span>
                        <span className="text-slate-800 font-semibold mt-0.5 block">
                          {staff.department}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
                          Joined Date
                        </span>
                        <span className="text-slate-700 font-medium mt-0.5 block">
                          {new Date(staff.joinDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Contact Information & Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <div className="space-y-0.5 text-xs text-slate-700">
                        <div className="truncate font-medium">
                          {staff.email}
                        </div>
                        <div className="text-[11px] text-slate-650/80">
                          {staff.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setSelectedStaff(staff)}
                          className="p-2.5 border border-slate-200 hover:border-brand-gold bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold flex-1"
                          title="View Details"
                        >
                          <IconEye />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(staff)}
                          className="p-2.5 border border-slate-200 hover:border-brand-gold bg-slate-50 text-slate-700 hover:text-slate-950 hover:bg-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold flex-1"
                          title="Edit Info"
                        >
                          <IconEdit />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(staff)}
                          className="p-2.5 border border-slate-200 hover:border-red-500 bg-slate-50 text-slate-700 hover:text-white hover:bg-red-500 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold flex-1"
                          title="Remove Staff"
                        >
                          <IconTrash />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          4. TAB CONTENT: CHECK-IN
          ---------------------------------------------------- */}
      {activeTab === "checkin" && (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Check-In Control Panel (Left 7 Cols) */}
          <div
            className="lg:col-span-7 border rounded-3xl p-6 md:p-8 flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden"
            style={{
              backgroundColor: "#f8fafc",
              borderColor: "#e2e8f0",
            }}
          >
            {/* Design Watermarks */}
            <div className="absolute w-60 h-60 rounded-full border-[30px] border-white/3 -top-10 -left-10 pointer-events-none" />
            <div className="absolute w-40 h-40 rounded-full border-[20px] border-brand-gold/3 -bottom-10 -right-10 pointer-events-none" />

            {/* Time / Clock Widget */}
            <div className="text-center relative z-10 w-full mb-6">
              <span className="bg-brand-gold/15 border border-brand-gold/30 rounded-full px-4 py-1 text-xs.5 font-bold text-amber-500 uppercase tracking-wider">
                Digital Attendance terminal
              </span>
              <h3 className="text-3.5xl md:text-5xl font-mono font-bold text-slate-800 mt-4 tracking-tight drop-shadow-xs">
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,
                })}
              </h3>
              <p className="text-xs.5 md:text-sm font-semibold text-slate-500 mt-2">
                {currentTime.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Form & Selection Area */}
            <div className="w-full max-w-sm relative z-10 border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col gap-4 bg-white">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Select Staff Member
                </label>
                <select
                  value={checkinStaffId}
                  onChange={(e) => {
                    setCheckinStaffId(e.target.value);
                    setCheckinSuccessMsg(null); // Reset confirmation
                  }}
                  className="w-full h-11 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 transition-all text-xs.5 text-slate-800 bg-slate-50 focus:bg-white font-semibold cursor-pointer"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Immutable Automatic Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Captured Date
                  </label>
                  <input
                    type="text"
                    value={todayStr}
                    disabled
                    className="w-full h-9 border border-slate-150 rounded-lg px-2.5 text-xs text-slate-400 bg-slate-100 font-semibold select-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Check-in Type
                  </label>
                  <input
                    type="text"
                    value="AUTO (Realtime Clock)"
                    disabled
                    className="w-full h-9 border border-slate-150 rounded-lg px-2.5 text-xs text-slate-400 bg-slate-100 font-semibold select-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Dynamic Status Bar for the chosen staff */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-150/75 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="text-slate-500">Current Status:</span>
                {todayLog ? (
                  todayLog.checkOut ? (
                    <span className="text-purple-400 bg-purple-950/20 px-2 py-0.5 border border-purple-500/20 rounded-lg">
                      Checked Out
                    </span>
                  ) : (
                    <span className="text-emerald-400 bg-emerald-950/20 px-2 py-0.5 border border-emerald-500/30 rounded-lg animate-pulse">
                      Checked In ({todayLog.checkIn})
                    </span>
                  )
                ) : (
                  <span className="text-slate-450 italic">Not Checked In</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-1">
                {!todayLog ? (
                  <button
                    onClick={handleCheckinCheckIn}
                    className="flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md shadow-emerald-500/15 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <IconFingerprint className="w-5 h-5 text-slate-600" />
                    Check-In
                  </button>
                ) : !todayLog.checkOut ? (
                  <button
                    onClick={handleCheckinCheckOut}
                    className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl cursor-pointer shadow-md shadow-amber-500/15 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Check-Out
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 h-11 bg-slate-200 text-slate-400 font-bold text-xs.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    ✓ Shift Completed Today
                  </button>
                )}
              </div>
            </div>

            {/* Instant Confirmation Banner */}
            {checkinSuccessMsg ? (
              <div className="w-full max-w-sm mt-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3 relative animate-in fade-in slide-in-from-bottom-2 duration-300 text-emerald-200">
                <span className="text-emerald-400 bg-white/5 rounded-full p-1.5 shadow-xs shrink-0 flex items-center justify-center border border-emerald-500/30">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <div>
                  <h4 className="text-xs.5 font-bold text-emerald-400">
                    Captured: {checkinSuccessMsg.type} Successful!
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    <strong>{checkinSuccessMsg.name}</strong> registered
                    successfully at {checkinSuccessMsg.time}. Status is{" "}
                    <strong>{checkinSuccessMsg.status}</strong>.
                  </p>
                </div>
                <button
                  onClick={() => setCheckinSuccessMsg(null)}
                  className="absolute top-2 right-2 text-emerald-400 hover:text-emerald-250 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 mt-6 font-light flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Clock input is hardware locked. Staff cannot manipulate time
                entries.
              </div>
            )}
          </div>

          {/* Right History Panel (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col border border-slate-200 rounded-3xl p-6 min-h-[460px] bg-slate-50">
            <div className="border-b border-slate-150 pb-3.5 mb-4">
              <h3 className="text-base font-bold text-slate-800">
                Today's Check-in Log
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Live streaming logs from this check-in terminal.
              </p>
            </div>

            {recentCheckinLogs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2 border border-dashed border-slate-200 rounded-2xl bg-white">
                <svg
                  className="w-8 h-8 text-slate-650 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
                <span className="text-xs font-semibold text-slate-500">
                  No check-ins recorded today
                </span>
                <span className="text-[10px] text-slate-400">
                  Terminal ready for first entry...
                </span>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 max-h-[360px]">
                {recentCheckinLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 p-3 border border-slate-100 bg-white hover:bg-slate-50 rounded-xl transition-all shadow-2xs"
                  >
                    {/* Tiny initials circle */}
                    <div
                      className={`w-8 h-8 rounded-lg ${log.avatarColor} text-white flex items-center justify-center font-bold text-xs uppercase shrink-0`}
                    >
                      {log.staffName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs.5 font-bold text-slate-800 truncate">
                        {log.staffName}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {log.role}
                      </div>
                    </div>

                    {/* Time / Status indicators */}
                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-bold text-slate-800">
                        In: {log.checkIn}
                      </div>
                      <div className="text-[10px] text-slate-650 font-medium mt-0.5">
                        {log.checkOut ? (
                          `Out: ${log.checkOut}`
                        ) : (
                          <span className="text-emerald-400 animate-pulse font-bold">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 pl-1">
                      <span
                        className={`inline-flex px-1.5 py-0.2 rounded-md text-[9px] font-bold border uppercase tracking-wider ${log.status === "Present"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                      >
                        {log.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          5. TAB CONTENT: YEARLY LOGS
          ---------------------------------------------------- */}
      {activeTab === "yearly" && (
        <div className="flex-1 flex flex-col">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4.5 border border-slate-200/80 rounded-2xl mb-6 bg-slate-50 shadow-2xs">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  STAFF:
                </span>
                <select
                  value={logsStaffId}
                  onChange={(e) => {
                    setLogsStaffId(e.target.value);
                    setExpandedMonth(new Date().getMonth()); // Reset expand to current month
                  }}
                  className="border border-slate-200 bg-white rounded-xl px-3.5 py-2 text-xs outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-slate-800 font-bold cursor-pointer max-w-xs shadow-2xs transition-all"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block">
                  YEAR:
                </span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="border border-slate-200 bg-white rounded-xl px-3.5 py-2 text-xs outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-slate-800 font-bold cursor-pointer w-28 shadow-2xs transition-all"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>

            {selectedLogsStaff && (
              <div className="text-xs text-slate-500 font-medium">
                Email:{" "}
                <span className="font-semibold text-brand-navy">
                  {selectedLogsStaff.email}
                </span>
              </div>
            )}
          </div>

          {/* Core Data Block */}
          {selectedLogsStaff ? (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* Year Stats Sidebar (Left 4 Cols) */}
              <div className="xl:col-span-4 border border-slate-200/80 p-6 rounded-3xl space-y-6 bg-slate-50/50 shadow-sm animate-in fade-in duration-200">
                <div className="border-b border-slate-200/80 pb-3.5">
                  <h3 className="text-base.5 font-bold text-brand-navy">
                    Annual Statistics
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-light">
                    Year-to-date metrics summary.
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
                  <div
                    className={`w-11 h-11 rounded-xl ${selectedLogsStaff.avatarColor} text-white flex items-center justify-center font-bold text-sm uppercase shadow-xs`}
                  >
                    {selectedLogsStaff.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {selectedLogsStaff.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {selectedLogsStaff.role}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-amber-500/5 border border-amber-500/15 p-3.5 rounded-2xl">
                    <span className="text-[9px] text-amber-800 uppercase font-extrabold tracking-wider block">
                      Attendance Rate
                    </span>
                    <span className="text-xl font-bold text-amber-700 block mt-1">
                      {yearlyStats.rate}
                    </span>
                  </div>
                  <div className="bg-indigo-500/5 border border-indigo-500/15 p-3.5 rounded-2xl">
                    <span className="text-[9px] text-indigo-800 uppercase font-extrabold tracking-wider block">
                      Present Weekdays
                    </span>
                    <span className="text-xl font-bold text-indigo-700 block mt-1">
                      {yearlyStats.present + yearlyStats.late} days
                    </span>
                  </div>
                  <div className="bg-rose-500/5 border border-rose-500/15 p-3.5 rounded-2xl">
                    <span className="text-[9px] text-rose-800 uppercase font-extrabold tracking-wider block">
                      Late Arrivals
                    </span>
                    <span className="text-xl font-bold text-rose-700 block mt-1">
                      {yearlyStats.late} times
                    </span>
                  </div>
                  <div className="bg-slate-500/5 border border-slate-500/15 p-3.5 rounded-2xl">
                    <span className="text-[9px] text-slate-800 uppercase font-extrabold tracking-wider block">
                      Absences / Offs
                    </span>
                    <span className="text-xl font-bold text-slate-700 block mt-1">
                      {yearlyStats.absent} days
                    </span>
                  </div>
                </div>

                <div className="border border-slate-200 bg-white rounded-2xl p-5 shadow-2xs">
                  <h4 className="text-xs.5 font-bold text-brand-navy mb-3 flex items-center gap-2">
                    <IconFingerprint className="w-5 h-5 text-brand-navy/80" />
                    Compliance & Hours
                  </h4>
                  <ul className="text-xs text-slate-500 font-medium space-y-2 list-disc pl-4 leading-relaxed">
                    <li>
                      Avg work duration:{" "}
                      <strong className="text-slate-800">8.1 hrs</strong>
                    </li>
                    <li>Weekend policies (Sat-Sun) excluded from billing</li>
                    <li>Late threshold: check-in after 08:45 AM</li>
                  </ul>
                </div>
              </div>

              {/* Months Accordion List (Right 8 Cols) */}
              <div className="xl:col-span-8 space-y-3.5">
                {monthlyGroupedLogs.map((month) => {
                  const isExpanded = expandedMonth === month.monthIndex;
                  return (
                    <div
                      key={month.monthName}
                      className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md bg-white"
                    >
                      {/* Accordion Month Header */}
                      <button
                        onClick={() =>
                          setExpandedMonth(isExpanded ? null : month.monthIndex)
                        }
                        className={`w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50/80 transition-colors ${
                          isExpanded ? "bg-slate-50 border-b border-slate-200" : ""
                        }`}
                      >
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {month.monthName}
                            <span className="bg-slate-100 border border-slate-200 text-[10px] text-slate-500 font-bold px-2 py-0.5 rounded-full">
                              {month.logs.length} logged
                            </span>
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-bold uppercase tracking-wider">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md">
                              Present: {month.summary.present}
                            </span>
                            <span className="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md">
                              Late: {month.summary.late}
                            </span>
                            <span className="bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-md">
                              Absent: {month.summary.absent}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right pr-2.5">
                            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">
                              Rate
                            </span>
                            <span className="text-xs.5 font-extrabold text-slate-850 block mt-0.5">
                              {month.summary.rate}
                            </span>
                          </div>
                          <span
                            className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </span>
                        </div>
                      </button>

                      {/* Accordion Expand Area */}
                      {isExpanded && (
                        <div className="p-4 bg-white border-t border-slate-100">
                          {month.logs.length === 0 ? (
                            <div className="text-center py-6 text-xs text-slate-400 italic">
                              No attendance records found for this period.
                            </div>
                          ) : (
                            <div className="overflow-x-auto scrollbar-none border border-slate-150 rounded-xl max-h-80 overflow-y-auto bg-white">
                              <table className="min-w-full divide-y divide-slate-150 bg-white">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                                    >
                                      Date
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                                    >
                                      Check-in
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                                    >
                                      Check-out
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                                    >
                                      Work Hours
                                    </th>
                                    <th
                                      scope="col"
                                      className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                                    >
                                      Status
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs.5 font-medium text-slate-700 bg-white">
                                  {month.logs.map((log) => {
                                    // Calculate work duration
                                    let hrs = "-";
                                    if (log.checkIn && log.checkOut) {
                                      const [iH, iM] = log.checkIn
                                        .split(":")
                                        .map(Number);
                                      const [oH, oM] = log.checkOut
                                        .split(":")
                                        .map(Number);
                                      const diff =
                                        oH * 60 + oM - (iH * 60 + iM);
                                      hrs = `${(diff / 60).toFixed(1)} hrs`;
                                    }

                                    return (
                                      <tr
                                        key={log.id}
                                        className="hover:bg-slate-50/40 transition-colors bg-white text-slate-700"
                                      >
                                        <td className="px-4 py-2.5 whitespace-nowrap text-slate-800 font-bold">
                                          {new Date(
                                            log.date,
                                          ).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                          })}
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap">
                                          {log.checkIn || "N/A"}
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap">
                                          {log.checkOut || "Active"}
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap text-slate-800 font-semibold">
                                          {hrs}
                                        </td>
                                        <td className="px-4 py-2.5 whitespace-nowrap">
                                          <span
                                            className={`inline-flex px-1.5 py-0.2 rounded-md text-[8.5px] font-extrabold border uppercase tracking-wider ${
                                              log.status === "Present"
                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                : log.status === "Late"
                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                : log.status === "On Leave"
                                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                                : "bg-red-50 text-red-750 border-red-200"
                                            }`}
                                          >
                                            {log.status}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-150">
              No staff member selected for logs.
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          6. TAB CONTENT: ANALYTICS
          ---------------------------------------------------- */}
      {activeTab === "analytics" && (
        <div className="flex-1 space-y-8">
          {/* Key Metric Tiles Row */}

          {/* Visual SVG Graphs Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Chart 1: Monthly Attendance Rate (Left 8 Cols) */}
            <div className="xl:col-span-8 border border-slate-200 p-5 rounded-3xl bg-white flex flex-col">
              <div className="border-b border-slate-150 pb-3 mb-5">
                <h3 className="text-base font-bold text-slate-800">
                  Monthly Attendance Trend
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Average system-wide attendance rate over the 12 calendar
                  months.
                </p>
              </div>

              {/* Premium Custom SVG Bar Chart */}
              <div className="flex-1 flex flex-col justify-between overflow-x-auto scrollbar-none w-full">
                <div className="h-64 min-w-[550px] w-full relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 600 240"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    {/* SVG Grid Lines */}
                    <line
                      x1="0"
                      y1="40"
                      x2="600"
                      y2="40"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="3"
                    />
                    <line
                      x1="0"
                      y1="90"
                      x2="600"
                      y2="90"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="3"
                    />
                    <line
                      x1="0"
                      y1="140"
                      x2="600"
                      y2="140"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="3"
                    />
                    <line
                      x1="0"
                      y1="190"
                      x2="600"
                      y2="190"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="3"
                    />

                    {/* Chart Data Bars */}
                    {analyticsData.monthlyRates.map((data, idx) => {
                      const barWidth = 26;
                      const gap = 22;
                      const x = 12 + idx * (barWidth + gap);

                      // Calculate height based on rate (max rate is 100%, maps to Y scale from 40 to 200 -> height 160)
                      const scaleMaxY = 190;
                      const scaleMinY = 40;
                      const scaleHeight = scaleMaxY - scaleMinY;
                      const height = (data.rate / 100) * scaleHeight;
                      const y = scaleMaxY - height;

                      return (
                        <g key={data.name} className="group cursor-pointer">
                          {/* Animated Column Bar */}
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={height}
                            rx="5"
                            className="fill-indigo-500/80 hover:fill-brand-gold transition-colors duration-250"
                          />

                          {/* Hover Tooltip Text */}
                          <text
                            x={x + barWidth / 2}
                            y={y - 8}
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          >
                            {data.rate}%
                          </text>

                          {/* X Axis Label */}
                          <text
                            x={x + barWidth / 2}
                            y="222"
                            textAnchor="middle"
                            className="text-[10px] font-bold fill-slate-400"
                          >
                            {data.name}
                          </text>
                        </g>
                      );
                    })}

                    {/* Y Axis Indicators */}
                    <text
                      x="590"
                      y="45"
                      textAnchor="end"
                      className="text-[9px] font-bold fill-slate-400"
                    >
                      100%
                    </text>
                    <text
                      x="590"
                      y="95"
                      textAnchor="end"
                      className="text-[9px] font-bold fill-slate-400"
                    >
                      80%
                    </text>
                    <text
                      x="590"
                      y="145"
                      textAnchor="end"
                      className="text-[9px] font-bold fill-slate-400"
                    >
                      60%
                    </text>
                    <text
                      x="590"
                      y="195"
                      textAnchor="end"
                      className="text-[9px] font-bold fill-slate-400"
                    >
                      40%
                    </text>

                    {/* Ground line */}
                    <line
                      x1="0"
                      y1="202"
                      x2="600"
                      y2="202"
                      stroke="#475569"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-center gap-6 mt-4 text-[10px] text-slate-450 font-semibold tracking-wider uppercase border-t border-slate-50 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-indigo-500 rounded-md"></span>
                    <span>Average Attendance Rate (%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-brand-gold rounded-md"></span>
                    <span>Hovered month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 2: Status breakdown and Department Leaderboard (Right 4 Cols) */}
            <div className="xl:col-span-4 space-y-6">
              {/* Department Leaderboard */}
              <div className="border border-slate-200 p-5 rounded-3xl bg-white">
                <div className="border-b border-slate-150 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-800">
                    Department Attendance
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Average attendance performance scores.
                  </p>
                </div>

                <div className="space-y-4">
                  {analyticsData.deptWise.map((d) => (
                    <div key={d.dept} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-650">{d.dept}</span>
                        <span className="text-brand-gold font-bold">
                          {d.rate}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${d.rate >= 95
                              ? "bg-emerald-500"
                              : d.rate >= 92
                                ? "bg-indigo-500"
                                : "bg-amber-500"
                            }`}
                          style={{ width: `${d.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Donut Ratios */}
              <div className="border border-slate-200 p-5 rounded-3xl bg-white">
                <div className="border-b border-slate-150 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-800">
                    Attendance Composition
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Total logs breakdown ratio.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
                  {/* Small Circular Graphic */}
                  <div className="relative w-24 h-24 shrink-0">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      {/* Background Circle */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                      />

                      {/* Present Arc */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="4"
                        strokeDasharray={`${analyticsData.statusBreakdown.present} 100`}
                        strokeDashoffset="0"
                      />

                      {/* Late Arc */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="4"
                        strokeDasharray={`${analyticsData.statusBreakdown.late} 100`}
                        strokeDashoffset={`-${analyticsData.statusBreakdown.present}`}
                      />

                      {/* Absent Arc */}
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="4"
                        strokeDasharray={`${analyticsData.statusBreakdown.absent} 100`}
                        strokeDashoffset={`-${analyticsData.statusBreakdown.present + analyticsData.statusBreakdown.late}`}
                      />
                    </svg>

                    {/* Centered label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-extrabold text-slate-800 leading-none">
                        Ratio
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold mt-0.5 uppercase">
                        Break
                      </span>
                    </div>
                  </div>

                  {/* Status Ratios Legend */}
                  <div className="space-y-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm"></span>
                      <span>
                        On Time ({analyticsData.statusBreakdown.present}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span>
                      <span>Late ({analyticsData.statusBreakdown.late}%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-sm"></span>
                      <span>
                        Absent ({analyticsData.statusBreakdown.absent}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          7. MODALS: ADD STAFF
          ---------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base.5 font-bold text-slate-800">
                Add New Staff Member
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={staffForm.name}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, name: e.target.value })
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-xs.5 text-slate-800 bg-slate-50 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lecturer"
                    value={staffForm.role}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, role: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-xs.5 text-slate-800 bg-slate-50 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={staffForm.department}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, department: e.target.value })
                    }
                    className="w-full h-10 px-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-gold text-xs.5 text-slate-800 font-semibold cursor-pointer bg-white"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rajesh@eduwizer.com"
                    value={staffForm.email}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, email: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-xs.5 text-slate-800 bg-slate-50 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 99999 88888"
                    value={staffForm.phone}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, phone: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-xs.5 text-slate-800 bg-slate-50 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    min="2023-01-01"
                    value={staffForm.joinDate}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, joinDate: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold text-xs.5 text-slate-800 cursor-pointer bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Employment Status
                  </label>
                  <select
                    value={staffForm.status}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, status: e.target.value })
                    }
                    className="w-full h-10 px-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-gold text-xs.5 text-slate-800 font-semibold cursor-pointer bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4.5 h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs.5 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 h-10 bg-brand-gold hover:bg-btn-gold-hover text-slate-950 text-xs.5 font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-brand-gold/15"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          8. MODALS: EDIT STAFF
          ---------------------------------------------------- */}
      {isEditModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base.5 font-bold text-slate-800">
                Edit Staff Details
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, name: e.target.value })
                  }
                  className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-xs.5 text-slate-800 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffForm.role}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, role: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-xs.5 text-slate-800 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    value={staffForm.department}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, department: e.target.value })
                    }
                    className="w-full h-10 px-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-gold text-xs.5 text-slate-800 font-semibold cursor-pointer bg-white"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={staffForm.email}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, email: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-xs.5 text-slate-800 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={staffForm.phone}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, phone: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold focus:ring-4 focus:ring-brand-gold/10 text-xs.5 text-slate-800 bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    min="2023-01-01"
                    value={staffForm.joinDate}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, joinDate: e.target.value })
                    }
                    className="w-full h-10 px-3 border border-slate-200 rounded-xl outline-none focus:border-brand-gold text-xs.5 text-slate-800 cursor-pointer bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Employment Status
                  </label>
                  <select
                    value={staffForm.status}
                    onChange={(e) =>
                      setStaffForm({ ...staffForm, status: e.target.value })
                    }
                    className="w-full h-10 px-2.5 border border-slate-200 rounded-xl outline-none focus:border-brand-gold text-xs.5 text-slate-800 font-semibold cursor-pointer bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4.5 h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs.5 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 h-10 bg-brand-gold hover:bg-btn-gold-hover text-slate-950 text-xs.5 font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-brand-gold/15"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          9. MODALS: DELETE CONFIRM
          ---------------------------------------------------- */}
      {isDeleteModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col text-center items-center justify-center">
            <div className="w-12 h-12 bg-rose-955/20 text-rose-450 border border-rose-500/20 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-base.5 font-bold text-slate-800 mb-1.5">
              Remove Staff Member
            </h3>
            <p className="text-xs text-slate-500 font-light leading-relaxed mb-6">
              Are you sure you want to remove{" "}
              <strong>{selectedStaff.name}</strong> from the Eduwizer directory?
              This will permanently delete their credentials and all historical
              attendance databases.
            </p>

            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 h-10 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs.5 font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteStaff}
                className="flex-1 h-10 bg-rose-600 hover:bg-rose-700 text-white text-xs.5 font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/15"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          10. MODALS: VIEW PROFILE DETAILS (SLIDE OUT HUB)
          ---------------------------------------------------- */}
      {selectedStaff && !isEditModalOpen && !isDeleteModalOpen && (
        <div className="fixed inset-0 bg-brand-navy/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 shrink-0">
              <h3 className="text-base.5 font-bold text-slate-800">
                Staff Profile Details
              </h3>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1.5 space-y-5">
              {/* Header profile block */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 border border-slate-100 rounded-2xl">
                <div
                  className={`w-14 h-14 rounded-2xl ${selectedStaff.avatarColor} text-white flex items-center justify-center font-extrabold text-lg uppercase shadow-sm`}
                >
                  {selectedStaff.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-slate-800 truncate">
                    {selectedStaff.name}
                  </h4>

                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="bg-slate-150 border border-slate-250 text-slate-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide">
                      {selectedStaff.department}
                    </span>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${selectedStaff.status === "Active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-950/20 text-amber-600 border-amber-500/30"
                        }`}
                    >
                      {selectedStaff.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specific info groups */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-800/60 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                    Contact Parameters
                  </h5>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Email Address
                    </label>
                    <span className="text-xs.5 text-slate-700 font-semibold break-all">
                      {selectedStaff.email}
                    </span>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Phone Number
                    </label>
                    <span className="text-xs.5 text-slate-700 font-semibold">
                      {selectedStaff.phone}
                    </span>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-2xl p-4 space-y-3">
                  <h5 className="text-[10px] font-bold text-slate-800/60 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                    Employment Profile
                  </h5>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Joining Date
                    </label>
                    <span className="text-xs.5 text-slate-700 font-semibold">
                      {new Date(selectedStaff.joinDate).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </span>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Staff Type
                    </label>
                    <span className="text-xs.5 text-slate-700 font-semibold">
                      Full-Time Institutional Faculty
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between shrink-0">
              <button
                onClick={() => {
                  setSelectedStaff(null);
                  navigate("/staff-logs");
                  setLogsStaffId(selectedStaff.id);
                }}
                className="inline-flex items-center gap-1.5 px-4 h-9 bg-brand-gold hover:bg-btn-gold-hover text-slate-950 text-xs.5 font-bold rounded-xl transition-all shadow-md shadow-brand-gold/15 cursor-pointer"
              >
                View Attendance Logs
              </button>

              <button
                onClick={() => setSelectedStaff(null)}
                className="px-5 h-9 bg-brand-navy hover:bg-brand-purple text-white text-xs.5 font-bold rounded-xl transition-all cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
