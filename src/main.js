const { app, BrowserWindow, ipcMain } = require('electron');
const Processor = require('./processor');
const path = require('path');

var window = undefined;

const processor = Processor.default();

const createWindow = async () => {
    window = new BrowserWindow({
        width: 1080,
        height: 720,
        icon: path.join(__dirname, '/assets/icons/png/64x64.png')
    });

    processor.setWindowCallbacks(window);

    window.setMenu(null);
    window.loadFile(path.join(__dirname, '/app/index.html'));

    //window.webContents.openDevTools({ mode: 'bottom' });

    window.on('closed', () => window = null);
  
    // New
    ipcMain.on('start-measurement', () => {
        if (processor.controller.isConnected()) {
            processor.controller.send('SYN');
            processor.resetTimeout();
        } else {
            processor.sendMeasurementError();
        }
    });
    ipcMain.on('save-data', (_, data) => {
        processor.db.insert(data, () => {
            processor.db.selectAll((_, row) => {
                processor.sendDatabaseDataRow(row);
            });
            processor.db.selectAllPatients((_, row) => {
                processor.sendDatabasePatientRow(row);
            });
        });
    });
    ipcMain.on('delete-db-row', (_, id) => {
        processor.db.delete(id, () => {
            processor.db.selectAll((_, row) => {
                processor.sendDatabaseDataRow(row);
            });
        });
    });
    ipcMain.on('delete-patient', (_, id) => {
        processor.db.deletePatient(id, () => {
            processor.db.selectAllPatients((_, row) => {
                processor.sendDatabasePatientRow(row);
            });
            processor.db.selectAll((_, row) => {
                processor.sendDatabaseDataRow(row);
            });
        })
    });
    // Database
    ipcMain.on('get-data-rows', () => {
        processor.db.selectAll((_, row) => {
            processor.sendDatabaseDataRow(row);
        });
    });
    ipcMain.on('get-patient-rows', () => {
        processor.db.selectAllPatients((_, row) => {
            processor.sendDatabasePatientRow(row);
        });
    });
    // Options
    ipcMain.on('get-port-info', async () => await processor.checkPort());
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

processor.init();
