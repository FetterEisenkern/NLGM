var renderErrorModal = (message) => {
    errorModal.setAttribute('class', 'modal is-active');
    errorModalContent.innerHTML = message;
};
var closeErrorModal = () => {
    errorModal.setAttribute('class', 'modal');
};
