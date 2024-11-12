import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

const EventModal = ({ isOpen, onClose, date, onSave, initialData, onDelete }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    startTime: '09:00', // Add default start time
    endTime: '10:00',   // Add default end time
  });

  useEffect(() => {
    if (isOpen) {
      const initialTime = initialData?.start ? {
        startTime: format(new Date(initialData.start), 'HH:mm'),
        endTime: format(new Date(initialData.end || new Date(initialData.start).setHours(new Date(initialData.start).getHours() + 1)), 'HH:mm'),
      } : {
        startTime: '09:00',
        endTime: '10:00'
      };

      setEventData({
        title: initialData?.title || '',
        description: initialData?.description || '',
        imageUrl: initialData?.imageUrl || '',
        videoUrl: initialData?.videoUrl || '',
        ...initialTime
      });
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!eventData.title?.trim()) newErrors.title = 'Title is required';
    if (!eventData.startTime) newErrors.startTime = 'Start time is required';
    if (!eventData.endTime) newErrors.endTime = 'End time is required';
    if (eventData.startTime >= eventData.endTime) {
      newErrors.time = 'End time must be after start time';
    }
    if (eventData.imageUrl && !isValidUrl(eventData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }
    if (eventData.videoUrl && !isValidUrl(eventData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid video URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const eventStart = new Date(date);
    const [startHours, startMinutes] = eventData.startTime.split(':');
    eventStart.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10));

    const eventEnd = new Date(date);
    const [endHours, endMinutes] = eventData.endTime.split(':');
    eventEnd.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10));

    setLoading(true);
    try {
      await onSave({ 
        ...eventData, 
        start: eventStart,
        end: eventEnd
      });
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to save event. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(initialData.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {initialData ? 'Edit Event' : 'Add Event'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Event Title"
              className={`input w-full ${errors.title ? 'border-red-500' : ''}`}
              value={eventData.title || ''}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              disabled={loading}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          <textarea
            placeholder="Description"
            className={`input w-full ${errors.description ? 'border-red-500' : ''}`}
            value={eventData.description}
            onChange={(e) => setEventData({...eventData, description: e.target.value})}
            disabled={loading}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}

          <input
            type="url"
            placeholder="Image URL"
            className={`input w-full ${errors.imageUrl ? 'border-red-500' : ''}`}
            value={eventData.imageUrl}
            onChange={(e) => setEventData({...eventData, imageUrl: e.target.value})}
            disabled={loading}
          />
          {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}

          <input
            type="url"
            placeholder="Video URL"
            className={`input w-full ${errors.videoUrl ? 'border-red-500' : ''}`}
            value={eventData.videoUrl}
            onChange={(e) => setEventData({...eventData, videoUrl: e.target.value})}
            disabled={loading}
          />
          {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                className={`input w-full ${errors.startTime || errors.time ? 'border-red-500' : ''}`}
                value={eventData.startTime}
                onChange={(e) => setEventData({...eventData, startTime: e.target.value})}
                min="00:00"
                max="23:59"
                disabled={loading}
              />
              {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                className={`input w-full ${errors.endTime || errors.time ? 'border-red-500' : ''}`}
                value={eventData.endTime}
                onChange={(e) => setEventData({...eventData, endTime: e.target.value})}
                min="00:00"
                max="23:59"
                disabled={loading}
              />
              {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
            </div>
          </div>
          {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}

          <div className="flex justify-end space-x-2 pt-4">
            {initialData && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                Delete
              </button>
            )}
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
          {errors.submit && (
            <p className="text-red-500 text-center mt-2">{errors.submit}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventModal;
