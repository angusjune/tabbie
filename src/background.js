'use strict';

const LIMIT = 10;

const setClosedSessions = () => {
  chrome.sessions.getRecentlyClosed({maxResults: 10}, sessions => {
    const limitedSessions = sessions.splice(0, LIMIT);
    chrome.storage.local.set({ closedSessions: limitedSessions });
  });
};

setClosedSessions();

chrome.tabs.onCreated.addListener(tab => {
  setClosedSessions();
});

chrome.tabs.onUpdated.addListener(tab => {
  setClosedSessions();
});

chrome.tabs.onRemoved.addListener(tab => {
  setClosedSessions();
});