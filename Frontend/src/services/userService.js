import api from './api';

const userService = {
    getUserProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    updateUserProfile: async (userData) => {
        const response = await api.put('/users/profile', userData);
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    getPublicUsers: async () => {
        const response = await api.get('/users/public');
        return response.data;
    }
};

export default userService;
