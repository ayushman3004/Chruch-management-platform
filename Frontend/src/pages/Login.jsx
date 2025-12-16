import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff, FiHeart, FiArrowLeft } from 'react-icons/fi';
import authBg from '../assets/backgrounds/auth_bg.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            <div className="absolute inset-0 z-0">
                <img
                    src={authBg}
                    alt="Background"
                    className="w-full h-full object-cover opacity-60 animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/60 via-slate-950/40 to-slate-950/60"></div>
            </div>

            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white font-medium py-2 px-4 bg-slate-800/40 backdrop-blur-md rounded-full border border-white/5 transition-all hover:-translate-x-1 hover:bg-slate-800/80 z-20 no-underline">
                <FiArrowLeft /> Back to Home
            </Link>

            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10 transition-all duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center text-3xl text-white mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <FiHeart />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to continue to Ecclesia</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {error && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm text-center">{error}</div>}

                    <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                        <input
                            type="email"
                            className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300">
                            <input type="checkbox" className="w-4 h-4 rounded accent-blue-500 bg-slate-800 border-white/10" />
                            <span>Remember me</span>
                        </label>
                        <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Forgot password?
                        </Link>
                    </div>

                    <button type="submit" className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center" disabled={loading}>
                        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-400 text-sm">
                    <p>
                        Don't have an account? <Link to="/register" className="text-blue-400 font-medium hover:text-blue-300 transition-colors">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
