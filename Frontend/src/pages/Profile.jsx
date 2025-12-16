import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiSave, FiCamera, FiLoader, FiShield, FiAlertCircle, FiCheck, FiLogOut } from 'react-icons/fi';
import userService from '../services/userService';
import PublicNavbar from '../components/PublicNavbar';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        gender: '',
        birthday: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });



    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getUserProfile();
                if (data && data.user) {
                    setFormData(prev => ({
                        ...prev,
                        name: data.user.name || '',
                        email: data.user.email || '',
                        phone: data.user.phone || '',
                        street: data.user.address?.street || '',
                        city: data.user.address?.city || '',
                        state: data.user.address?.state || '',
                        zip: data.user.address?.postalCode || '',
                        country: data.user.address?.country || '',
                        gender: data.user.gender || '',
                        birthday: data.user.birthday ? new Date(data.user.birthday).toISOString().split('T')[0] : '',
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
                setMessage({ type: 'error', text: 'Failed to load profile data.' });
            } finally {
                setFetching(false);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error messages when user types
        if (message.type === 'error') setMessage({ type: '', text: '' });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const updateData = {
                name: formData.name,
                phone: formData.phone,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    postalCode: formData.zip,
                    country: formData.country
                },
                gender: formData.gender || undefined,
                birthday: formData.birthday || undefined
            };

            const response = await userService.updateUserProfile(updateData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        if (!formData.currentPassword) {
            setMessage({ type: 'error', text: 'Current password is required' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const updateData = {
                oldPassword: formData.currentPassword,
                newPassword: formData.newPassword
            };

            await userService.updateUserProfile(updateData);
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FiUser },
        { id: 'security', label: 'Security', icon: FiShield }
    ];

    if (fetching) {
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
                    src="https://images.unsplash.com/photo-1519681393798-38e43269d496?q=80&w=2670&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-20 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/90"></div>
            </div>

            <div className="relative z-10">
                <PublicNavbar />
                <div className="max-w-6xl mx-auto px-6 pt-24 pb-12 space-y-8 animate-fade-in-up">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                            <p className="text-slate-400 mt-1">Manage your personal information and security preferences.</p>
                        </div>
                        <button
                            onClick={async () => {
                                const confirmed = await toast.confirm('Are you sure you want to logout?');
                                if (confirmed) {
                                    logout();
                                    navigate('/login');
                                }
                            }}
                            className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 flex items-center gap-2"
                        >
                            <FiLogOut />
                            Logout
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2 sticky top-24">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${activeTab === tab.id
                                            ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/25'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <tab.icon className="text-lg" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Message Toast */}
                            {message.text && (
                                <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'error'
                                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                    }`}>
                                    {message.type === 'error' ? <FiAlertCircle /> : <FiCheck />}
                                    {message.text}
                                </div>
                            )}

                            {/* Profile Information Tab */}
                            {activeTab === 'profile' && (
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-800 ring-2 ring-blue-500/50">
                                                <img
                                                    src={user?.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=random`}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg hover:bg-blue-500 transition-colors">
                                                <FiCamera size={16} />
                                            </button>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">{formData.name || 'User'}</h2>
                                            <p className="text-slate-400">{formData.email}</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    disabled
                                                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                    placeholder="(555) 000-0000"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Address Street</label>
                                                <input
                                                    type="text"
                                                    name="street"
                                                    value={formData.street}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                    placeholder="123 Main St"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 col-span-1 md:col-span-2">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={formData.city}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                        placeholder="City"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300">State</label>
                                                    <input
                                                        type="text"
                                                        name="state"
                                                        value={formData.state}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                        placeholder="State"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300">Zip Code</label>
                                                    <input
                                                        type="text"
                                                        name="zip"
                                                        value={formData.zip}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                        placeholder="Zip"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300">Country</label>
                                                    <input
                                                        type="text"
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                        placeholder="Country"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Birthday</label>
                                                <input
                                                    type="date"
                                                    name="birthday"
                                                    value={formData.birthday}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all calendar-picker-indicator-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Gender</label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                >
                                                    <option value="">Select Gender</option>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                    <option value="prefer_not_to_say">Prefer not to say</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                                            >
                                                {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1">Security Settings</h2>
                                        <p className="text-slate-400 text-sm">Update your password and secure your account</p>
                                    </div>

                                    <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-2xl">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-slate-300">Current Password</label>
                                                <div className="relative">
                                                    <input
                                                        type="password"
                                                        name="currentPassword"
                                                        value={formData.currentPassword}
                                                        onChange={handleInputChange}
                                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                        placeholder="Enter current password"
                                                    />
                                                    <FiLock className="absolute left-3.5 top-3.5 text-slate-500" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300">New Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type="password"
                                                            name="newPassword"
                                                            value={formData.newPassword}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                            placeholder="Enter new password"
                                                        />
                                                        <FiLock className="absolute left-3.5 top-3.5 text-slate-500" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-slate-300">Confirm New Password</label>
                                                    <div className="relative">
                                                        <input
                                                            type="password"
                                                            name="confirmPassword"
                                                            value={formData.confirmPassword}
                                                            onChange={handleInputChange}
                                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                                            placeholder="Confirm new password"
                                                        />
                                                        <FiLock className="absolute left-3.5 top-3.5 text-slate-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                                            >
                                                {loading ? <FiLoader className="animate-spin" /> : <FiShield />}
                                                Update Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
