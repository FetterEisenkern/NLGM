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

    // New
    ipcMain.on('start-measurement', (ev) => {
        var measurement = {
            m1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 345, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0],
            m2: [0, 0, 0, 0, 0, 0, 10, 333, 10, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0]
        };
        ev.sender.send('measurement', measurement);
    });
    ipcMain.on('save-data', (_, data) => {
        processor.db.insert(data.patient, data.data);
    });
    // Database
    ipcMain.on('get-db-rows', (ev) => {
        processor.db.selectAll((_, row) => {
            ev.sender.send('db-row', row);
        });
    });
    // Connection
    ipcMain.on('get-port-info', async (_) => {
        await processor.checkPort();
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
