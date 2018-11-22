// Tabs
newTab.addEventListener('click', () => selectTab(0));
resultTab.addEventListener('click', () => selectTab(1));
databaseTab.addEventListener('click', () => selectTab(2));
connectionTab.addEventListener('click', () => selectTab(3));

// Connection
conConnectButton.addEventListener('click', (ev) => {
    if (conConnectButton.hasAttribute('disabled')) {
        return;
    }

    conConnectButton.classList.add('is-loading');
    ipcRenderer.send('get-port-info');
});
