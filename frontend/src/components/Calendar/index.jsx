import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import EventContent from './EventContent';

const Calendar = ({ events, onDateClick, onEventClick }) => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={onDateClick}
      eventClick={onEventClick}
      eventContent={EventContent}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      }}
      editable={true}
      selectable={true}
    />
  );
};

export default Calendar;
