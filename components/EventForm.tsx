'use client';

import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../lib/types';
import { generateId } from '../utils/helpers';

interface EventFormProps {
  event?: CalendarEvent;
  selectedDate?: Date;
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, selectedDate, onSave, onCancel }) => {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [startDate, setStartDate] = useState(
    event?.start ? event.start.toISOString().slice(0, 16) : 
    selectedDate ? new Date(selectedDate.getTime()).toISOString().slice(0, 16) : 
    new Date().toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState(
    event?.end ? event.end.toISOString().slice(0, 16) : 
    selectedDate ? new Date(selectedDate.getTime() + 3600000).toISOString().slice(0, 16) : 
    new Date(Date.now() + 3600000).toISOString().slice(0, 16)
  );
  const [color, setColor] = useState(event?.color || '#3b82f6');
  const [remindBefore, setRemindBefore] = useState(event?.remindBefore?.toString() || '15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: CalendarEvent = {
      id: event?.id || generateId(),
      title,
      description,
      start: new Date(startDate),
      end: new Date(endDate),
      color,
      remindBefore: parseInt(remindBefore) || undefined,
      notified: event?.notified || false,
      googleEventId: event?.googleEventId,
    };

    onSave(newEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {event ? 'Edit Event' : 'New Event'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Start Date & Time</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">End Date & Time</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex gap-2">
                {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Remind Before (minutes)</label>
              <select
                value={remindBefore}
                onChange={(e) => setRemindBefore(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No reminder</option>
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="1440">1 day</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Save Event
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
