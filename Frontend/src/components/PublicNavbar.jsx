import { Link, useLocation } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const PublicNavbar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/80 backdrop-blur-md py-3 shadow-lg border-b border-white/5' : 'py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link to="/home" className="text-2xl font-bold text-white flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <FiHeart className="text-white fill-white" size={20} />
                    </div>
                    <span className="hidden md:inline bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Ecclesia</span>
                </Link>
                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            {/* Admin Navigation */}
                            {user.role === 'admin' ? (
                                <>
                                    <Link to="/home" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${location.pathname === '/home' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                        Home
                                    </Link>
                                    <Link to="/admin" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${location.pathname === '/admin' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                        Admin Dashboard
                                    </Link>
                                    <Link to="/profile" className="px-6 py-2.5 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 hover:-translate-y-0.5">
                                        Profile
                                    </Link>
                                </>
                            ) : user.role === 'member' ? (
                                <>
                                    {/* Member Navigation */}
                                    <Link to="/home" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${location.pathname === '/home' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                        Home
                                    </Link>
                                    <Link to="/events" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${location.pathname === '/events' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                        Events
                                    </Link>
                                    <Link to="/donations" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${location.pathname === '/donations' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                        Donations
                                    </Link>
                                    <Link to="/profile" className="px-6 py-2.5 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 hover:-translate-y-0.5">
                                        Profile
                                    </Link>
                                </>
                            ) : (
                                <>
                                    {/* Public User Navigation */}
                                    <Link to="/home" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${location.pathname === '/home' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                        Home
                                    </Link>
                                    <Link to="/events" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${location.pathname === '/events' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                        Events
                                    </Link>
                                    <Link to="/donations" className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${location.pathname === '/donations' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                                        Donations
                                    </Link>
                                    <Link to="/membership" className="px-4 py-2 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5">
                                        Become Member
                                    </Link>
                                    <Link to="/profile" className="px-6 py-2.5 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 hover:-translate-y-0.5">
                                        Profile
                                    </Link>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="px-6 py-2.5 rounded-full font-medium transition-all duration-300 text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10">
                                Sign In
                            </Link>
                            <Link to="/register" className="px-6 py-2.5 rounded-full font-medium transition-all duration-300 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-600/25 hover:shadow-amber-600/40 hover:-translate-y-0.5">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
