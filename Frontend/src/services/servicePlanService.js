import api from './api';

const servicePlanService = {
    // Get all service plans
    getServicePlans: async () => {
        const response = await api.get('/service-plans');
        return response.data;
    },

    // Get single service plan
    getServicePlan: async (id) => {
        const response = await api.get(`/service-plans/${id}`);
        return response.data;
    },

    // Create service plan (admin/staff/pastor only)
    createServicePlan: async (planData) => {
        const response = await api.post('/service-plans', planData);
        return response.data;
    },

    // Update service plan (admin/staff/pastor only)
    updateServicePlan: async (id, planData) => {
        const response = await api.put(`/service-plans/${id}`, planData);
        return response.data;
    },

    // Delete service plan (admin/staff/pastor only)
    deleteServicePlan: async (id) => {
        const response = await api.delete(`/service-plans/${id}`);
        return response.data;
    },

    // Assign volunteer to service plan
    assignVolunteer: async (id, volunteerId, role) => {
        const response = await api.put(`/service-plans/${id}/assign`, { volunteerId, role });
        return response.data;
    },
};

export default servicePlanService;
