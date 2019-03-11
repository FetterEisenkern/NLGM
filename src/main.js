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

    //window.setMenu(null);
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
        processor.getDb().insert(data, () => {
            processor.getDb().selectAll((_, row) => {
                processor.sendDatabaseDataRow(row);
            });
            processor.getDb().selectAllPatients((_, row) => {
                processor.sendDatabasePatientRow(row);
            });
        });
    });
    ipcMain.on('delete-db-row', (_, id) => {
        processor.getDb().delete(id, () => {
            processor.getDb().selectAll((_, row) => {
                processor.sendDatabaseDataRow(row);
            });
        });
    });
    ipcMain.on('delete-patient', (_, id) => {
        processor.getDb().deletePatient(id, () => {
            processor.getDb().selectAllPatients((_, row) => {
                processor.sendDatabasePatientRow(row);
            });
            processor.getDb().selectAll((_, row) => {
                processor.sendDatabaseDataRow(row);
            });
        })
    });
    // Database
    ipcMain.on('get-data-rows', () => {
        processor.getDb().selectAll((_, row) => {
            processor.sendDatabaseDataRow(row);
        });
    });
    ipcMain.on('get-patient-rows', () => {
        processor.getDb().selectAllPatients((_, row) => {
            processor.sendDatabasePatientRow(row);
        });
    });
    // Options
    ipcMain.on('get-port-info', async () => await processor.checkPort());
    ipcMain.on('connect-to-cloud', (_, config) => processor.cloud.init(config));
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
