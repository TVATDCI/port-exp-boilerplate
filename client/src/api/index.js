const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  projects: `${API_BASE_URL}/projects`,
  contact: `${API_BASE_URL}/contact`,
  register: `${API_BASE_URL}/users/register`,
  login: `${API_BASE_URL}/users/login`,
  profile: `${API_BASE_URL}/users/profile`,
};

export default API_BASE_URL;
