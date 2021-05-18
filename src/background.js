'use strict';

const setClosedSessions = () => {
  chrome.storage.sync.get({ itemLimit: 10 }, props => {
    const itemLimit = props.itemLimit;

    chrome.sessions.getRecentlyClosed({maxResults: itemLimit}, sessions => {
      const limitedSessions = sessions.splice(0, itemLimit);
      chrome.storage.local.set({ closedSessions: limitedSessions });
    });
  });
};

chrome.runtime.onStartup.addListener(() => {
  setClosedSessions();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.itemLimit) {
    setClosedSessions();
  }
});

chrome.tabs.onCreated.addListener(tab => {
  setClosedSessions();
});

chrome.tabs.onUpdated.addListener(tab => {
  setClosedSessions();
});

chrome.tabs.onRemoved.addListener(tab => {
  setClosedSessions();
});