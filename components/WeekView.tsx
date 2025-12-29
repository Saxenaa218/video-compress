'use client';

import React from 'react';
import { CalendarEvent } from '../lib/types';
import { getEventsForWeek, formatTime } from '../utils/helpers';

interface WeekViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ date, events, onEventClick, onDayClick }) => {
  const weekEvents = getEventsForWeek(events, date);
  
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getEventsForDate = (targetDate: Date) => {
    return weekEvents.filter(event => {
      return event.start.toDateString() === targetDate.toDateString();
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayEvents = getEventsForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`border rounded-lg p-2 min-h-[200px] cursor-pointer hover:bg-gray-50 ${
                isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => onDayClick(day)}
            >
              <div className="text-center mb-2">
                <div className="text-xs text-gray-500">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                  {day.getDate()}
                </div>
              </div>
              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 rounded text-white cursor-pointer"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="opacity-90">{formatTime(event.start)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
