import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiChevronLeft, FiChevronRight, FiX, FiCheck, FiLoader, FiFilter, FiEdit2, FiTrash2, FiTag, FiAlignLeft, FiType } from 'react-icons/fi';
import eventsBg from '../assets/backgrounds/events_bg.png';
import eventService from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import PublicNavbar from '../components/PublicNavbar';

const Events = () => {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [eventsList, setEventsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        location: '',
        category: 'worship',
        description: ''
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await eventService.getEvents();
            if (data.success) {
                setEventsList(data.events);
            }
        } catch (err) {
            console.error("Failed to fetch events", err);
            setError("Failed to load events.");
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startingDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const getEventsForDay = (day) => {
        if (!day) return [];
        return eventsList.filter(e => {
            const eventDate = new Date(e.date);
            return eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsEditing(false);
        setShowModal(true);
        setError('');
    };

    // "Create Event" function is removed as events are now created in Ministry workspace.
    // handleAddEvent logic removed.

    const handleEditClick = () => {
        if (!selectedEvent) return;
        setFormData({
            title: selectedEvent.title,
            date: new Date(selectedEvent.date).toISOString().split('T')[0],
            time: selectedEvent.time,
            location: selectedEvent.location,
            category: selectedEvent.category,
            description: selectedEvent.description
        });
        setIsEditing(true);
        setError('');
    };

    const handleDeleteClick = async () => {
        if (!selectedEvent || !window.confirm("Are you sure you want to delete this event?")) return;

        setSubmitting(true);
        try {
            await eventService.deleteEvent(selectedEvent._id);
            await fetchEvents();
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete event");
            setSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (selectedEvent && isEditing) {
                await eventService.updateEvent(selectedEvent._id, formData);
            }
            // Creation is not handled here anymore
            await fetchEvents();
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save event");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRSVP = async (status) => {
        if (!selectedEvent) return;
        if (!user) {
            // Redirect or show error if not logged in?
            // Assuming AuthContext handles user state well.
            alert("Please log in to RSVP");
            return;
        }
        setSubmitting(true);
        try {
            await eventService.rsvpEvent(selectedEvent._id, status);
            await fetchEvents();
            // Update local state
            const updatedEvent = { ...selectedEvent };
            if (!updatedEvent.rsvp) updatedEvent.rsvp = [];
            updatedEvent.rsvp = updatedEvent.rsvp.filter(r => r.user !== user?._id); // removed old status

            // Note: We don't have the full User object to push here, just the ID, unless we refetch.
            // But for the count in the UI, we just need the entry.
            // The attendee list is purely View Only for owner anyway.
            updatedEvent.rsvp.push({ user: user._id, status });

            setSelectedEvent(updatedEvent);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update RSVP");
        } finally {
            setSubmitting(false);
        }
    };

    const canEdit = (event) => {
        if (!user || !event) return false;
        if (user.role === 'admin') return true; // Admins can edit anything? Usually yes.
        const organizerId = event.organizer?._id || event.organizer;
        return organizerId === user.id;
    };

    // Helper to safely get user name from RSVP object which might not be populated
    const getRsvpName = (r) => {
        if (r.user && r.user.name) return r.user.name;
        return "Unknown User";
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

    const days = getDaysInMonth(currentDate);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const upcomingEvents = [...eventsList]
        .filter(e => new Date(e.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] bg-slate-950">
                <FiLoader className="animate-spin text-blue-500 text-3xl" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-x-hidden">
            <div className="fixed inset-0 z-0">
                <img src={eventsBg} alt="Background" className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950/80"></div>
            </div>

            <div className="relative z-10">
                <PublicNavbar />

                <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up pt-24 px-6 pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Events</h1>
                            <p className="text-slate-400 mt-1">Manage and participate in church activities</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Calendar Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-bold text-white">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => navigateMonth(-1)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"><FiChevronLeft size={20} /></button>
                                        <button onClick={() => navigateMonth(1)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"><FiChevronRight size={20} /></button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-px bg-slate-800/50 rounded-lg overflow-hidden border border-white/5">
                                    {dayNames.map(day => (
                                        <div key={day} className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-950/30">{day}</div>
                                    ))}
                                    {days.map((day, index) => {
                                        const dayEvents = getEventsForDay(day);
                                        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
                                        return (
                                            <div key={index} className={`min-h-[100px] p-2 bg-slate-950/10 hover:bg-slate-950/30 transition-colors border-t border-white/5 ${!day ? 'bg-slate-950/20' : ''}`}>
                                                {day && (
                                                    <>
                                                        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50' : 'text-slate-400'}`}>{day}</span>
                                                        <div className="space-y-1">
                                                            {dayEvents.slice(0, 3).map(event => {
                                                                const acceptedCount = event.rsvp?.filter(r => r.status === 'accepted').length || 0;
                                                                return (
                                                                    <button key={event._id} onClick={() => handleEventClick(event)} className={`w-full text-left px-2 py-1 rounded text-xs text-white ${getCategoryColor(event.category).replace('bg-', 'bg-opacity-20 text-') + ' ' + getCategoryColor(event.category).replace('bg-', 'bg-') + '/20'} hover:opacity-80 transition-opacity`}>
                                                                        <div className="flex items-center justify-between gap-1">
                                                                            <span className="truncate">{event.title}</span>
                                                                            {acceptedCount > 0 && <span className="flex items-center gap-0.5 text-[10px] opacity-75 flex-shrink-0"><FiUsers size={10} /> {acceptedCount}</span>}
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                            {dayEvents.length > 3 && <span className="text-xs text-slate-500 px-2 block">+{dayEvents.length - 3} more</span>}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><FiCalendar className="text-blue-500" /> Upcoming Events</h3>
                                <div className="space-y-4">
                                    {upcomingEvents.length === 0 ? <p className="text-slate-500 text-center py-4">No upcoming events</p> : upcomingEvents.map(event => (
                                        <div key={event._id} onClick={() => handleEventClick(event)} className="group cursor-pointer p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-300">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex flex-col items-center justify-center text-white font-bold ${getCategoryColor(event.category)} shadow-lg`}>
                                                    <span className="text-lg leading-none">{new Date(event.date).getDate()}</span>
                                                    <span className="text-[10px] uppercase leading-none mt-0.5">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-white font-medium group-hover:text-blue-400 transition-colors truncate">{event.title}</h4>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1"><FiClock /> {event.time}</div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5"><FiMapPin /> {event.location}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
                                {error && <div className="mx-6 mt-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm flex items-center gap-2"><FiX /> {error}</div>}

                                {selectedEvent && !isEditing ? (
                                    <>
                                        <div className={`relative p-8 overflow-hidden ${getCategoryColor(selectedEvent.category)}`}>
                                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-20 backdrop-blur-md"><FiX size={20} /></button>
                                            <div className="relative z-10 pt-4">
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                                                    {selectedEvent.category}
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-sm">{selectedEvent.title}</h3>
                                                <div className="flex flex-wrap items-center gap-4 text-white/90 mt-4">
                                                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5"><FiCalendar className="text-blue-400" /><span className="font-medium">{new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span></div>
                                                    <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5"><FiClock className="text-emerald-400" /><span className="font-medium">{selectedEvent.time}</span></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-6">
                                            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                                                <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/10"><FiMapPin size={24} /></div>
                                                <div><h4 className="text-white font-medium text-lg">Location</h4><p className="text-slate-400 text-sm mt-0.5 leading-relaxed">{selectedEvent.location}</p></div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">About This Event</h4>
                                                <p className="text-slate-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">{selectedEvent.description}</p>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                {/* Attendees Count */}
                                                <div className="flex items-center gap-2">
                                                    <FiUsers />
                                                    <span>{selectedEvent.rsvp?.filter(r => r.status === 'accepted').length || 0} Attending</span>
                                                </div>

                                                {canEdit(selectedEvent) && (
                                                    <div className="flex gap-2">
                                                        <button onClick={handleEditClick} className="p-2.5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10" title="Edit Event"><FiEdit2 size={18} /></button>
                                                        <button onClick={handleDeleteClick} className="p-2.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-xl transition-all border border-transparent hover:border-rose-500/20" title="Delete Event"><FiTrash2 size={18} /></button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Attendee List - Only for owner */}
                                            {selectedEvent.rsvp && selectedEvent.rsvp.length > 0 && canEdit(selectedEvent) && (
                                                <div className="mt-6 p-5 bg-slate-950/50 rounded-xl border border-white/5">
                                                    <h4 className="text-sm font-bold text-white mb-2">Attendee List</h4>
                                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                                        {selectedEvent.rsvp.filter(r => r.status === 'accepted').map((r, i) => (
                                                            <div key={i} className="text-sm text-slate-300 flex justify-between">
                                                                <span>{getRsvpName(r)}</span>
                                                                <span className="text-green-400 text-xs bg-green-900/20 px-2 py-0.5 rounded">Going</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-2 flex gap-3">
                                                <button onClick={() => handleRSVP('accepted')} disabled={submitting} className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                                                    {submitting ? <FiLoader className="animate-spin" /> : <>Join Event <FiCheck /></>}
                                                </button>
                                                <button onClick={() => handleRSVP('declined')} disabled={submitting} className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl font-medium transition-colors border border-white/5 hover:border-white/10">Decline</button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <div><h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Edit Event</h3></div>
                                            <button onClick={() => setShowModal(false)} className="p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"><FiX size={20} /></button>
                                        </div>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {/* Edit Form similar to creation but without create option */}
                                            <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Event Title</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Date</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
                                                <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Time</label><input type="time" name="time" value={formData.time} onChange={handleInputChange} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
                                            </div>
                                            <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Location</label><input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white" /></div>
                                            <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Category</label><select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white"><option value="worship">Worship</option><option value="youth">Youth</option><option value="study">Study</option><option value="outreach">Outreach</option><option value="special">Special</option></select></div>
                                            <div className="space-y-2"><label className="text-sm font-medium text-slate-300">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required className="w-full bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white"></textarea></div>
                                            <div className="pt-4 flex gap-3">
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl">Cancel</button>
                                                <button type="submit" disabled={submitting} className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold rounded-xl">{submitting ? <FiLoader className="animate-spin" /> : 'Save Changes'}</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events;
