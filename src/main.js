const { app, BrowserWindow, ipcMain } = require('electron');
const Processor = require('./processor');

var win = undefined;

const processor = Processor.default().init();

const createWindow = () => {
    win = new BrowserWindow({ width: 1080, height: 720 });
    win.loadFile('./app/index.html');

    win.webContents.openDevTools({ mode: 'bottom' });

    win.on('closed', () => {
        win = null;
    });

    /* ipcMain.on('bob', (ev, caller) => {
        win.webContents.send('alice', `Hi ${caller}! -Bob`);
        ev.sender.send('alice', `Hi ${caller}! -Bob`);
    });*/

    ipcMain.on('request-data', (ev, _) => {
        processor.db.selectAll((_, row) => {
            ev.sender.send('data-row-request', row);
        });
    });
};

app.on('ready', () => {
    createWindow();
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
app.on('quit', () => {
    processor.shutdown();
});
