export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
  remindBefore?: number; // minutes before event to remind
  notified?: boolean;
  googleEventId?: string;
}

export type ViewMode = 'day' | 'week' | 'month';

export interface NotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
}
