import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { FiUsers, FiCalendar, FiDollarSign, FiActivity, FiArrowUp, FiMapPin, FiClock, FiTrash2, FiUser } from 'react-icons/fi';
import dashboardService from '../services/dashboardService';
import eventService from '../services/eventService';
import userService from '../services/userService';
import PublicNavbar from '../components/PublicNavbar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalPublicUsers: 0,
        upcomingEventsCount: 0,
        totalDonations: 0
    });
    const [donationChartData, setDonationChartData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Donations',
            data: [],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    });
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, eventsRes, usersRes] = await Promise.all([
                    dashboardService.getStats(),
                    eventService.getEvents(),
                    userService.getAllUsers()
                ]);

                // Process Stats
                if (statsRes.success && statsRes.stats) {
                    setStats({
                        totalMembers: statsRes.stats.totalMembers || 0,
                        totalPublicUsers: statsRes.stats.totalPublicUsers || 0,
                        upcomingEventsCount: statsRes.stats.upcomingEvents || 0,
                        totalDonations: statsRes.stats.totalDonations || 0
                    });

                    // Process Donation Chart
                    if (statsRes.stats.monthlyDonations && Array.isArray(statsRes.stats.monthlyDonations)) {
                        const newDonationValues = new Array(12).fill(0);
                        statsRes.stats.monthlyDonations.forEach(item => {
                            if (item._id >= 1 && item._id <= 12) {
                                newDonationValues[item._id - 1] = item.total;
                            }
                        });
                        setDonationChartData(prev => ({
                            ...prev,
                            datasets: [{ ...prev.datasets[0], data: newDonationValues }]
                        }));
                    }
                }

                // Process Events
                if (eventsRes.success && eventsRes.events) {
                    const sortedEvents = eventsRes.events
                        .filter(e => new Date(e.date) >= new Date())
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .slice(0, 5);
                    setUpcomingEvents(sortedEvents);
                }

                // Process Users
                if (usersRes.success && usersRes.users) {
                    setUsersList(usersRes.users);
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await userService.deleteUser(userId);
            setUsersList(usersList.filter(u => u._id !== userId));
            // Update stats locally (simple approximation)
            const user = usersList.find(u => u._id === userId);
            if (user) {
                setStats(prev => ({
                    ...prev,
                    totalMembers: user.role === 'member' ? prev.totalMembers - 1 : prev.totalMembers,
                    totalPublicUsers: user.role === 'public' ? prev.totalPublicUsers - 1 : prev.totalPublicUsers
                }));
            }
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Failed to delete user");
        }
    };

    const statCards = [
        {
            icon: FiUsers,
            label: 'Total Members',
            value: stats.totalMembers,
            color: '#3b82f6', // blue
            bg: 'bg-blue-500/20 text-blue-400'
        },
        {
            icon: FiUser,
            label: 'Total Public Users',
            value: stats.totalPublicUsers,
            color: '#8b5cf6', // violet
            bg: 'bg-violet-500/20 text-violet-400'
        },
        {
            icon: FiCalendar,
            label: 'Upcoming Events',
            value: stats.upcomingEventsCount,
            color: '#10b981', // emerald
            bg: 'bg-emerald-500/20 text-emerald-400'
        },
        {
            icon: FiDollarSign,
            label: 'Total Donations',
            value: `$${stats.totalDonations.toLocaleString()}`,
            color: '#f59e0b', // amber
            bg: 'bg-amber-500/20 text-amber-400'
        }
    ];

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                cornerRadius: 8,
                padding: 12
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#64748b' }
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2629&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/90"></div>
            </div>

            <div className="relative z-10">
                <PublicNavbar />
                <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 animate-fade-in-up space-y-8">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                        <p className="text-slate-400">Overview of church members, public users, and donations.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {statCards.map((stat, index) => (
                            <div key={index} className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.bg}`}>
                                        <stat.icon />
                                    </div>
                                </div>
                                <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                                <div className="text-sm text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Charts and Data Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Donations Chart */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:col-span-2">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Donation Trends</h3>
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">Monthly</span>
                            </div>
                            <div className="h-80">
                                <Line data={donationChartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Upcoming Events List */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
                                <a href="/events" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">View All</a>
                            </div>
                            <div className="space-y-4">
                                {upcomingEvents.length === 0 ? (
                                    <p className="text-slate-500 text-center py-4">No upcoming events found.</p>
                                ) : (
                                    upcomingEvents.map((event) => (
                                        <div key={event._id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex flex-col items-center justify-center text-white">
                                                <span className="text-xl font-bold">{new Date(event.date).getDate()}</span>
                                                <span className="text-[10px] uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-white truncate">{event.title}</h4>
                                                <p className="text-xs text-slate-400 truncate mt-0.5 flex items-center gap-1">
                                                    <FiClock size={10} /> {event.time}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                                                    <FiMapPin size={10} /> {event.location}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Management Section */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white">User Management</h3>
                            <p className="text-sm text-slate-400">Manage church members and public users</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="p-4 font-semibold">User</th>
                                        <th className="p-4 font-semibold">Role</th>
                                        <th className="p-4 font-semibold">Email</th>
                                        <th className="p-4 font-semibold">Joined</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-sm">
                                    {usersList.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td>
                                        </tr>
                                    ) : (
                                        usersList.map(user => (
                                            <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs uppercase">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <span className="text-white font-medium">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${user.role === 'admin' ? 'bg-rose-500/20 text-rose-400' :
                                                        user.role === 'member' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-slate-500/20 text-slate-400'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-300">{user.email}</td>
                                                <td className="p-4 text-slate-400">{new Date(user.joinDate || user.createdAt).toLocaleDateString()}</td>
                                                <td className="p-4 text-right">
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500/20 transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
