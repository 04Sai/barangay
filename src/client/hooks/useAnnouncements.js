import { useState, useEffect, useCallback } from 'react';
import announcementService from '../services/announcementService';

export const useAnnouncements = (params = {}) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      console.log('useAnnouncements: Fetching with params:', params);
      const response = await announcementService.getAllAnnouncements({
        isActive: true,
        ...params
      });
      
      if (response.success) {
        setAnnouncements(response.data || []);
        setPagination(response.pagination);
        console.log('useAnnouncements: Successfully fetched announcements:', response.data?.length || 0);
      } else {
        throw new Error(response.error || 'Failed to fetch announcements');
      }
    } catch (err) {
      console.error('useAnnouncements: Error fetching announcements:', err);
      setError(err.message || 'Failed to load announcements');
      setAnnouncements([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return {
    announcements,
    loading,
    error,
    pagination,
    refetch: fetchAnnouncements
  };
};

export default useAnnouncements;
