import { CalendarEvent, NotificationSettings } from './types';

const STORAGE_KEYS = {
  EVENTS: 'calendar_events',
  SETTINGS: 'notification_settings',
};

// Event storage functions
export const saveEvents = (events: CalendarEvent[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }
};

export const loadEvents = (): CalendarEvent[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (stored) {
      const events = JSON.parse(stored);
      // Convert date strings back to Date objects
      return events.map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
    }
  }
  return [];
};

// Notification settings functions
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }
};

export const loadNotificationSettings = (): NotificationSettings => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return { enabled: true, soundEnabled: true };
};

// Google Calendar sync helpers
export const exportToGoogleCalendar = (event: CalendarEvent): string => {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    dates: `${formatDate(event.start)}/${formatDate(event.end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
