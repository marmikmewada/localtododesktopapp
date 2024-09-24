const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;
const todosFilePath = path.join(__dirname, 'todos.json');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Enable Node integration
      contextIsolation: false, // Disable context isolation
    },
  });

  mainWindow.loadFile('index.html');
  mainWindow.webContents.openDevTools(); // Open DevTools for debugging

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle IPC calls for CRUD operations
ipcMain.on('load-todos', (event) => {
  fs.readFile(todosFilePath, (err, data) => {
    if (err) {
      event.reply('todos-loaded', []);
    } else {
      const todos = JSON.parse(data.toString());
      event.reply('todos-loaded', todos);
    }
  });
});

ipcMain.on('add-todo', (event, todo) => {
  fs.readFile(todosFilePath, (err, data) => {
    const todos = err ? [] : JSON.parse(data.toString());
    todos.push({ text: todo, completed: false });
    fs.writeFile(todosFilePath, JSON.stringify(todos), (err) => {
      if (err) console.error('Failed to save todos:', err);
      event.reply('todo-added', todos);
    });
  });
});

ipcMain.on('toggle-todo', (event, index) => {
  fs.readFile(todosFilePath, (err, data) => {
    const todos = err ? [] : JSON.parse(data.toString());
    todos[index].completed = !todos[index].completed;
    fs.writeFile(todosFilePath, JSON.stringify(todos), (err) => {
      if (err) console.error('Failed to save todos:', err);
      event.reply('todo-toggled', todos);
    });
  });
});

ipcMain.on('delete-todo', (event, index) => {
  fs.readFile(todosFilePath, (err, data) => {
    const todos = err ? [] : JSON.parse(data.toString());
    todos.splice(index, 1);
    fs.writeFile(todosFilePath, JSON.stringify(todos), (err) => {
      if (err) console.error('Failed to save todos:', err);
      event.reply('todo-deleted', todos);
    });
  });
});

ipcMain.on('edit-todo', (event, index, newText) => {
  fs.readFile(todosFilePath, (err, data) => {
    const todos = err ? [] : JSON.parse(data.toString());
    todos[index].text = newText;
    fs.writeFile(todosFilePath, JSON.stringify(todos), (err) => {
      if (err) console.error('Failed to save todos:', err);
      event.reply('todo-edited', todos);
    });
  });
});
