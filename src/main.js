const { app, BrowserWindow, ipcMain } = require('electron');
const Processor = require('./processor');
const path = require('path');

var window = undefined;

const processor = Processor.default().init();

const createWindow = async () => {
    window = new BrowserWindow({
        width: 1080,
        height: 720,
        icon: path.join(__dirname, '/assets/icons/png/64x64.png')
    });

    processor.setWindowCallbacks(window);

    //window.setMenu(null);
    window.loadFile(path.join(__dirname, '/app/index.html'));

    //window.webContents.openDevTools({ mode: 'bottom' });

    window.on('closed', () => {
        win = null;
    });

    // View
    ipcMain.on('can-save', (ev) => {
        ev.sender.send('can-save-request', processor.canSave());
    });
    ipcMain.on('save-data', () => {
        processor.saveData();
    });
    ipcMain.on('clear-data', () => {
        processor.clearData();
    });
    // Database
    ipcMain.on('request-data', (ev) => {
        processor.db.selectAll((_, row) => {
            ev.sender.send('data-row-request', row);
        });
    });
    // Connection
    ipcMain.on('port-info', async (ev) => {
        await processor.checkPort();
    });
    ipcMain.on('send-command', (ev) => {
        processor.controller.send('s');
    });
};

app.on('ready', async () => {
    createWindow();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (window === null) {
        createWindow();
    }
});
app.on('quit', () => {
    processor.shutdown();
});
