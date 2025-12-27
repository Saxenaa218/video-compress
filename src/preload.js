const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectVideo: () => ipcRenderer.invoke('select-video'),
  selectSaveLocation: (originalName) => ipcRenderer.invoke('select-save-location', originalName),
  compressVideo: (inputPath, outputPath) => ipcRenderer.invoke('compress-video', inputPath, outputPath),
  onCompressionProgress: (callback) => {
    ipcRenderer.on('compression-progress', (event, progress) => callback(progress));
  }
});
