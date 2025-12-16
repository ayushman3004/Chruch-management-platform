import api from './api';

const ministryService = {
    // Get all ministries
    getMinistries: async () => {
        const response = await api.get('/ministries');
        return response.data;
    },

    // Get single ministry
    getMinistry: async (id) => {
        const response = await api.get(`/ministries/${id}`);
        return response.data;
    },

    // Create ministry (admin/pastor only)
    createMinistry: async (ministryData) => {
        const response = await api.post('/ministries', ministryData);
        return response.data;
    },

    // Update ministry (admin/pastor only)
    updateMinistry: async (id, ministryData) => {
        const response = await api.put(`/ministries/${id}`, ministryData);
        return response.data;
    },

    // Delete ministry (admin/pastor only)
    deleteMinistry: async (id) => {
        const response = await api.delete(`/ministries/${id}`);
        return response.data;
    },

    // Join ministry
    joinMinistry: async (id) => {
        const response = await api.put(`/ministries/${id}/join`);
        return response.data;
    },

    // Leave ministry
    leaveMinistry: async (id) => {
        const response = await api.put(`/ministries/${id}/leave`);
        return response.data;
    },
    // Get all ministries for admin
    getAllMinistries: async () => {
        const response = await api.get('/ministries/admin/all');
        return response.data;
    },
};

export default ministryService;
