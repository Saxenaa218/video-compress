'use client';

import React, { useState, useEffect } from 'react';
import { CalendarEvent, ViewMode } from '../lib/types';
import { saveEvents, loadEvents } from '../lib/storage';
import { NotificationManager } from '../utils/notifications';
import EventForm from './EventForm';
import EventList from './EventList';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import { getUpcomingEvents, formatDate } from '../utils/helpers';

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Load events from localStorage
    const loadedEvents = loadEvents();
    setEvents(loadedEvents);

    // Request notification permission
    const notificationManager = NotificationManager.getInstance();
    notificationManager.requestPermission().then((granted) => {
      setNotificationsEnabled(granted);
      if (granted) {
        notificationManager.startMonitoring(loadedEvents, (updatedEvents) => {
          setEvents([...updatedEvents]);
          saveEvents(updatedEvents);
        });
      }
    });

    return () => {
      notificationManager.stopMonitoring();
    };
  }, []);

  const handleSaveEvent = (event: CalendarEvent) => {
    let updatedEvents;
    if (editingEvent) {
      updatedEvents = events.map((e) => (e.id === event.id ? event : e));
    } else {
      updatedEvents = [...events, event];
    }
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    setShowEventForm(false);
    setEditingEvent(undefined);
    setSelectedDate(undefined);

    // Restart monitoring with updated events
    if (notificationsEnabled) {
      const notificationManager = NotificationManager.getInstance();
      notificationManager.startMonitoring(updatedEvents, (updated) => {
        setEvents([...updated]);
        saveEvents(updated);
      });
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter((e) => e.id !== id);
      setEvents(updatedEvents);
      saveEvents(updatedEvents);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleAddEvent = (date?: Date) => {
    setSelectedDate(date);
    setEditingEvent(undefined);
    setShowEventForm(true);
  };

  const handlePreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDate.getDate() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getPeriodLabel = () => {
    if (viewMode === 'day') {
      return formatDate(currentDate);
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    } else {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
  };

  const upcomingEvents = getUpcomingEvents(events, 5);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-4 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
              <p className="text-gray-600 mt-1">Manage your events and appointments</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddEvent()}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Event
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-4 p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPeriod}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleToday}
                className="px-4 py-2 hover:bg-gray-100 rounded transition-colors font-medium"
              >
                Today
              </button>
              <button
                onClick={handleNextPeriod}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <span className="ml-4 text-lg font-semibold">{getPeriodLabel()}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded transition-colors ${
                  viewMode === 'day'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded transition-colors ${
                  viewMode === 'week'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded transition-colors ${
                  viewMode === 'month'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Calendar View */}
          <div className="lg:col-span-2">
            {viewMode === 'day' && (
              <DayView
                date={currentDate}
                events={events}
                onEventClick={handleEditEvent}
                onTimeSlotClick={handleAddEvent}
              />
            )}
            {viewMode === 'week' && (
              <WeekView
                date={currentDate}
                events={events}
                onEventClick={handleEditEvent}
                onDayClick={(date) => {
                  setCurrentDate(date);
                  setViewMode('day');
                }}
              />
            )}
            {viewMode === 'month' && (
              <MonthView
                date={currentDate}
                events={events}
                onEventClick={handleEditEvent}
                onDayClick={(date) => {
                  setCurrentDate(date);
                  setViewMode('day');
                }}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Notification Status */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">Notifications</h3>
              <div className="flex items-center gap-2">
                {notificationsEnabled ? (
                  <>
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-gray-600">Enabled</span>
                  </>
                ) : (
                  <>
                    <span className="text-yellow-500">⚠</span>
                    <span className="text-sm text-gray-600">Disabled</span>
                  </>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Upcoming Events</h3>
              {upcomingEvents.length > 0 ? (
                <EventList
                  events={upcomingEvents}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ) : (
                <p className="text-sm text-gray-500">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(undefined);
            setSelectedDate(undefined);
          }}
        />
      )}
    </div>
  );
};

export default Calendar;
