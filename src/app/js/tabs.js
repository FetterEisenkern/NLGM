// Handle tabs
const tabs = [
    { tab: newTab, div: newView },
    { tab: resultTab, div: resultView },
    { tab: databaseTab, div: databaseView },
    { tab: connectionTab, div: connectionView },
      { tab: comparisonTab, div: comparisonView }
];

let selectTab = (index) => {
    // Select tab & show div
    let selected = tabs[index];
    selected.tab.setAttribute('class', 'is-active');
    selected.div.setAttribute('class', 'tab');
    // Unselect and hide others
    for (let unselected of tabs) {
        if (unselected == selected) {
            continue;
        }
        unselected.tab.removeAttribute('class');
        unselected.div.setAttribute('class', 'hidden tab');
    }
};
