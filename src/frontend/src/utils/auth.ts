import { axiosInstance } from '@/services/axiosInstance';
import { useAuthStore } from '@/store/useZustandStore';
import Cookies from 'js-cookie';
import { getCookie } from './getCookie';
import ApiServices from '@/services/ApiServices';

export const verifyToken = async (): Promise<boolean> => {
  try {
    // Check if we already have a user in the store
    const authStore = useAuthStore.getState();
    if (authStore.isAuthenticated) {
      return true;
    }

    // Get token from localStorage
    const accessToken = getCookie('access_token');
    if (!accessToken) {
      return false;
    }

    // Verify token with API
    const user = await axiosInstance.get('/api/get_user_info');
    useAuthStore
      .getState()
      .setUser(user.data.full_name, user.data.email, user.data.profile_picture);
    return true;
  } catch (error) {
    Cookies.remove('access_token');
    useAuthStore.getState().resetUser();
    console.error('Token verification failed:', error);
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  useAuthStore.getState().resetUser();
  Cookies.remove('access_token');
  window.location.href = '/login';
};
