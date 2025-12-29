import { CalendarEvent } from './types';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

export const getEventsForDay = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => isSameDay(event.start, date));
};

export const getEventsForWeek = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return events.filter(event => 
    event.start >= startOfWeek && event.start < endOfWeek
  );
};

export const getEventsForMonth = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => 
    event.start.getMonth() === date.getMonth() &&
    event.start.getFullYear() === date.getFullYear()
  );
};

export const sortEventsByDate = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => a.start.getTime() - b.start.getTime());
};

export const getUpcomingEvents = (events: CalendarEvent[], limit: number = 5): CalendarEvent[] => {
  const now = new Date();
  return sortEventsByDate(events)
    .filter(event => event.start > now)
    .slice(0, limit);
};
