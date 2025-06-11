import { useState, useEffect, useCallback } from 'react';
import announcementService from '../services/announcementService';

export const useAnnouncements = (params = {}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await announcementService.getAllAnnouncements({
        isActive: true,
        ...params
      });
      
      if (response && response.success) {
        setAnnouncements(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Failed to load announcements');
      
      // Fallback to empty array instead of static data
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    loading,
    error,
    refetch: fetchAnnouncements
  };
};

export default useAnnouncements;
