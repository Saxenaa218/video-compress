'use client';

import React from 'react';
import { CalendarEvent } from '../lib/types';
import { formatTime, getEventsForDay } from '../utils/helpers';

interface DayViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, events, onEventClick, onTimeSlotClick }) => {
  const dayEvents = getEventsForDay(events, date);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleSlotClick = (hour: number) => {
    const slotDate = new Date(date);
    slotDate.setHours(hour, 0, 0, 0);
    onTimeSlotClick(slotDate);
  };

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
    const endHour = event.end.getHours() + event.end.getMinutes() / 60;
    const duration = endHour - startHour;
    
    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">
        {date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric',
          year: 'numeric' 
        })}
      </h3>
      <div className="relative">
        <div className="space-y-0">
          {hours.map((hour) => (
            <div
              key={hour}
              className="relative h-[60px] border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleSlotClick(hour)}
            >
              <span className="absolute left-0 -top-2 text-xs text-gray-500">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 left-16 right-0">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="absolute left-0 right-0 mx-1 px-2 py-1 rounded text-white text-sm cursor-pointer overflow-hidden"
              style={{
                backgroundColor: event.color,
                ...getEventPosition(event),
              }}
              onClick={() => onEventClick(event)}
            >
              <div className="font-semibold">{event.title}</div>
              <div className="text-xs opacity-90">
                {formatTime(event.start)} - {formatTime(event.end)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
