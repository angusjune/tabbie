'use strict';

import './popup.scss';
import { TabList } from './tabListComponent';

(function() {

  chrome.storage.local.get({ closedSessions: [] }, results => {
    const sessions = results.closedSessions;

    // no recently closed sessions
    if (sessions.length < 1) {
      document.querySelector('body').classList.add('empty');
    }

    // loop through closed sessions
    sessions.forEach(session => {
      const sessionId = session.tab.sessionId || session.window.sessionId;
      const lastModified = session.lastModified;

      // create list dom
      const tabList = document.createElement('div');
      tabList.setAttribute('id', sessionId);
      tabList.classList.add('tab-list');

      let tabListItem;

      if (session.tab) {
        // session is a tab
        const tab = session.tab;
        tabListItem = new TabList(tab.favIconUrl, tab.title);
        tabList.setAttribute('title', sessionId + ': ' + tab.url);

      } else if (session.window) {
        // session is a window
        const window = session.window;
        const tabCount = window.tabs.length;
        tabListItem = new TabList('', `Window (contains ${tabCount} tabs)`);
        tabList.classList.add('tab-list--window');
      }

      // clicking the list
      tabListItem.addEventListener('click', e => {
        chrome.sessions.restore(sessionId, restoredSession => {});
      });

      tabList.appendChild(tabListItem);
      document.querySelector('#listGroup').appendChild(tabList);
    });

  });
})();
