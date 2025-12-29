import { CalendarEvent } from '../lib/types';

export class NotificationManager {
  private static instance: NotificationManager;
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  showNotification(title: string, body: string, icon?: string): void {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/calendar-icon.png',
        badge: '/calendar-icon.png',
      });
    }
  }

  startMonitoring(events: CalendarEvent[], onUpdate: (events: CalendarEvent[]) => void): void {
    this.stopMonitoring();

    this.checkInterval = setInterval(() => {
      const now = new Date();
      let updated = false;

      events.forEach(event => {
        if (event.remindBefore && !event.notified) {
          const reminderTime = new Date(event.start.getTime() - event.remindBefore * 60000);
          
          if (now >= reminderTime && now < event.start) {
            this.showNotification(
              'Upcoming Event Reminder',
              `${event.title} starts in ${event.remindBefore} minutes`
            );
            event.notified = true;
            updated = true;
          }
        }
      });

      if (updated) {
        onUpdate(events);
      }
    }, 60000); // Check every minute
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}
