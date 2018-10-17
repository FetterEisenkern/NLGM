const viewTab = document.querySelector('#view-tab');
const databaseTab = document.querySelector('#database-tab');
const connectionTab = document.querySelector('#connection-tab');

const view = document.querySelector('#view');
const database = document.querySelector('#database');
const connection = document.querySelector('#connection');

const port = document.querySelector('#check-port');

const tabs = [
    { tab: viewTab, div: view },
    { tab: databaseTab, div: database },
    { tab: connectionTab, div: connection }
];

let selectTab = ({ tab, div }, others) => {
    // Select tab & show div
    tab.setAttribute('class', 'is-active');
    div.removeAttribute('class');
    // Unselect and hide others
    for (let {tab, div} of others) {
        tab.removeAttribute('class');
        div.setAttribute('class', 'hidden');
    }
};

// Handle tabs
viewTab.addEventListener('click', () => selectTab(tabs[0], [tabs[1], tabs[2]]));
databaseTab.addEventListener('click', () => selectTab(tabs[1], [tabs[0], tabs[2]]));
connectionTab.addEventListener('click', () => selectTab(tabs[2], [tabs[0], tabs[1]]));

let toggle = false;
port.addEventListener('click', () => {
    port.setAttribute('class', ((toggle) ? 'button is-danger' : 'button is-success'));
    toggle = !toggle;
});
