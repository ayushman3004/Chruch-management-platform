import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiHeart, FiPhone, FiArrowLeft } from 'react-icons/fi';
import authBg from '../assets/backgrounds/auth_bg.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const result = await register(formData);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        return { strength, label: labels[strength] };
    };

    const passwordStrength = getPasswordStrength();

    const getStrengthColor = (level) => {
        if (level === 1) return 'bg-rose-500';
        if (level === 2) return 'bg-amber-500';
        if (level === 3) return 'bg-blue-500';
        if (level === 4) return 'bg-emerald-500';
        return 'bg-slate-700';
    };

    const getStrengthTextColor = (level) => {
        if (level === 1) return 'text-rose-500';
        if (level === 2) return 'text-amber-500';
        if (level === 3) return 'text-blue-500';
        if (level === 4) return 'text-emerald-500';
        return 'text-slate-500';
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 z-0">
                <img
                    src={authBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-60 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/60"></div>
            </div>

            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white font-medium py-2 px-4 bg-slate-800/40 backdrop-blur-md rounded-full border border-white/5 transition-all hover:-translate-x-1 hover:bg-slate-800/80 z-20 no-underline">
                <FiArrowLeft /> Back to Home
            </Link>

            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 transition-all duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center text-3xl text-white mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <FiHeart />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Join Our Community</h1>
                    <p className="text-slate-400">Create your Ecclesia account</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm text-center">{error}</div>}

                    <div className="relative">
                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                        <input
                            type="text"
                            name="name"
                            className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="relative">
                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                        <input
                            type="tel"
                            name="phone"
                            className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    {formData.password && (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-1 gap-1">
                                {[1, 2, 3, 4].map((level) => (
                                    <div
                                        key={level}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${passwordStrength.strength >= level ? getStrengthColor(passwordStrength.strength) : 'bg-slate-700'}`}
                                    />
                                ))}
                            </div>
                            <span className={`text-xs font-medium w-12 text-right transition-colors duration-300 ${getStrengthTextColor(passwordStrength.strength)}`}>
                                {passwordStrength.label}
                            </span>
                        </div>
                    )}

                    <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={loading}>
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-400 text-sm">
                    <p>
                        Already have an account? <Link to="/login" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
