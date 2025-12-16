import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiUsers, FiTrendingUp, FiHeart, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import donateBg from '../assets/backgrounds/donate_bg.png';
import { useAuth } from '../context/AuthContext';
import donationService from '../services/donationService';
import PublicNavbar from '../components/PublicNavbar';

const Donations = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalAmount: 0,
        totalDonations: 0,
        totalDonors: 0,
        recentDonations: []
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        amount: '',
        type: 'offering',
        message: '',
        paymentMethod: 'online'
    });

    useEffect(() => {
        fetchStats();
    }, []); // Only fetch once on mount

    const fetchStats = async () => {
        try {
            if (!loading) setRefreshing(true);
            const data = await donationService.getDonationStats();
            if (data.success) {
                setStats(data.stats);
                setError(''); // Clear any previous errors
            }
        } catch (err) {
            console.error('Failed to fetch donation stats', err);
            // Only show error on initial load, not background refresh
            if (loading) {
                setError('Failed to load donation statistics. Please try refreshing the page.');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess(false);

        try {
            const donationAmount = parseFloat(formData.amount);
            const data = await donationService.createDonation({
                ...formData,
                amount: donationAmount
            });

            if (data.success) {
                setSuccess(true);

                // Immediately update stats optimistically
                setStats(prevStats => ({
                    totalAmount: prevStats.totalAmount + donationAmount,
                    totalDonations: prevStats.totalDonations + 1,
                    totalDonors: prevStats.totalDonors, // Will be updated by server
                    recentDonations: [
                        {
                            ...data.donation,
                            donor: { name: user?.name || 'You' }
                        },
                        ...prevStats.recentDonations.slice(0, 9)
                    ]
                }));

                // Reset form
                setFormData({
                    amount: '',
                    type: 'offering',
                    message: '',
                    paymentMethod: 'online'
                });

                // Fetch fresh stats from server to ensure accuracy
                setTimeout(() => {
                    fetchStats();
                }, 500);

                // Hide success message after 3 seconds
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit donation');
        } finally {
            setSubmitting(false);
        }
    };

    const donationTypes = {
        tithe: { label: 'Tithe', color: 'bg-blue-500', icon: '🙏' },
        offering: { label: 'Offering', color: 'bg-emerald-500', icon: '💝' },
        mission: { label: 'Mission', color: 'bg-violet-500', icon: '🌍' },
        charity: { label: 'Charity', color: 'bg-amber-500', icon: '🏛️' },
        other: { label: 'Other', color: 'bg-slate-500', icon: '❤️' }
    };

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img
                    src={donateBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-60 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/50 to-slate-950/50"></div>
            </div>

            <div className="relative z-10">
                <PublicNavbar />

                <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pt-24 px-6 pb-12">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-white">Make a Difference</h1>
                            {refreshing && (
                                <div className="flex items-center gap-2 text-blue-400 text-sm">
                                    <FiLoader className="animate-spin" />
                                    <span className="hidden md:inline">Updating...</span>
                                </div>
                            )}
                        </div>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Your generosity supports our mission and helps us serve the community</p>
                    </div>

                    {/* Stats Cards */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-500/10 to-violet-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                        <FiDollarSign className="text-blue-400 text-2xl" />
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">${stats.totalAmount.toLocaleString()}</div>
                                <div className="text-blue-200 text-sm font-medium">Total Donations</div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                        <FiTrendingUp className="text-emerald-400 text-2xl" />
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">{stats.totalDonations}</div>
                                <div className="text-emerald-200 text-sm font-medium">Total Contributions</div>
                            </div>

                            <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex items-center justify-center">
                                        <FiUsers className="text-violet-400 text-2xl" />
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">{stats.totalDonors}</div>
                                <div className="text-violet-200 text-sm font-medium">Generous Donors</div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Donation Form */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Donate Now</h2>

                            {success && (
                                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3">
                                    <FiCheck className="text-xl flex-shrink-0" />
                                    <span>Thank you for your generous donation! 🙏</span>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3">
                                    <FiX className="text-xl flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Donation Amount ($)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        step="0.01"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        placeholder="Enter amount"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-3">Donation Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(donationTypes).map(([key, value]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: key })}
                                                className={`p-4 rounded-xl border-2 transition-all duration-300 ${formData.type === key
                                                    ? `${value.color} border-white/30 shadow-lg`
                                                    : 'bg-slate-800/50 border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-2">{value.icon}</div>
                                                <div className="text-white font-medium text-sm">{value.label}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Payment Method</label>
                                    <select
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="online">Online Payment</option>
                                        <option value="card">Credit/Debit Card</option>
                                        <option value="cash">Cash</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Message (Optional)</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="3"
                                        maxLength="500"
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                        placeholder="Add a message (optional)"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <FiLoader className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FiHeart />
                                            Donate Now
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Recent Donations */}
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Recent Donations</h2>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : stats.recentDonations.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <FiHeart className="mx-auto text-4xl mb-3 opacity-50" />
                                    <p>No donations yet. Be the first to contribute!</p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                    {stats.recentDonations.map((donation, index) => (
                                        <div key={donation._id || index} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 ${donationTypes[donation.type]?.color || 'bg-slate-500'} rounded-lg flex items-center justify-center text-xl`}>
                                                        {donationTypes[donation.type]?.icon || '❤️'}
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold">{donation.donor?.name || 'Anonymous'}</div>
                                                        <div className="text-slate-400 text-xs">{donationTypes[donation.type]?.label || 'Donation'}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-emerald-400 font-bold text-lg">${donation.amount.toLocaleString()}</div>
                                                    <div className="text-slate-500 text-xs">{new Date(donation.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            {donation.message && (
                                                <div className="mt-2 text-slate-300 text-sm italic pl-13">"{donation.message}"</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donations;
