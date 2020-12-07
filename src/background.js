'use strict';

const LIMIT = 10;

chrome.tabs.query({}, tabs => {
  chrome.storage.local.set({ openedTabs: tabs});
});

chrome.tabs.onCreated.addListener(tab => {
  chrome.storage.local.get({
    openedTabs: []
  }, result => {
    let openedTabs = result.openedTabs;
    openedTabs.push(tab);

    chrome.storage.local.set({ openedTabs: openedTabs });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get({
    openedTabs: []
  }, result => {
    let openedTabs = result.openedTabs;

    // update existed tab
    const isSameId = (tab) => tab.id === tabId;
    const updatedTabIndex = openedTabs.findIndex(isSameId);    
    openedTabs[updatedTabIndex] = tab;

    chrome.storage.local.set({ openedTabs: openedTabs });
  });
});

chrome.tabs.onRemoved.addListener((tabId, info) => {
  if (!info.isWindowClosing) {

    chrome.storage.local.get({
      openedTabs: [],
      removedTabs: [],
    }, result => {
      let openedTabs  = result.openedTabs;
      let removedTabs = result.removedTabs;

      // find tabinfo
      const isSameId = (tab) => tab.id === tabId;
      const removedTabIndex = openedTabs.findIndex(isSameId);
      const removedTab = openedTabs[removedTabIndex];

      // ignore Chrome urls
      if (!removedTab.url.match(/^(chrome:\/\/).*/g)) {
        // find if any tabs with the same url already exists in removed tabs list
        const isUrlExists = (tab) => tab.url === removedTab.url;
        const sameUrlTabIndex = removedTabs.findIndex(isUrlExists);

        // remove the tab with the same url
        if (sameUrlTabIndex > -1) {
          removedTabs.splice(sameUrlTabIndex, 1);
        }

        removedTabs.unshift(removedTab); // add the tab to removed tabs list
      }
      
      openedTabs.splice(removedTabIndex, 1); // remove the tab from open tabs list

      if (removedTabs.length > LIMIT) {
        removedTabs.pop();
      }

      chrome.storage.local.set({ openedTabs: openedTabs, removedTabs: removedTabs });

      console.log('--openedTabs--', openedTabs);
      console.log('--removedTabs--', removedTabs);
    });
  }
});
