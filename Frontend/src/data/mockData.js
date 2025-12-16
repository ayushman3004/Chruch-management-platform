// Static demo data for Church Management Platform

// Members Data
export const members = [
  {
    id: 1,
    name: "John Anderson",
    email: "john.anderson@email.com",
    phone: "(555) 123-4567",
    role: "admin",
    ministry: "Worship Team",
    joinDate: "2020-01-15",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    address: "123 Oak Street, Springfield"
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    email: "sarah.mitchell@email.com",
    phone: "(555) 234-5678",
    role: "staff",
    ministry: "Children's Ministry",
    joinDate: "2019-06-20",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    address: "456 Maple Avenue, Springfield"
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.j@email.com",
    phone: "(555) 345-6789",
    role: "member",
    ministry: "Youth Group",
    joinDate: "2021-03-10",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    address: "789 Pine Road, Springfield"
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 456-7890",
    role: "member",
    ministry: "Outreach",
    joinDate: "2022-08-05",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    address: "321 Elm Street, Springfield"
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@email.com",
    phone: "(555) 567-8901",
    role: "staff",
    ministry: "Worship Team",
    joinDate: "2018-11-12",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    address: "654 Cedar Lane, Springfield"
  },
  {
    id: 6,
    name: "Jessica Brown",
    email: "jessica.b@email.com",
    phone: "(555) 678-9012",
    role: "member",
    ministry: "Prayer Team",
    joinDate: "2023-02-28",
    status: "inactive",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    address: "987 Birch Drive, Springfield"
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert.t@email.com",
    phone: "(555) 789-0123",
    role: "member",
    ministry: "Hospitality",
    joinDate: "2021-07-14",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    address: "147 Willow Way, Springfield"
  },
  {
    id: 8,
    name: "Amanda Martinez",
    email: "amanda.m@email.com",
    phone: "(555) 890-1234",
    role: "member",
    ministry: "Media Team",
    joinDate: "2022-04-22",
    status: "active",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    address: "258 Aspen Court, Springfield"
  }
];

// Events Data
export const events = [
  {
    id: 1,
    title: "Sunday Worship Service",
    description: "Weekly Sunday service with worship and sermon",
    date: "2025-12-07",
    time: "10:00 AM",
    location: "Main Sanctuary",
    category: "worship",
    recurring: true,
    attendees: 156,
    rsvpCount: 120
  },
  {
    id: 2,
    title: "Youth Night",
    description: "Fun activities and Bible study for teens",
    date: "2025-12-06",
    time: "6:30 PM",
    location: "Youth Center",
    category: "youth",
    recurring: true,
    attendees: 45,
    rsvpCount: 38
  },
  {
    id: 3,
    title: "Christmas Eve Service",
    description: "Special candlelight service celebrating Christmas",
    date: "2025-12-24",
    time: "7:00 PM",
    location: "Main Sanctuary",
    category: "special",
    recurring: false,
    attendees: 0,
    rsvpCount: 289
  },
  {
    id: 4,
    title: "Women's Bible Study",
    description: "Weekly women's fellowship and Bible study",
    date: "2025-12-10",
    time: "9:30 AM",
    location: "Fellowship Hall",
    category: "study",
    recurring: true,
    attendees: 28,
    rsvpCount: 25
  },
  {
    id: 5,
    title: "Community Outreach",
    description: "Serving meals at local shelter",
    date: "2025-12-14",
    time: "11:00 AM",
    location: "Community Center",
    category: "outreach",
    recurring: false,
    attendees: 0,
    rsvpCount: 32
  },
  {
    id: 6,
    title: "Choir Practice",
    description: "Weekly choir rehearsal for Sunday services",
    date: "2025-12-05",
    time: "7:00 PM",
    location: "Choir Room",
    category: "worship",
    recurring: true,
    attendees: 22,
    rsvpCount: 22
  }
];

// Ministries Data
export const ministries = [
  {
    id: 1,
    name: "Worship Team",
    description: "Leading the congregation in worship through music",
    leader: "David Wilson",
    leaderId: 5,
    memberCount: 18,
    meetingDay: "Wednesday",
    meetingTime: "7:00 PM",
    color: "#3b82f6"
  },
  {
    id: 2,
    name: "Children's Ministry",
    description: "Teaching and nurturing children ages 0-12",
    leader: "Sarah Mitchell",
    leaderId: 2,
    memberCount: 24,
    meetingDay: "Sunday",
    meetingTime: "9:00 AM",
    color: "#f59e0b"
  },
  {
    id: 3,
    name: "Youth Group",
    description: "Discipleship and community for teenagers",
    leader: "Michael Johnson",
    leaderId: 3,
    memberCount: 35,
    meetingDay: "Friday",
    meetingTime: "6:30 PM",
    color: "#8b5cf6"
  },
  {
    id: 4,
    name: "Outreach",
    description: "Serving our community and sharing God's love",
    leader: "Emily Davis",
    leaderId: 4,
    memberCount: 42,
    meetingDay: "Saturday",
    meetingTime: "10:00 AM",
    color: "#10b981"
  },
  {
    id: 5,
    name: "Prayer Team",
    description: "Interceding for our church and community",
    leader: "Jessica Brown",
    leaderId: 6,
    memberCount: 15,
    meetingDay: "Tuesday",
    meetingTime: "6:00 AM",
    color: "#f43f5e"
  },
  {
    id: 6,
    name: "Hospitality",
    description: "Welcoming guests and coordinating fellowship events",
    leader: "Robert Taylor",
    leaderId: 7,
    memberCount: 20,
    meetingDay: "Sunday",
    meetingTime: "8:30 AM",
    color: "#06b6d4"
  }
];

