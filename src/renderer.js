// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const compressBtn = document.getElementById('compressBtn');
const changeFileBtn = document.getElementById('changeFileBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const resultSection = document.getElementById('resultSection');
const outputSize = document.getElementById('outputSize');
const outputPath = document.getElementById('outputPath');
const newFileBtn = document.getElementById('newFileBtn');
const errorSection = document.getElementById('errorSection');
const errorMessage = document.getElementById('errorMessage');
const retryBtn = document.getElementById('retryBtn');

let selectedFile = null;

// Format file size
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// Show/hide sections
function showSection(section) {
  dropZone.classList.add('hidden');
  fileInfo.classList.add('hidden');
  progressSection.classList.add('hidden');
  resultSection.classList.add('hidden');
  errorSection.classList.add('hidden');
  
  section.classList.remove('hidden');
}

// Reset to initial state
function resetUI() {
  selectedFile = null;
  progressFill.style.width = '0%';
  progressPercent.textContent = '0';
  showSection(dropZone);
}

// Handle file selection
async function selectFile() {
  const file = await window.electronAPI.selectVideo();
  
  if (file) {
    selectedFile = file;
    fileName.textContent = file.name;
    fileSize.textContent = formatSize(file.size);
    showSection(fileInfo);
  }
}

// Handle compression
async function compressVideo() {
  if (!selectedFile) return;
  
  const savePath = await window.electronAPI.selectSaveLocation(selectedFile.name);
  
  if (!savePath) return;
  
  showSection(progressSection);
  compressBtn.disabled = true;
  
  try {
    const result = await window.electronAPI.compressVideo(selectedFile.path, savePath);
    
    if (result.success) {
      outputSize.textContent = formatSize(result.outputSize);
      outputPath.textContent = result.outputPath;
      showSection(resultSection);
    }
  } catch (error) {
    errorMessage.textContent = error.message || 'An error occurred during compression';
    showSection(errorSection);
  }
  
  compressBtn.disabled = false;
}

// Listen for progress updates
window.electronAPI.onCompressionProgress((progress) => {
  progressFill.style.width = progress + '%';
  progressPercent.textContent = progress;
});

// Event listeners
dropZone.addEventListener('click', selectFile);
changeFileBtn.addEventListener('click', selectFile);
compressBtn.addEventListener('click', compressVideo);
newFileBtn.addEventListener('click', resetUI);
retryBtn.addEventListener('click', resetUI);
