import React from 'react';
import Calendar from './components/Calendar';
import EventModal from './components/EventModal';
import SearchFilter from './components/SearchFilter';
import { useCalendar } from './features/calendar/hooks/useCalendar';
import './App.css';

function App() {
  const {
    events,
    loading,
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
  } = useCalendar();

  return (
    <div className="App p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Calendar App</h1>
      </header>
      <main className="max-w-6xl mx-auto">
        {!notificationPermission && (
          <div className="notification-warning mb-4 p-4 bg-yellow-100 text-yellow-800">
            Please allow notifications to receive event reminders.
            <button 
              className="ml-4 p-2 bg-blue-500 text-white rounded"
              onClick={requestNotificationPermission}
            >
              Allow Notifications
            </button>
          </div>
        )}
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <Calendar 
          events={filteredEvents} 
          onDateClick={handleDateClick}
          onEventClick={handleEventClick}
        />
        <EventModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          date={selectedDate}
          onSave={handleEventSave}
          onDelete={handleEventDelete}
          initialData={selectedEvent}
          loading={loading}
        />
      </main>
    </div>
  );
}

export default App;
