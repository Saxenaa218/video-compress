const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    title: 'GitHub Compressor'
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle file selection
ipcMain.handle('select-video', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv'] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  const filePath = result.filePaths[0];
  const stats = fs.statSync(filePath);
  
  return {
    path: filePath,
    name: path.basename(filePath),
    size: stats.size
  };
});

// Handle save location selection
ipcMain.handle('select-save-location', async (event, originalName) => {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `${baseName}_compressed.mp4`,
    filters: [
      { name: 'MP4 Video', extensions: ['mp4'] }
    ]
  });

  if (result.canceled) {
    return null;
  }

  return result.filePath;
});

// Get video duration using ffprobe
function getVideoDuration(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
}

// Compress video to target size (9 MB)
ipcMain.handle('compress-video', async (event, inputPath, outputPath) => {
  const TARGET_SIZE_MB = 9;
  const TARGET_SIZE_BITS = TARGET_SIZE_MB * 8 * 1024 * 1024;
  
  try {
    const duration = await getVideoDuration(inputPath);
    
    // Calculate target bitrate (total bits / duration in seconds)
    // Reserve 128kbps for audio
    const audioBitrate = 128 * 1024; // 128 kbps in bits
    const videoBitrate = Math.floor((TARGET_SIZE_BITS / duration) - audioBitrate);
    
    // Convert to kbps for ffmpeg
    const videoBitrateKbps = Math.max(100, Math.floor(videoBitrate / 1024));
    
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          `-b:v ${videoBitrateKbps}k`,
          '-b:a 128k',
          '-maxrate ' + (videoBitrateKbps * 1.5) + 'k',
          '-bufsize ' + (videoBitrateKbps * 2) + 'k',
          '-preset medium',
          '-movflags +faststart'
        ])
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg started:', commandLine);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            mainWindow.webContents.send('compression-progress', Math.round(progress.percent));
          }
        })
        .on('end', () => {
          const stats = fs.statSync(outputPath);
          resolve({
            success: true,
            outputPath: outputPath,
            outputSize: stats.size
          });
        })
        .on('error', (err) => {
          reject(err);
        })
        .run();
    });
  } catch (error) {
    throw error;
  }
});
