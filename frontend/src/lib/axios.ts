/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import Cookie from 'js-cookie';
import { toast } from '@/hooks/use-toast';

const api = axios.create({
  baseURL: 'http://localhost:5000/v1', // Your API base URL
  headers: Cookie.get('token')
    ? {
        Authorization: `Bearer ${Cookie.get('token')}`,
      }
    : {},
});

let isRefreshing = false;
let refreshSubscribers: any[] = [];

// Helper function to notify queued requests after token refresh
function onRefreshed(newToken: any) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

// Helper function to add subscribers for queued requests
function addRefreshSubscriber(callback: (newToken: any) => void) {
  refreshSubscribers.push(callback);
}

// Add a response interceptor
api.interceptors.response.use(
  (response) => response, // Return response as is if no error
  async (error) => {
    // Handle 401 (Unauthorized) errors
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // If refresh token is expired, redirect to login
          if (!Cookie.get('refreshToken')) {
            toast({
              title: 'Error',
              description: 'Session expired. Please log in again.',
            });
            Cookie.remove('token');
            Cookie.remove('refreshToken');

            //return axios.Cancel('Session expired. Please log in again.');
            return Promise.reject('Session expired. Please log in again.');
          }

          // Call the refresh tokens endpoint
          const { data } = await api.post('/auth/refresh-tokens', {
            refreshToken: Cookie.get('refreshToken'),
          });

          // Update tokens in cookies
          Cookie.set('token', data.access.token, {
            expires: new Date(data.access.expires), // Convert to days
          });
          Cookie.set('refreshToken', data.refresh.token, {
            expires: new Date(data.refresh.expires),
          });

          // Notify all subscribers with the new token
          onRefreshed(data.access.token);

          toast({
            title: 'Success',
            description: 'Token refreshed successfully',
          });
        } catch (refreshError: any) {
          // Handle token refresh failure
          console.log('Error refreshing token:', refreshError);

          if (refreshError.response?.status === 401) {
            // Refresh token expired, redirect to login
            toast({
              title: 'Error',
              description: 'Session expired. Please log in again.',
            });
            Cookie.remove('token');
            Cookie.remove('refreshToken');
          } else {
            toast({
              title: 'Error',
              description: `An error occurred: ${refreshError.message}`,
            });
          }

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Queue the failed request until token is refreshed
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken: any) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api.request(originalRequest));
        });
      });
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      toast({
        title: 'Network Error',
        description: 'Please check your internet connection and try again.',
      });
    }

    return Promise.reject(error); // Pass other errors to caller
  }
);

export default api;
