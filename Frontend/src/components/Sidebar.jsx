import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiHome, FiHeart, FiSettings, FiChevronLeft, FiChevronRight, FiLogOut,
    FiCalendar, FiDollarSign, FiGrid
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggle }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, hasPermission } = useAuth();

    const menuItems = [
        { path: '/home', icon: FiHeart, label: 'Home', roles: ['member', 'staff', 'admin', 'public'] },
        { path: '/admin', icon: FiHome, label: 'Admin', roles: ['admin'] },
        { path: '/events', icon: FiCalendar, label: 'Events', roles: ['member', 'staff', 'admin', 'public'] },
        { path: '/donations', icon: FiDollarSign, label: 'Donations', roles: ['member', 'staff', 'admin', 'public'] },
        { path: '/ministries', icon: FiGrid, label: 'Ministries', roles: ['member'] },
        { path: '/profile', icon: FiSettings, label: 'Profile', roles: ['member', 'staff', 'admin', 'public'] }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredMenuItems = menuItems.filter(item =>
        item.roles.some(role => hasPermission(role))
    );

    return (
        <aside className={`fixed top-0 left-0 h-screen bg-slate-900 border-r border-white/10 flex flex-col transition-all duration-300 z-50 ${isOpen ? 'w-72' : 'w-20'}`}>
            <div className="flex items-center justify-between p-4 border-b border-white/10 h-16">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center text-xl text-white flex-shrink-0">
                        <FiHeart />
                    </div>
                    {isOpen && <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent whitespace-nowrap">Ecclesia</span>}
                </div>
                <button
                    className="w-8 h-8 rounded-md border border-white/10 bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all"
                    onClick={toggle}
                    aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
                </button>
            </div>

            <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
                {filteredMenuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-all relative group ${location.pathname === item.path ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        <item.icon className="text-xl flex-shrink-0" />
                        {isOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}

                        {!isOpen && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-sm rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 border border-white/10">
                                {item.label}
                            </div>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                {user && (
                    <div className={`flex items-center gap-3 p-3 bg-white/5 rounded-xl mb-3 ${isOpen ? '' : 'justify-center'}`}>
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 flex-shrink-0" />
                        {isOpen && (
                            <div className="overflow-hidden">
                                <div className="font-semibold text-sm text-white truncate">{user.name}</div>
                                <div className="text-xs text-slate-400 capitalize">{user.role}</div>
                            </div>
                        )}
                    </div>
                )}
                <button
                    className={`w-full flex items-center gap-2 p-3 rounded-xl text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 hover:border-rose-500 transition-all ${isOpen ? '' : 'justify-center'}`}
                    onClick={handleLogout}
                >
                    <FiLogOut />
                    {isOpen && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
