import apiClient from '@/api/base44Client';

// Review Service - handles reviews and ratings
export class Review {
  static async list(filters = {}) {
    try {
      const response = await apiClient.get('/reviews', { params: filters });
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.warn('Failed to fetch reviews:', error.message);
      return [];
    }
  }

  static async filter(filters = {}) {
    return this.list(filters);
  }

  static async getById(id) {
    try {
      const response = await apiClient.get(`/reviews/${id}`);
      return response;
    } catch (error) {
      console.warn('Failed to fetch review:', error.message);
      return null;
    }
  }

  static async create(data) {
    try {
      const response = await apiClient.post('/reviews', data);
      return response;
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const response = await apiClient.put(`/reviews/${id}`, data);
      return response;
    } catch (error) {
      console.error('Failed to update review:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await apiClient.delete(`/reviews/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete review:', error);
      throw error;
    }
  }
}

// Rating Service - handles ratings
export class Rating {
  static async list(filters = {}) {
    try {
      const response = await apiClient.get('/ratings', { params: filters });
      return Array.isArray(response) ? response : response.data || [];
    } catch (error) {
      console.warn('Failed to fetch ratings:', error.message);
      return [];
    }
  }

  static async create(data) {
    try {
      const response = await apiClient.post('/ratings', data);
      return response;
    } catch (error) {
      console.error('Failed to create rating:', error);
      throw error;
    }
  }
}

export default Review;
