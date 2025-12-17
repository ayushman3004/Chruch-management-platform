import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHeart, FiArrowRight, FiUsers, FiCalendar, FiGift, FiActivity, FiClock, FiMapPin, FiCheck } from 'react-icons/fi';
import heroImg from '../assets/hero.png';
import homeBg from '../assets/backgrounds/home_bg.png';
import communityImg from '../assets/community.png';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import ministryService from '../services/ministryService';
import PublicNavbar from '../components/PublicNavbar';
import { useToast } from '../context/ToastContext';

const Home = () => {
    const { user } = useAuth();
    const location = useLocation();
    const toast = useToast();

    // Dashboard States
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [myMinistries, setMyMinistries] = useState([]);
    const [loadingMinistries, setLoadingMinistries] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // Fetch Events
            const eventData = await eventService.getEvents();
            if (eventData.success) {
                const upcoming = eventData.events
                    .filter(e => new Date(e.date) >= new Date())
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .slice(0, 3);
                setUpcomingEvents(upcoming);
            }
            setLoadingEvents(false);

            // Fetch Ministries (if member only)
            if (user && user.role === 'member') {
                setLoadingMinistries(true);
                const ministryData = await ministryService.getMinistries();
                if (ministryData.success) {
                    setMyMinistries(ministryData.ministries);
                }
                setLoadingMinistries(false);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            setLoadingEvents(false);
            setLoadingMinistries(false);
        }
    };

    const handleRSVP = async (eventId, status) => {
        try {
            await eventService.rsvpEvent(eventId, status);
            fetchDashboardData(); // Refresh data
            toast.success("RSVP Updated!");
        } catch (error) {
            toast.error("Failed to RSVP");
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            worship: 'bg-blue-500',
            youth: 'bg-violet-500',
            special: 'bg-amber-500',
            study: 'bg-emerald-500',
            outreach: 'bg-rose-500'
        };
        return colors[category] || 'bg-slate-500';
    };

    const features = [
        {
            icon: FiUsers,
            title: 'Vibrant Community',
            desc: 'Connect with like-minded individuals and grow together in faith groups.',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        {
            icon: FiCalendar,
            title: 'Inspiring Events',
            desc: 'Join us for weekly services, workshops, and community gatherings.',
            color: 'text-violet-400',
            bg: 'bg-violet-500/10'
        },
        {
            icon: FiGift,
            title: 'Give & Support',
            desc: 'Make a difference through secure and transparent digital giving.',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
        }
    ];


    if (user) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-200 font-sans relative overflow-hidden">
                {/* Background Image */}
                <div className="fixed inset-0 z-0">
                    <img
                        src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/13/d5/6c/a8/photo1jpg.jpg?w=900&h=500&s=1"
                        alt="Background"
                        className="w-full h-full object-cover opacity-60 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/50 to-slate-950/50"></div>
                </div>

                <div className="relative z-10">
                    <PublicNavbar />
                    <div className="max-w-7xl mx-auto space-y-12 p-6 pt-24 animate-fade-in-up">
                        {/* Welcome Header */}
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0] || 'Member'}</h1>
                                <p className="text-slate-400 mt-2">Here's what's happening in your community.</p>
                            </div>
                            <div className="flex gap-4">
                                <Link to="/donations" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center gap-2">
                                    <FiGift /> Give Now
                                </Link>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Upcoming Events Column */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <FiCalendar className="text-blue-500" /> Upcoming Events
                                    </h2>
                                    <Link to="/events" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</Link>
                                </div>

                                <div className="grid gap-4">
                                    {loadingEvents ? (
                                        <div className="text-center py-12 text-slate-500">Loading events...</div>
                                    ) : upcomingEvents.length === 0 ? (
                                        <div className="p-8 bg-slate-900/50 rounded-2xl border border-white/5 text-center text-slate-400">
                                            No upcoming events found.
                                        </div>
                                    ) : (
                                        upcomingEvents.map(event => (
                                            <div key={event._id} className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 hover:border-white/10 transition-colors">
                                                <div className={`w-full md:w-24 h-24 rounded-2xl flex-shrink-0 flex flex-col items-center justify-center text-white font-bold ${getCategoryColor(event.category)} shadow-lg`}>
                                                    <span className="text-2xl leading-none">{new Date(event.date).getDate()}</span>
                                                    <span className="text-xs uppercase leading-none mt-1">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                                        <div>
                                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${getCategoryColor(event.category).replace('bg-', 'bg-opacity-20 text-') + ' ' + getCategoryColor(event.category).replace('bg-', 'bg-') + '/20'}`}>
                                                                {event.category}
                                                            </span>
                                                            <h3 className="text-lg font-bold text-white">{event.title}</h3>
                                                        </div>
                                                        {/* RSVP Check */}
                                                        {event.rsvp && event.rsvp.find(r => (r.user?._id || r.user) === (user.id || user._id)) ? (
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                                                                <FiCheck /> Going
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleRSVP(event._id, 'accepted')}
                                                                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg border border-white/10 transition-all"
                                                            >
                                                                Join Event
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-400 text-sm mt-2 line-clamp-2">{event.description}</p>
                                                    <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                                                        <div className="flex items-center gap-1.5"><FiClock /> {event.time}</div>
                                                        <div className="flex items-center gap-1.5"><FiMapPin /> {event.location}</div>
                                                        <div className="flex items-center gap-1.5"><FiUsers /> {event.rsvp ? event.rsvp.length : 0} Attending</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Sidebar: Donations & Ministries */}
                            <div className="space-y-8">
                                {/* Donation Callout */}
                                <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <FiGift size={100} className="text-amber-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 relative z-10">Make a Difference</h3>
                                    <p className="text-slate-400 text-sm mb-6 relative z-10">Your generosity supports our mission and community outreach programs.</p>
                                    <Link to="/donations" className="block w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-center font-bold rounded-xl transition-colors relative z-10">
                                        Donate Today
                                    </Link>
                                </div>

                                {/* Members Section (Ministries Placeholder) */}
                                {/* Members Section (Ministries) */}
                                {user.role === 'member' && (
                                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <FiActivity className="text-emerald-500" /> My Ministries
                                        </h3>

                                        {loadingMinistries ? (
                                            <div className="text-center py-8 text-slate-500">Loading...</div>
                                        ) : myMinistries.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-500">
                                                    <FiUsers />
                                                </div>
                                                <p className="text-slate-400 text-sm mb-4">You haven't joined any ministries yet.</p>
                                                <Link to="/ministries" className="text-emerald-400 text-sm font-medium hover:text-emerald-300">Browse Ministries &rarr;</Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {myMinistries.map(ministry => (
                                                    <div key={ministry._id} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                                        <Link to="/ministries" className="block">
                                                            <h4 className="font-bold text-white text-sm">{ministry.name}</h4>
                                                            <p className="text-xs text-slate-400 line-clamp-1 mt-1">{ministry.description}</p>
                                                            <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400">
                                                                <span>Access Workspace</span> <FiArrowRight size={10} />
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))}
                                                <Link to="/ministries" className="block text-center text-sm text-slate-400 hover:text-white mt-4 border-t border-white/5 pt-3">
                                                    View All
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Quick Links for Members/Admins */}
                                {(user.role === 'member' || user.role === 'admin') && (
                                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
                                        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                                        <div className="space-y-2">
                                            <Link to="/events" className="block w-full py-2 px-4 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
                                                Manage Events
                                            </Link>
                                            <Link to="/profile" className="block w-full py-2 px-4 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
                                                Edit Profile
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans bg-slate-950 text-slate-200">
            <PublicNavbar />

            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <img src="https://www.newhollandwood.com/wp-content/uploads/2019/10/1-Monastery-of-the-Holy-Cross-Chicago.jpg" alt="Modern Church" className="w-full h-full object-cover scale-105 animate-slow-zoom" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/80 to-slate-950"></div>
                </div>

                {/* Animated Background Orbs */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] animate-float"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-float-reverse"></div>
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm font-medium backdrop-blur-sm mb-4">
                        <span className="flex h-2 w-2 rounded-full bg-violet-400 animate-pulse"></span>
                        Welcome to a new experience
                    </div>
                    <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight text-white leading-tight">
                        Faith That <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Moves</span><br />
                        Love That <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Grows</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
                        Join a vibrant community dedicated to making a difference.
                        Experience connection, purpose, and spiritual growth in a modern world.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-bold rounded-full text-lg shadow-xl shadow-white/10 hover:bg-slate-100 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                            Join Our Community <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 px-6 relative z-10 bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">More Than Just a Church</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            We provide the tools and supportive environment you need to grow in your journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="group p-8 rounded-3xl bg-slate-900 border border-white/5 hover:border-white/10 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`${feature.color} text-2xl`} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed theme-transition">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Welcome Section */}
            <section className="py-24 px-6 bg-slate-900 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold tracking-wide uppercase">
                            Our Mission
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                            A Place for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Everyone</span>
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            At Ecclesia, we believe in the power of community. Whether you're exploring faith for the first time or looking for a new home, you are welcome here.
                        </p>
                        <div className="flex gap-8 border-t border-white/10 pt-8">
                            <div>
                                <div className="text-4xl font-bold text-white mb-1">5k+</div>
                                <div className="text-slate-400 text-sm">Members</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-white mb-1">120+</div>
                                <div className="text-slate-400 text-sm">Events/Year</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-white mb-1">30+</div>
                                <div className="text-slate-400 text-sm">Ministries</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl transform rotate-6 scale-95"></div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
                            <img src="https://wallpapers.com/images/featured/jesus-christ-pictures-k9zma9r88k98f74o.jpg" alt="Community Gathering" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-8">
                                <div className="text-white">
                                    <p className="font-semibold text-lg">Sunday Gathering</p>
                                    <p className="text-slate-300 text-sm">Every Sunday at 10:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 bg-slate-950 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950"></div>
                <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">Ready to join our family?</h2>
                    <p className="text-xl text-slate-400">
                        Take the first step towards a journey of faith, hope, and community.
                    </p>
                    <Link to="/register" className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-full text-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-1 transition-all duration-300">
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 border-t border-white/5 py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <div className="text-2xl font-bold text-white flex items-center gap-2">
                            <FiHeart className="text-violet-500" />
                            <span>Ecclesia</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Building a community of faith, hope, and love for everyone, everywhere.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Community</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Ministries</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sermons</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">New Visitor</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Care & Prayer</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Give</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Connect</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-white/5 pt-8 text-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Ecclesia Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
export default Home;
