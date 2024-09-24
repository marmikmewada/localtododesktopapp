const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
  fs: {
    readFile: (filePath, callback) => fs.readFile(filePath, callback),
    writeFile: (filePath, data, callback) => fs.writeFile(filePath, data, callback),
  },
  path: {
    join: (...args) => path.join(...args),
  },
});
