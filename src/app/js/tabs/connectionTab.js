let renderConnected = (info) => {
    conPortName.innerHTML = info.name;
    conPortId.innerHTML = info.id;
    conPortManufacturer.innerHTML = info.mf;
    conConnectButton.setAttribute('class', 'button is-success');
    conConnectButton.setAttribute('disabled', '');
    conConnectButton.innerHTML = 'Connected';
};

let renderNotConnected = () => {
    conPortName.innerHTML = conPortId.innerHTML = conPortManufacturer.innerHTML = 'Not connected';
    conConnectButton.setAttribute('class', 'button is-danger');
    conConnectButton.removeAttribute('disabled');
    conConnectButton.innerHTML = 'Connect';
};

let renderPortInfo = (info) => {
    if (info) {
        renderConnected(info);
    } else {
        renderNotConnected();
    }
};

renderNotConnected();
