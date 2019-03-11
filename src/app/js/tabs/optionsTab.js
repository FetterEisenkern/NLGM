var renderConnected = (info) => {
    conPortName.innerHTML = info.name;
    conPortId.innerHTML = info.id;
    conPortManufacturer.innerHTML = info.mf;
    conConnectButton.setAttribute('class', 'button is-success');
    conConnectButton.setAttribute('disabled', '');
    conConnectButton.innerHTML = 'Connected';
};
var renderNotConnected = () => {
    conPortName.innerHTML = conPortId.innerHTML = conPortManufacturer.innerHTML = 'Not connected';
    conConnectButton.setAttribute('class', 'button is-danger');
    conConnectButton.removeAttribute('disabled');
    conConnectButton.innerHTML = 'Connect';
};
var renderPortInfo = (info) => {
    if (info) {
        renderConnected(info);
    } else {
        renderNotConnected();
    }
};

var renderCloudConnected = () => {
    conConnectToCloudButton.setAttribute('class', 'button is-success');
    conConnectToCloudButton.setAttribute('disabled', '');
    conConnectToCloudButton.innerHTML = 'Connected';
};
var renderCloudNotConnected = () => {
    conConnectToCloudButton.setAttribute('class', 'button is-danger');
    conConnectToCloudButton.removeAttribute('disabled');
    conConnectToCloudButton.innerHTML = 'Connect';
};

renderNotConnected();
renderCloudNotConnected();
