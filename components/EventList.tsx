'use client';

import React from 'react';
import { CalendarEvent } from '../lib/types';
import { formatTime } from '../utils/helpers';
import { exportToGoogleCalendar } from '../lib/storage';

interface EventListProps {
  events: CalendarEvent[];
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete }) => {
  const handleExportToGoogle = (event: CalendarEvent) => {
    const url = exportToGoogleCalendar(event);
    window.open(url, '_blank');
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No events scheduled
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div
          key={event.id}
          className="border-l-4 bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          style={{ borderLeftColor: event.color }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{event.title}</h3>
              {event.description && (
                <p className="text-gray-600 text-sm mt-1">{event.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>🕐 {formatTime(event.start)} - {formatTime(event.end)}</span>
                {event.remindBefore && (
                  <span>🔔 {event.remindBefore} min before</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleExportToGoogle(event)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                title="Export to Google Calendar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </button>
              <button
                onClick={() => onEdit(event)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                title="Edit event"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="Delete event"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventList;
