'use strict';

const LIMIT = 10;

const setClosedSessions = () => {
  chrome.sessions.getRecentlyClosed({maxResults: LIMIT}, sessions => {
    chrome.storage.local.set({ closedSessions: sessions });
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