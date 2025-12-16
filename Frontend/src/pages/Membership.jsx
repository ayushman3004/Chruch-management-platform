import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiX, FiCreditCard, FiLoader, FiUsers, FiCalendar, FiGift, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/PublicNavbar';
import api from '../services/api';

const Membership = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const membershipFee = 100;

    const benefits = [
        { icon: FiCalendar, title: 'Exclusive Events', desc: 'Access to members-only events and workshops' },
        { icon: FiUsers, title: 'Community Groups', desc: 'Join small groups and connect deeper' },
        { icon: FiGift, title: 'Priority Support', desc: 'Get priority assistance and guidance' },
        { icon: FiStar, title: 'Member Resources', desc: 'Access to exclusive resources and materials' }
    ];

    const handleUpgrade = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'public') {
            setError('You are already a member!');
            return;
        }

        setProcessing(true);
        setError('');

        try {
            const response = await api.post('/users/upgrade-membership', {
                paymentAmount: membershipFee
            });

            if (response.data.success) {
                setSuccess(true);
                // Refresh user data to reflect new role
                await refreshUser();

                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process membership upgrade');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <PublicNavbar />

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            Become a Member
                        </h1>
                        <p className="text-xl text-slate-400">
                            Join our community and unlock exclusive benefits
                        </p>
                    </div>

                    {/* Membership Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl shadow-emerald-500/10 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Full Membership</h2>
                                <p className="text-slate-400">One-time payment for lifetime access</p>
                            </div>
                            <div className="text-center">
                                <div className="text-5xl font-bold text-emerald-400 mb-1">${membershipFee}</div>
                                <div className="text-sm text-slate-500">One-time fee</div>
                            </div>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                                    <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
                                        <benefit.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                                        <p className="text-sm text-slate-400">{benefit.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Error/Success Messages */}
                        {error && (
                            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl flex items-center gap-3 animate-fade-in">
                                <FiX /> {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3 animate-fade-in">
                                <FiCheck /> Membership upgraded successfully! Redirecting...
                            </div>
                        )}

                        {/* Payment Button */}
                        {user && user.role === 'public' ? (
                            <button
                                onClick={handleUpgrade}
                                disabled={processing || success}
                                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {processing ? (
                                    <>
                                        <FiLoader className="animate-spin" size={24} />
                                        Processing Payment...
                                    </>
                                ) : success ? (
                                    <>
                                        <FiCheck size={24} />
                                        Payment Successful!
                                    </>
                                ) : (
                                    <>
                                        <FiCreditCard size={24} />
                                        Pay ${membershipFee} & Become a Member
                                    </>
                                )}
                            </button>
                        ) : user ? (
                            <div className="text-center p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <FiCheck className="mx-auto mb-3 text-blue-400" size={48} />
                                <p className="text-blue-400 font-semibold text-lg">You're already a member!</p>
                                <p className="text-slate-400 mt-2">Enjoy all the benefits of your membership.</p>
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-white/5 border border-white/10 rounded-xl">
                                <p className="text-slate-300 mb-4">Please sign in to upgrade your membership</p>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-violet-600/40 hover:-translate-y-0.5 transition-all"
                                >
                                    Sign In
                                </button>
                            </div>
                        )}

                        <p className="text-center text-xs text-slate-500 mt-6">
                            By upgrading, you agree to our terms and conditions. Payment is processed securely.
                        </p>
                    </div>

                    {/* FAQ Section */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-xl">
                                <h4 className="text-white font-semibold mb-2">Is this a recurring payment?</h4>
                                <p className="text-slate-400 text-sm">No, this is a one-time payment for lifetime membership access.</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl">
                                <h4 className="text-white font-semibold mb-2">What happens after I pay?</h4>
                                <p className="text-slate-400 text-sm">Your account will be immediately upgraded to member status, unlocking all exclusive features.</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl">
                                <h4 className="text-white font-semibold mb-2">Can I get a refund?</h4>
                                <p className="text-slate-400 text-sm">Membership fees are non-refundable. Please contact support if you have concerns.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Membership;
