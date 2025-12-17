import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiDollarSign, FiCalendar, FiTrash2, FiActivity, FiX, FiCheck, FiLoader, FiGrid } from 'react-icons/fi';
import adminBg from '../assets/backgrounds/home_bg.png';
import userService from '../services/userService';
import donationService from '../services/donationService';
import eventService from '../services/eventService';
import ministryService from '../services/ministryService';
import dashboardService from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    // Data States
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [memberStats, setMemberStats] = useState([]);
    const [events, setEvents] = useState([]);
    const [ministries, setMinistries] = useState([]);
    const [stats, setStats] = useState({
        totalMembers: 0,
        totalPublicUsers: 0,
        totalDonations: 0,
        upcomingEvents: 0,
        totalMinistries: 0,
        monthlyDonations: []
    });

    // View State
    const [selectedEvent, setSelectedEvent] = useState(null); // For viewing attendees
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/dashboard'); // Redirect non-admins
        } else if (user) {
            fetchAllData();
        }
    }, [user]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch dashboard stats first
            const statsResponse = await dashboardService.getDashboardStats();

            // Then fetch detailed data for tabs
            const [usersData, memberStatsData, allDonationsData, eventsData, ministriesData] = await Promise.all([
                userService.getAllUsers(),
                donationService.getMemberDonationStats(),
                donationService.getAllDonations(),
                eventService.getAdminEvents(),
                ministryService.getAllMinistries()
            ]);

            // Set users data
            if (usersData.success) {
                setUsers(usersData.users);
            }

            // Set member donation stats
            if (memberStatsData.success) {
                setMemberStats(memberStatsData.memberDonations);
            }

            // Set all donations
            if (allDonationsData.success) {
                setDonations(allDonationsData.donations);
            }

            // Set events data
            if (eventsData.success) {
                setEvents(eventsData.events);
            }

            // Set ministries data
            if (ministriesData.success) {
                setMinistries(ministriesData.ministries);
            }

            // Set stats from backend
            if (statsResponse.success) {
                setStats({
                    totalMembers: statsResponse.stats.totalMembers || 0,
                    totalPublicUsers: statsResponse.stats.totalPublicUsers || 0,
                    totalDonations: statsResponse.stats.totalDonations || 0,
                    upcomingEvents: statsResponse.stats.upcomingEvents || 0,
                    totalMinistries: statsResponse.stats.totalMinistries || 0,
                    monthlyDonations: statsResponse.stats.monthlyDonations || []
                });
            }

        } catch (error) {
            console.error("Error fetching admin data:", error);
            // Fallback to basic stats if dashboard stats fail
            setStats({
                totalMembers: users.filter(u => u.role === 'member').length || 0,
                totalPublicUsers: users.filter(u => u.role === 'public').length || 0,
                totalDonations: memberStats.reduce((acc, curr) => acc + curr.totalAmount, 0) || 0,
                upcomingEvents: events.length || 0,
                totalMinistries: ministries.length || 0,
                monthlyDonations: []
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmed = await toast.confirm("Are you sure? This will delete the user and ALL their data (ministries, events, etc). This cannot be undone.");
        if (confirmed) {
            try {
                await userService.deleteUser(userId);
                // Refresh data
                const updatedUsers = users.filter(u => u._id !== userId);
                setUsers(updatedUsers);
                toast.success("User deleted successfully");
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleDeleteMinistry = async (ministryId) => {
        const confirmed = await toast.confirm("Are you sure? This will delete the ministry and ALL its events. This cannot be undone.");
        if (confirmed) {
            try {
                await ministryService.deleteMinistry(ministryId);
                // Refresh data
                const updatedMinistries = ministries.filter(m => m._id !== ministryId);
                setMinistries(updatedMinistries);
                toast.success("Ministry deleted successfully");
            } catch (error) {
                toast.error("Failed to delete ministry");
            }
        }
    };

    const getPublicAttendees = (event) => {
        return event.rsvp || [];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <FiLoader className="animate-spin text-4xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 relative overflow-hidden">
            <div className="fixed inset-0 z-0">
                <img src={adminBg} alt="Background" className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/90"></div>
            </div>

            <div className="relative z-10">
                <div className="pt-12 px-6 max-w-7xl mx-auto pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Admin Dashboard</h1>
                            <p className="text-slate-400 mt-1">Manage users, view donations, and oversee events.</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => navigate('/home')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors flex items-center gap-2">
                                Main Site
                            </button>
                            <button onClick={() => navigate('/profile')} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                Profile
                            </button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl"><FiUsers size={24} /></div>
                            <div>
                                <p className="text-slate-400 text-sm">Members</p>
                                <h3 className="text-2xl font-bold">{stats.totalMembers || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-violet-500/20 text-violet-400 rounded-xl"><FiUsers size={24} /></div>
                            <div>
                                <p className="text-slate-400 text-sm">Public Users</p>
                                <h3 className="text-2xl font-bold">{stats.totalPublicUsers || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl"><FiCalendar size={24} /></div>
                            <div>
                                <p className="text-slate-400 text-sm">Upcoming Events</p>
                                <h3 className="text-2xl font-bold">{stats.upcomingEvents || 0}</h3>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl"><FiDollarSign size={24} /></div>
                            <div>
                                <p className="text-slate-400 text-sm">Total Donations</p>
                                <h3 className="text-2xl font-bold">${(stats.totalDonations || 0).toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Tabs */}
                        <div className="lg:col-span-1 space-y-2">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                            >
                                <FiUsers /> User Management
                            </button>
                            <button
                                onClick={() => setActiveTab('donations')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'donations' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                            >
                                <FiDollarSign /> Member Donations
                            </button>
                            <button
                                onClick={() => setActiveTab('events')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'events' ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/25' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                            >
                                <FiCalendar /> Event Attendees
                            </button>
                            <button
                                onClick={() => setActiveTab('ministries')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 ${activeTab === 'ministries' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/25' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
                            >
                                <FiGrid /> Ministries
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="lg:col-span-3 bg-slate-900/50 border border-white/5 rounded-2xl p-6 min-h-[500px]">

                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="animate-fade-in flex flex-col justify-center items-center h-full min-h-[500px]">
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                                        <img
                                            src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop"
                                            alt="Church Interior"
                                            className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                            <h2 className="text-3xl font-bold text-white mb-2">Welcome to Ecclesia Admin Dashboard Page</h2>
                                            <p className="text-slate-300 max-w-2xl">
                                                Manage your community, track donations, and oversee events all in one place.
                                                Select a tab from the sidebar to get started.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Users Tab */}
                            {activeTab === 'users' && (
                                <div className="animate-fade-in">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FiUsers className="text-indigo-400" /> User Management</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 text-slate-400 text-sm uppercase">
                                                    <th className="py-3 px-4">Name</th>
                                                    <th className="py-3 px-4">Email</th>
                                                    <th className="py-3 px-4">Role</th>
                                                    <th className="py-3 px-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.map(u => (
                                                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                        <td className="py-3 px-4 font-medium">{u.name}</td>
                                                        <td className="py-3 px-4 text-slate-400">{u.email}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.role === 'admin' ? 'bg-rose-500/20 text-rose-400' :
                                                                u.role === 'member' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'
                                                                }`}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            {u.role !== 'admin' && ( // Prevent deleting admins or self easily
                                                                <button
                                                                    onClick={() => handleDeleteUser(u._id)}
                                                                    className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                                                                    title="Delete User"
                                                                >
                                                                    <FiTrash2 />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Donations Tab */}
                            {activeTab === 'donations' && (
                                <div className="animate-fade-in">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FiDollarSign className="text-emerald-400" /> Member Donations</h2>

                                    {/* Recent Donations Table */}
                                    <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                                    <div className="overflow-x-auto mb-8">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/10 text-slate-400 text-sm uppercase">
                                                    <th className="py-3 px-4">Donor</th>
                                                    <th className="py-3 px-4">Amount</th>
                                                    <th className="py-3 px-4">Date</th>
                                                    <th className="py-3 px-4">Type</th>
                                                    <th className="py-3 px-4">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {donations.length === 0 ? (
                                                    <tr><td colSpan="5" className="p-4 text-center text-slate-500">No donations found.</td></tr>
                                                ) : (
                                                    donations.map(donation => (
                                                        <tr key={donation._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                            <td className="py-3 px-4 font-medium text-white">
                                                                {donation.donor ? donation.donor.name : 'Anonymous'}
                                                                <div className="text-xs text-slate-400">{donation.donor ? donation.donor.email : '-'}</div>
                                                            </td>
                                                            <td className="py-3 px-4 font-bold text-emerald-400">${donation.amount.toLocaleString()}</td>
                                                            <td className="py-3 px-4 text-slate-400">{new Date(donation.date).toLocaleDateString()}</td>
                                                            <td className="py-3 px-4"><span className="px-2 py-1 rounded-full bg-slate-800 text-slate-300 text-xs capitalize">{donation.type}</span></td>
                                                            <td className="py-3 px-4 text-slate-500 text-sm">{donation.notes || '-'}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Member Aggregate Stats */}
                                    <h3 className="text-lg font-semibold text-white mb-4">Top Contributors</h3>
                                    <div className="space-y-4">
                                        {memberStats.length === 0 ? <p className="text-slate-500">No data available.</p> : (
                                            memberStats.slice(0, 5).map((stat, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                                            {i + 1}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-white">{stat.user.name}</h3>
                                                            <p className="text-sm text-slate-400">{stat.user.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-emerald-400">${stat.totalAmount.toLocaleString()}</p>
                                                        <p className="text-xs text-slate-500">{stat.count} donations</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Events Tab */}
                            {activeTab === 'events' && (
                                <div className="animate-fade-in">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FiCalendar className="text-amber-400" /> Events & Attendees</h2>
                                    <div className="space-y-4">
                                        {events.map(event => (
                                            <div key={event._id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-amber-500/30 transition-all">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-white">{event.title}</h3>
                                                        <p className="text-slate-400 text-sm">{new Date(event.date).toLocaleDateString()} • {event.ministry ? event.ministry.name : 'General'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="block text-2xl font-bold text-amber-400">{event.rsvp?.filter(r => r.status === 'accepted').length || 0}</span>
                                                        <span className="text-xs text-slate-500 uppercase">Going</span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => setSelectedEvent(event)}
                                                    className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 transition-colors border border-white/5"
                                                >
                                                    View Attendee List
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ministries Tab */}
                            {activeTab === 'ministries' && (
                                <div className="animate-fade-in">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FiGrid className="text-cyan-400" /> Ministry Oversight</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {ministries.map(ministry => (
                                            <div key={ministry._id} className="p-5 bg-white/5 rounded-xl border border-white/5">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-white">{ministry.name}</h3>
                                                        <p className="text-slate-400 text-sm mt-1 mb-2">{ministry.description}</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-xs font-semibold bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded">Owner: {ministry.owner?.name || 'Unknown'}</span>
                                                            <span className="text-xs text-slate-500">Created: {new Date(ministry.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteMinistry(ministry._id)}
                                                        className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                                                        title="Delete Ministry"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {ministries.length === 0 && (
                                            <p className="text-slate-500 text-center py-8">No ministries found.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Attendee Modal */}
                {selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
                        <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Attendees: {selectedEvent.title}</h3>
                                <button onClick={() => setSelectedEvent(null)}><FiX className="text-slate-400 hover:text-white" size={24} /></button>
                            </div>
                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-3 flex-1">
                                {getPublicAttendees(selectedEvent).length === 0 ? (
                                    <p className="text-center text-slate-500">No attendees yet.</p>
                                ) : (
                                    getPublicAttendees(selectedEvent).map((rsvp, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                                                    {rsvp.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white flex items-center gap-2">
                                                        {rsvp.user?.name || 'Unknown User'}
                                                        {rsvp.user?.role === 'public' && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">PUBLIC</span>}
                                                    </p>
                                                    <p className="text-xs text-slate-400">{rsvp.user?.email}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded capitalize ${rsvp.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                rsvp.status === 'declined' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {rsvp.status}
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
