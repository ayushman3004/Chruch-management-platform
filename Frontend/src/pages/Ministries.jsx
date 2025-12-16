import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiCalendar, FiMapPin, FiClock, FiX, FiCheck, FiLoader } from 'react-icons/fi';
import ministriesBg from '../assets/backgrounds/ministries_bg.png';
import ministryService from '../services/ministryService';
import eventService from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/PublicNavbar';

const Ministries = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [ministries, setMinistries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMinistry, setActiveMinistry] = useState(null);
    const [showMinistryModal, setShowMinistryModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);

    // Ministry Form State
    const [ministryForm, setMinistryForm] = useState({ name: '', description: '' });

    // Event Form State
    const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', time: '', location: '' });

    // Events in Active Ministry
    const [ministryEvents, setMinistryEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(false);

    // Viewing RSVPs
    const [selectedEventRSVPs, setSelectedEventRSVPs] = useState(null);

    useEffect(() => {
        if (user && user.role === 'member') {
            fetchMyMinistries();
        } else if (user && user.role !== 'member') {
            setLoading(false); // Stop loading to show access denied
        }
    }, [user]);

    const fetchMyMinistries = async () => {
        try {
            setLoading(true);
            const data = await ministryService.getMinistries(); // Backend now returns only MY ministries
            if (data.success) {
                setMinistries(data.ministries);
            }
        } catch (error) {
            console.error("Failed to fetch ministries", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMinistryEvents = async (ministryId) => {
        try {
            setEventsLoading(true);
            const data = await eventService.getEvents({ ministry: ministryId });
            if (data.success) {
                setMinistryEvents(data.events);
            }
        } catch (error) {
            console.error("Failed to fetch events", error);
        } finally {
            setEventsLoading(false);
        }
    };

    const handleCreateMinistry = async (e) => {
        e.preventDefault();
        try {
            await ministryService.createMinistry(ministryForm);
            setShowMinistryModal(false);
            setMinistryForm({ name: '', description: '' });
            fetchMyMinistries();
        } catch (error) {
            alert("Failed to create ministry: " + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteMinistry = async (id) => {
        if (!window.confirm("Are you sure? This will delete all events associated with this ministry!")) return;
        try {
            await ministryService.deleteMinistry(id);
            if (activeMinistry?._id === id) setActiveMinistry(null);
            fetchMyMinistries();
        } catch (error) {
            alert("Failed to delete ministry");
        }
    };

    const handleEnterWorkspace = (ministry) => {
        setActiveMinistry(ministry);
        fetchMinistryEvents(ministry._id);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const dateObj = new Date(eventForm.date + 'T' + eventForm.time);
            await eventService.createEvent({
                ...eventForm,
                date: dateObj,
                ministry: activeMinistry._id
            });
            setShowEventModal(false);
            setEventForm({ title: '', description: '', date: '', time: '', location: '' });
            fetchMinistryEvents(activeMinistry._id);
        } catch (error) {
            alert("Failed to create event: " + (error.response?.data?.message || error.message));
        }
    };

    const handleViewRSVPs = async (eventId) => {
        // Fetch specific event details to get populated RSVPs (restricted to owner)
        try {
            const data = await eventService.getEvent(eventId);
            if (data.success) {
                setSelectedEventRSVPs(data.event);
            }
        } catch (error) {
            alert("Failed to load RSVPs");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Access Restricted</h2>
                    <p className="mb-4">Please log in as a member to access My Ministries.</p>
                    <button onClick={() => navigate('/login')} className="px-6 py-2 bg-blue-600 rounded-lg">Log In</button>
                </div>
            </div>
        );
    }

    if (user.role !== 'member') {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <PublicNavbar />
                <div className="text-center text-white pt-20">
                    <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
                    <p>Only Members can manage ministries directly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <img src={ministriesBg} alt="Background" className="w-full h-full object-cover opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-slate-950/90"></div>
            </div>

            <div className="relative z-10">
                <PublicNavbar />
                <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            {activeMinistry ? (
                                <button onClick={() => setActiveMinistry(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-2">
                                    <FiArrowLeft /> Back to Ministries
                                </button>
                            ) : (
                                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Workspace</p>
                            )}
                            <h1 className="text-3xl font-bold text-white">
                                {activeMinistry ? activeMinistry.name : 'My Ministries'}
                            </h1>
                        </div>

                        {!activeMinistry && (
                            <button
                                onClick={() => setShowMinistryModal(true)}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 transition-all"
                            >
                                <FiPlus /> New Ministry
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-white text-3xl" /></div>
                    ) : (
                        <>
                            {!activeMinistry ? (
                                /* Ministry List View */
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {ministries.length === 0 ? (
                                        <div className="col-span-full text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                                            <FiUsers className="mx-auto text-4xl text-slate-600 mb-4" />
                                            <h3 className="text-xl font-medium text-white">No Ministries Yet</h3>
                                            <p className="text-slate-400 mt-2 mb-6">Create a ministry to start managing your private workspace.</p>
                                            <button onClick={() => setShowMinistryModal(true)} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
                                                Create Your First Ministry
                                            </button>
                                        </div>
                                    ) : (
                                        ministries.map(ministry => (
                                            <div key={ministry._id} className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                                                        <FiUsers size={24} />
                                                    </div>
                                                    <button onClick={() => handleDeleteMinistry(ministry._id)} className="p-2 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-colors" title="Delete Ministry">
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">{ministry.name}</h3>
                                                <p className="text-slate-400 text-sm line-clamp-2 mb-6">{ministry.description}</p>
                                                <button
                                                    onClick={() => handleEnterWorkspace(ministry)}
                                                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/5 group-hover:border-indigo-500/30"
                                                >
                                                    Enter Workspace
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                /* Active Ministry Workspace */
                                <div className="space-y-8 animate-fade-in">
                                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-8">
                                        <h2 className="text-xl font-bold text-white mb-4">About this Workspace</h2>
                                        <p className="text-slate-300">{activeMinistry.description}</p>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <FiCalendar className="text-indigo-400" /> Ministry Events
                                        </h2>
                                        <button
                                            onClick={() => setShowEventModal(true)}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg flex items-center gap-2"
                                        >
                                            <FiPlus /> Create Event
                                        </button>
                                    </div>

                                    {eventsLoading ? (
                                        <div className="py-10 text-center"><FiLoader className="animate-spin text-white inline text-2xl" /></div>
                                    ) : (
                                        <div className="space-y-4">
                                            {ministryEvents.length === 0 ? (
                                                <p className="text-slate-500 text-center py-8">No events created yet.</p>
                                            ) : (
                                                ministryEvents.map(event => (
                                                    <div key={event._id} className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-white">{event.title}</h3>
                                                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                                                                <span className="flex items-center gap-1"><FiCalendar /> {new Date(event.date).toLocaleDateString()}</span>
                                                                <span className="flex items-center gap-1"><FiClock /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                <span className="flex items-center gap-1"><FiMapPin /> {event.location}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => handleViewRSVPs(event._id)}
                                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                                                            >
                                                                View RSVPs
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Ministry Modal */}
            {showMinistryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowMinistryModal(false)}>
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">Create New Ministry</h3>
                        <form onSubmit={handleCreateMinistry} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                                <input required type="text" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={ministryForm.name} onChange={e => setMinistryForm({ ...ministryForm, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea required rows="3" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={ministryForm.description} onChange={e => setMinistryForm({ ...ministryForm, description: e.target.value })}></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowMinistryModal(false)} className="flex-1 py-2 bg-white/5 text-white rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowEventModal(false)}>
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-white mb-4">Create Event</h3>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                                <input required type="text" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Date</label>
                                    <input required type="date" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={eventForm.date} onChange={e => setEventForm({ ...eventForm, date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Time</label>
                                    <input required type="time" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={eventForm.time} onChange={e => setEventForm({ ...eventForm, time: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                                <input required type="text" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={eventForm.location} onChange={e => setEventForm({ ...eventForm, location: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea required rows="3" className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2 text-white" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })}></textarea>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowEventModal(false)} className="flex-1 py-2 bg-white/5 text-white rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* RSVP View Modal */}
            {selectedEventRSVPs && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedEventRSVPs(null)}>
                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">RSVP List: {selectedEventRSVPs.title}</h3>
                            <button onClick={() => setSelectedEventRSVPs(null)} className="text-slate-400 hover:text-white"><FiX size={24} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                            {selectedEventRSVPs.rsvp && selectedEventRSVPs.rsvp.length > 0 ? (
                                selectedEventRSVPs.rsvp.map((r, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                                                {r.user?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{r.user?.name || 'Unknown'}</p>
                                                <p className="text-xs text-slate-400">{r.user?.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${r.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                                                r.status === 'declined' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                                            }`}>
                                            {r.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-slate-500 py-8">No RSVPs yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ministries;
