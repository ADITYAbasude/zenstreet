import { useState, useEffect, useMemo } from 'react';
import api from '../../../utils/api';
import NotificationService from '../../../services/NotificationService';

export const useCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [notificationTimers, setNotificationTimers] = useState({});
  const [notificationPermission, setNotificationPermission] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const setupNotifications = async () => {
      const hasPermission = await NotificationService.requestPermission();
      setNotificationPermission(hasPermission);
      if (!hasPermission) {
        console.warn('Notification permission not granted');
      }
    };
    setupNotifications();
  }, []);

  const requestNotificationPermission = async () => {
    const hasPermission = await NotificationService.requestPermission();
    setNotificationPermission(hasPermission);
    if (!hasPermission) {
      console.warn('Notification permission not granted');
    }
  };

  useEffect(() => {
    // Clear existing timers
    Object.values(notificationTimers).forEach(timer => clearTimeout(timer));
    
    // Schedule new notifications
    const newTimers = events.reduce((acc, event) => {
      const timerId = NotificationService.scheduleNotification(event);
      if (timerId) {
        acc[event.id] = timerId;
      }
      return acc;
    }, {});
    
    setNotificationTimers(newTimers);

    return () => {
      Object.values(newTimers).forEach(timer => clearTimeout(timer));
    };
  }, [events]);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleEventClick = (arg) => {
    const event = {
      id: arg.event.id,
      title: arg.event.title,
      description: arg.event.extendedProps.description,
      imageUrl: arg.event.extendedProps.imageUrl,
      videoUrl: arg.event.extendedProps.videoUrl,
      start: arg.event.start
    };
    setSelectedEvent(event);
    setSelectedDate(event.start);
    setModalOpen(true);
  };

  const handleEventSave = async (eventData) => {
    try {
      setLoading(true);
      if (selectedEvent?.id) {
        const response = await api.put(`/events/${selectedEvent.id}`, eventData);
        setEvents(events.map(e => e.id === selectedEvent.id ? response.data : e));
        
        // Update notification for edited event
        if (notificationTimers[selectedEvent.id]) {
          clearTimeout(notificationTimers[selectedEvent.id]);
        }
        const timerId = NotificationService.scheduleNotification(response.data);
        setNotificationTimers(prev => ({ ...prev, [response.data.id]: timerId }));
      } else {
        const response = await api.post('/events', eventData);
        setEvents([...events, response.data]);
      }
      setError(null);
    } catch (err) {
      console.error('Error saving event:', err);
      throw new Error('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleEventDelete = async (eventId) => {
    try {
      setLoading(true);
      await api.delete(`/events/${eventId}`);
      
      // Clear notification timer for deleted event
      if (notificationTimers[eventId]) {
        clearTimeout(notificationTimers[eventId]);
        setNotificationTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[eventId];
          return newTimers;
        });
      }
      
      setEvents(events.filter(e => e.id !== eventId));
      setError(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      throw new Error('Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      const searchMatch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      let typeMatch = true;
      if (selectedType === 'image') typeMatch = !!event.imageUrl;
      if (selectedType === 'video') typeMatch = !!event.videoUrl;
      if (selectedType === 'text') typeMatch = !event.imageUrl && !event.videoUrl;

      // Date range filter
      let dateMatch = true;
      if (dateRange.start && dateRange.end) {
        const eventDate = new Date(event.start);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        dateMatch = eventDate >= startDate && eventDate <= endDate;
      }

      return searchMatch && typeMatch && dateMatch;
    });
  }, [events, searchQuery, selectedType, dateRange]);

  return {
    events,
    loading,
    error,
    modalOpen,
    selectedDate,
    selectedEvent,
    handleDateClick,
    handleEventClick,
    handleEventSave,
    handleEventDelete,
    setModalOpen,
    filteredEvents,
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    dateRange,
    setDateRange,
    notificationPermission,
    requestNotificationPermission
  };
};
