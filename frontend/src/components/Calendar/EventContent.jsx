import React from 'react';

const EventContent = (eventInfo) => {
  return (
    <div className="p-1">
      <div className="font-bold">{eventInfo.event.title}</div>
      {eventInfo.event.extendedProps.imageUrl && (
        <img 
          src={eventInfo.event.extendedProps.imageUrl} 
          alt="" 
          className="w-full h-20 object-cover mt-1" 
        />
      )}
    </div>
  );
};

export default EventContent;
