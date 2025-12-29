# Calendar Application

A comprehensive calendar application built with Next.js, React, and TypeScript that allows users to schedule events, set reminders, and manage their appointments.

## Features

### 📅 Multiple Calendar Views
- **Day View**: Detailed hourly view of a single day with time slots
- **Week View**: Overview of the entire week with events
- **Month View**: Traditional calendar month view with event indicators

### ✨ Event Management
- **Add Events**: Create new events with title, description, date/time, and color coding
- **Edit Events**: Modify existing events easily
- **Delete Events**: Remove unwanted events with confirmation
- **Color Coding**: Organize events with customizable colors

### 🔔 Notification System
- **Browser Notifications**: Receive reminders for upcoming events
- **Customizable Reminders**: Set reminder times (5 min, 15 min, 30 min, 1 hour, 1 day before)
- **Permission Management**: Request and manage notification permissions

### 🔄 Google Calendar Integration
- **Export to Google Calendar**: One-click export of events to Google Calendar
- **Easy Sync**: Share events between platforms seamlessly

### 💾 Data Persistence
- **Local Storage**: All events are saved locally in the browser
- **Automatic Save**: Events are automatically saved as you create/edit them
- **No Server Required**: Fully client-side application

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Saxenaa218/video-compress.git
cd video-compress
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Creating an Event

1. Click the "New Event" button or click on any day/time slot
2. Fill in the event details:
   - Title (required)
   - Description (optional)
   - Start date and time
   - End date and time
   - Color (choose from preset colors)
   - Reminder time (optional)
3. Click "Save Event"

### Editing an Event

1. Click on any event in the calendar
2. Modify the event details in the form
3. Click "Save Event"

### Deleting an Event

1. Click on the event
2. Click the delete (trash) icon
3. Confirm the deletion

### Switching Views

Use the view buttons (Day, Week, Month) to switch between different calendar views.

### Navigating Dates

- Use the arrow buttons to move forward/backward
- Click "Today" to jump to the current date

### Exporting to Google Calendar

1. Click on an event
2. Click the export icon
3. A new window will open with Google Calendar pre-filled with the event details

### Managing Notifications

The application will request notification permissions on first load. If notifications are enabled, you'll receive browser notifications based on your reminder settings.

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage API
- **Notifications**: Browser Notifications API

## Project Structure

```
├── app/
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/
│   ├── Calendar.tsx        # Main calendar component
│   ├── DayView.tsx         # Day view component
│   ├── WeekView.tsx        # Week view component
│   ├── MonthView.tsx       # Month view component
│   ├── EventForm.tsx       # Event creation/editing form
│   └── EventList.tsx       # Event list component
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   └── storage.ts          # LocalStorage utilities
└── utils/
    ├── helpers.ts          # Helper functions
    └── notifications.ts    # Notification manager
```

## Features in Detail

### Day View
- Hourly time slots from 12 AM to 11 PM
- Click on any time slot to create a new event
- Events are positioned based on their start time and duration
- Visual representation of event overlaps

### Week View
- Shows all 7 days of the week
- Today's date is highlighted
- Click on any day to switch to day view
- Events are displayed with their title and start time

### Month View
- Traditional calendar grid layout
- Current day highlighted
- Shows up to 3 events per day with "+X more" indicator
- Click on any day to switch to day view

### Event Colors
- Blue (#3b82f6)
- Red (#ef4444)
- Green (#10b981)
- Orange (#f59e0b)
- Purple (#8b5cf6)
- Pink (#ec4899)

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Opera: Full support

Note: Notification functionality requires HTTPS in production environments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