// Donations Data
export const donations = [
  { id: 1, donorId: 1, donorName: "John Anderson", amount: 500, date: "2025-12-01", type: "tithe", method: "online" },
  { id: 2, donorId: 2, donorName: "Sarah Mitchell", amount: 250, date: "2025-12-01", type: "offering", method: "check" },
  { id: 3, donorId: 3, donorName: "Michael Johnson", amount: 100, date: "2025-12-01", type: "tithe", method: "online" },
  { id: 4, donorId: 4, donorName: "Emily Davis", amount: 75, date: "2025-11-28", type: "missions", method: "cash" },
  { id: 5, donorId: 5, donorName: "David Wilson", amount: 300, date: "2025-11-24", type: "tithe", method: "online" },
  { id: 6, donorId: 7, donorName: "Robert Taylor", amount: 150, date: "2025-11-24", type: "building", method: "online" },
  { id: 7, donorId: 1, donorName: "John Anderson", amount: 500, date: "2025-11-17", type: "tithe", method: "online" },
  { id: 8, donorId: 8, donorName: "Amanda Martinez", amount: 200, date: "2025-11-17", type: "offering", method: "online" },
  { id: 9, donorId: 2, donorName: "Sarah Mitchell", amount: 250, date: "2025-11-10", type: "tithe", method: "check" },
  { id: 10, donorId: 3, donorName: "Michael Johnson", amount: 100, date: "2025-11-10", type: "tithe", method: "online" }
];

// Monthly donation summary
export const donationSummary = {
  thisMonth: 15750,
  lastMonth: 14200,
  thisYear: 185000,
  goalYear: 200000,
  averageWeekly: 3500
};

// Services Data
export const services = [
  {
    id: 1,
    title: "Sunday Morning Worship",
    date: "2025-12-07",
    time: "10:00 AM",
    theme: "The Joy of Advent",
    preacher: "Pastor John Anderson",
    worship: ["Amazing Grace", "O Come All Ye Faithful", "Joy to the World"],
    scripture: "Luke 2:1-20",
    volunteers: ["David Wilson (Worship)", "Sarah Mitchell (Children)", "Robert Taylor (Usher)"],
    status: "planned"
  },
  {
    id: 2,
    title: "Christmas Eve Candlelight",
    date: "2025-12-24",
    time: "7:00 PM",
    theme: "Light of the World",
    preacher: "Pastor John Anderson",
    worship: ["Silent Night", "O Holy Night", "Hark! The Herald Angels Sing"],
    scripture: "John 1:1-14",
    volunteers: ["David Wilson (Worship)", "Amanda Martinez (Media)", "Full Choir"],
    status: "planned"
  },
  {
    id: 3,
    title: "New Year's Day Service",
    date: "2026-01-01",
    time: "10:00 AM",
    theme: "New Beginnings",
    preacher: "Pastor John Anderson",
    worship: ["Great Is Thy Faithfulness", "Build My Life", "Blessed Be Your Name"],
    scripture: "Isaiah 43:18-19",
    volunteers: ["David Wilson (Worship)", "Sarah Mitchell (Children)"],
    status: "draft"
  }
];

// Dashboard Stats
export const dashboardStats = {
  totalMembers: 342,
  membersGrowth: 12,
  activeMinistries: 6,
  upcomingEvents: 8,
  weeklyAttendance: 156,
  attendanceGrowth: 8,
  monthlyDonations: 15750,
  donationGrowth: 10.9
};

// Recent activity for dashboard
export const recentActivity = [
  { id: 1, type: "member", message: "Amanda Martinez joined the Media Team", time: "2 hours ago" },
  { id: 2, type: "event", message: "Christmas Eve Service RSVP reached 289", time: "5 hours ago" },
  { id: 3, type: "donation", message: "Received $500 tithe from John Anderson", time: "1 day ago" },
  { id: 4, type: "ministry", message: "Youth Group meeting scheduled for Friday", time: "1 day ago" },
  { id: 5, type: "member", message: "New member registration: Thomas Clark", time: "2 days ago" }
];

// Attendance data for charts
export const attendanceData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Weekly Attendance',
      data: [145, 152, 148, 160, 155, 142, 138, 150, 158, 165, 162, 170],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
};

// Donation trends for charts
export const donationTrends = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Monthly Donations ($)',
      data: [14500, 15200, 13800, 16000, 15500, 14200, 13800, 15000, 15800, 16500, 16200, 15750],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
};

// Ministry distribution for pie chart
export const ministryDistribution = {
  labels: ['Worship Team', 'Children\'s Ministry', 'Youth Group', 'Outreach', 'Prayer Team', 'Hospitality'],
  datasets: [
    {
      data: [18, 24, 35, 42, 15, 20],
      backgroundColor: ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#f43f5e', '#06b6d4'],
      borderWidth: 0
    }
  ]
};
