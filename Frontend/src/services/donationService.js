import api from './api';

const donationService = {
    // Create donation
    createDonation: async (donationData) => {
        const response = await api.post('/donations', donationData);
        return response.data;
    },

    // Get all donations (admin/pastor only)
    getAllDonations: async (params = {}) => {
        const response = await api.get('/donations', { params });
        return response.data;
    },

    // Get my donations
    getMyDonations: async () => {
        const response = await api.get('/donations/my');
        return response.data;
    },

    // Get single donation
    getDonation: async (id) => {
        const response = await api.get(`/donations/${id}`);
        return response.data;
    },

    // Get donation statistics
    getDonationStats: async () => {
        const response = await api.get('/donations/stats');
        return response.data;
    },
    // Get member donation stats
    getMemberDonationStats: async () => {
        const response = await api.get('/donations/members-stats');
        return response.data;
    },
};

export default donationService;
