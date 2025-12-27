import axios from 'axios';

// Mock consultant data
const mockConsultants = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'AI Strategy Consultant',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    hourlyRate: 150,
    minBudget: 5000,
    experience: 8,
    languages: ['English', 'Mandarin'],
    servicesOffered: ['AI Consulting', 'Business Development', 'AI Agents'],
    bio: 'Expert in AI transformation and business strategy',
    averageRating: 4.8,
    totalReviews: 24
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    title: 'AI Automation Specialist',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    hourlyRate: 120,
    minBudget: 3000,
    experience: 6,
    languages: ['English', 'Spanish'],
    servicesOffered: ['AI Agents & Automations', 'Job Search Optimization'],
    bio: 'Specialized in workflow automation and efficiency',
    averageRating: 4.9,
    totalReviews: 31
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    title: 'Chatbot & Support Systems Expert',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    hourlyRate: 130,
    minBudget: 4000,
    experience: 7,
    languages: ['English', 'Spanish', 'Portuguese'],
    servicesOffered: ['AI Chatbots & Support', 'Business Development'],
    bio: 'Expert in customer engagement and AI chatbots',
    averageRating: 4.7,
    totalReviews: 19
  },
  {
    id: '4',
    name: 'David Kim',
    title: 'Career & Professional Growth Coach',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    hourlyRate: 100,
    minBudget: 2000,
    experience: 9,
    languages: ['English', 'Korean', 'Japanese'],
    servicesOffered: ['Job Search Optimization', 'Professional Development'],
    bio: 'Helping professionals advance their careers with AI',
    averageRating: 4.9,
    totalReviews: 42
  },
  {
    id: '5',
    name: 'Amara Okonkwo',
    title: 'Data & Analytics AI Consultant',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    hourlyRate: 140,
    minBudge: 4500,
    experience: 8,
    languages: ['English', 'French', 'German'],
    servicesOffered: ['AI Consulting', 'Business Development', 'Data Analytics'],
    bio: 'Specialist in data-driven AI solutions',
    averageRating: 4.6,
    totalReviews: 28
  }
];

// Create a simple axios client for API calls
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Return mock data for common endpoints if API not available
    const path = error.config?.url || '';
    
    if (path.includes('/consultants') && !path.includes('search')) {
      return mockConsultants;
    }
    
    if (path.includes('/consultants/search')) {
      const query = error.config?.params?.q || '';
      return mockConsultants.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.servicesOffered.some(s => s.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Base44 compatibility object
export const base44 = {
  auth: {
    me: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      const mockUser = localStorage.getItem('mock_user');
      return mockUser ? JSON.parse(mockUser) : null;
    }
  },
  appLogs: {
    logUserInApp: async (pageName) => {
      console.log('Page tracked:', pageName);
      return { success: true };
    }
  },
  integrations: {
    Core: {
      SendEmail: async (data) => {
        console.warn('SendEmail mock called:', data);
        return { success: true, message: 'Email queued (mock)' };
      },
      InvokeLLM: async (data) => {
        console.warn('InvokeLLM mock called:', data);
        return 'This is a mock AI response. Please configure a real LLM endpoint.';
      }
    }
  }
};

export default apiClient;
