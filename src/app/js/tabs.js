// Handle tabs
const tabs = [
    { tab: newTab, div: newView },
    { tab: resultTab, div: resultView },
    { tab: databaseTab, div: databaseView },
    { tab: comparisonTab, div: comparisonView },
    { tab: optionsTab, div: optionsView }
];
var currentTab = 0;

var withPageLoader = true;

var selectTab = (index, loadPage = false, callback = undefined) => {
    let select = () => {
        if (index >= 0 && index <= 4) {
            // Select tab & show div
            let selected = tabs[currentTab = index];
            selected.tab.setAttribute('class', 'is-active');
            selected.div.setAttribute('class', 'tab');
            // Unselect and hide others
            for (let unselected of tabs) {
                if (unselected === selected) {
                    continue;
                }
                unselected.tab.removeAttribute('class');
                unselected.div.setAttribute('class', 'hidden tab');
            }
        }

        if (callback) {
            callback();
        }
    };

    if (loadPage && withPageLoader && optAnimationCheckbox.checked) {
        pageloader.classList.toggle('is-active');
        var timeout = setTimeout(() => {
            select();
            pageloader.classList.toggle('is-active');
            clearTimeout(timeout);
        }, 2000);
    } else {
        select();
    }
};
