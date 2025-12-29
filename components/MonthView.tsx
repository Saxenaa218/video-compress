'use client';

import React from 'react';
import { CalendarEvent } from '../lib/types';
import { getEventsForMonth } from '../utils/helpers';

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ date, events, onEventClick, onDayClick }) => {
  const monthEvents = getEventsForMonth(events, date);

  const getDaysInMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDate = (targetDate: Date | null) => {
    if (!targetDate) return [];
    return monthEvents.filter(event => {
      return event.start.toDateString() === targetDate.toDateString();
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dayEvents = getEventsForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();
          const isCurrentMonth = day.getMonth() === date.getMonth();

          return (
            <div
              key={index}
              className={`aspect-square border rounded-lg p-2 cursor-pointer hover:bg-gray-50 overflow-hidden ${
                isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              } ${!isCurrentMonth ? 'opacity-50' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="text-xs px-1 py-0.5 rounded text-white truncate cursor-pointer"
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
