import api from './api';

const eventService = {
    // Get all events
    getEvents: async (params = {}) => {
        const response = await api.get('/events', { params });
        return response.data;
    },

    // Get single event
    getEvent: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    // Create event (admin/staff/pastor only)
    createEvent: async (eventData) => {
        const response = await api.post('/events', eventData);
        return response.data;
    },

    // Update event (admin/staff/pastor only)
    updateEvent: async (id, eventData) => {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
    },

    // Delete event (admin/staff/pastor only)
    deleteEvent: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },

    // RSVP to event
    rsvpEvent: async (id, status) => {
        const response = await api.put(`/events/${id}/rsvp`, { status });
        return response.data;
    },

    // Mark attendance (admin/staff only)
    markAttendance: async (id, attendanceData) => {
        const response = await api.put(`/events/${id}/attendance`, attendanceData);
        return response.data;
    },
    // Get admin events with full details
    getAdminEvents: async () => {
        const response = await api.get('/events/admin/all');
        return response.data;
    },
};

export default eventService;
