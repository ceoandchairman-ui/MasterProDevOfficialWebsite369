import apiClient from '@/api/base44Client';

// Consultant Service - handles consultant data
export class Consultant {
  static async list(filters = {}) {
    try {
      const response = await apiClient.get('/consultants', { params: filters });
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.warn('Failed to fetch consultants, returning empty array:', error.message);
      return [];
    }
  }

  static async getById(id) {
    try {
      const response = await apiClient.get(`/consultants/${id}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch consultant:', error.message);
      return null;
    }
  }

  static async search(query) {
    try {
      const response = await apiClient.get('/consultants/search', { 
        params: { q: query } 
      });
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.warn('Failed to search consultants:', error.message);
      return [];
    }
  }

  static async create(data) {
    try {
      const response = await apiClient.post('/consultants', data);
      return response;
    } catch (error) {
      console.error('Failed to create consultant:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const response = await apiClient.put(`/consultants/${id}`, data);
      return response;
    } catch (error) {
      console.error('Failed to update consultant:', error);
      throw error;
    }
  }
}

export default Consultant;
