# Simple FTP Client

A lightweight FTP client application built with Next.js that allows users to connect to FTP servers and transfer files.

## Features

- **Connect to FTP Servers**: Connect to any FTP/FTPS server with configurable settings
- **File Browser**: Navigate through remote directories with an intuitive interface
- **File Operations**:
  - Upload files from your local machine
  - Download files from the remote server
  - Rename files and directories
  - Delete files and directories
  - Create new directories
- **Configuration Options**:
  - Custom host and port
  - Username/password authentication
  - Secure FTP (FTPS) support

## Tech Stack

- **Frontend**: Next.js 16 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Next.js API Routes
- **FTP Library**: basic-ftp

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm run start
```

## Usage

1. Enter your FTP server details:
   - Host (e.g., `ftp.example.com`)
   - Port (default: 21)
   - Username
   - Password
   - Enable "Use FTPS" for secure connections

2. Click "Connect" to establish a connection

3. Browse files and directories:
   - Click on directories to navigate into them
   - Click the up arrow to go to the parent directory
   - Use the refresh button to reload the current directory

4. File Operations:
   - **Upload**: Click the "Upload" button and select a file
   - **Download**: Click the download icon next to a file
   - **Rename**: Click the edit icon and enter a new name
   - **Delete**: Click the trash icon (confirmation required)
   - **Create Folder**: Click "New Folder" and enter a name

5. Click "Disconnect" when done

## Project Structure

```
src/
├── app/
│   ├── api/ftp/           # API routes for FTP operations
│   │   ├── connect/       # Connection test endpoint
│   │   ├── list/          # List directory contents
│   │   ├── upload/        # Upload files
│   │   ├── download/      # Download files
│   │   ├── rename/        # Rename files/directories
│   │   ├── delete/        # Delete files/directories
│   │   └── mkdir/         # Create directories
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main FTP client page
├── components/
│   ├── ConnectionForm.tsx # FTP connection configuration form
│   ├── FileBrowser.tsx    # File browser component
│   └── StatusBar.tsx      # Status message display
├── lib/
│   └── ftp-client.ts      # FTP client utility functions
└── types/
    └── ftp.ts             # TypeScript type definitions
```

## Security Notes

- Credentials are not stored persistently and are only held in memory during the session
- FTPS (secure FTP) is supported for encrypted connections
- Always use secure connections when possible

## License

MIT
