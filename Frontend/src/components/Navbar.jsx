import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiSearch } from 'react-icons/fi';

const Navbar = ({ sidebarOpen, onMenuClick }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <header className={`fixed top-0 right-0 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 z-40 transition-all duration-300 ${sidebarOpen ? 'left-72' : 'left-20'}`}>
            <div className="flex items-center gap-4">
                <button className="lg:hidden w-10 h-10 rounded-lg bg-white/5 text-slate-200 flex items-center justify-center hover:bg-slate-800 transition-colors" onClick={onMenuClick}>
                    <FiMenu />
                </button>
                <div className="hidden md:block relative w-96">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search members, events, ministries..."
                        className="w-full py-2.5 px-4 pl-10 bg-white/5 border border-white/10 rounded-full text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:bg-slate-800 transition-all placeholder-slate-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <button
                        onClick={handleProfileClick}
                        className="px-4 py-2 bg-white/5 rounded-full hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/10 cursor-pointer group"
                    >
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{user.name}</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
