'use strict';

let darkMode         = 'auto';
let itemLimit        = 10;
let showSearch       = false;
let showLastModified = true;
let useTabs          = false;

chrome.storage.sync.get({
  darkMode: 'auto',
  itemLimit: 10,
  showSearch: false,
  showLastModified: true,
  useTabs: false
}, result => {
  darkMode  = result.darkMode;
  itemLimit = result.itemLimit;

  setClosedSessions(itemLimit);
});

const setClosedSessions = (itemLimit = 10) => {
  chrome.sessions.getRecentlyClosed({maxResults: itemLimit}, sessions => {
    const limitedSessions = sessions.splice(0, itemLimit);
    chrome.storage.local.set({ closedSessions: limitedSessions });
  });
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.itemLimit) {
    itemLimit = changes.itemLimit.newValue;
    setClosedSessions(itemLimit);
  }
});

chrome.tabs.onCreated.addListener(tab => {
  setClosedSessions(itemLimit);
});

chrome.tabs.onUpdated.addListener(tab => {
  setClosedSessions(itemLimit);
});

chrome.tabs.onRemoved.addListener(tab => {
  setClosedSessions(itemLimit);
});

chrome.runtime.onMessage.addListener(message => {
  if (message.isBrowserDark || darkMode === 'dark') {
    chrome.action.setIcon({ 
      path: {
        16: `icons/action-icon-light-16.png`,
        24: `icons/action-icon-light-24.png`,
        32: `icons/action-icon-light-32.png`,
      }
    });
  } else {
    chrome.action.setIcon({ path: {
      16: `icons/action-icon-16.png`,
      24: `icons/action-icon-24.png`,
      32: `icons/action-icon-32.png`,
    }});
  }
});