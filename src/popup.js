'use strict';

import './popup.scss';
import { formatDistanceToNowStrict } from 'date-fns';
import { zhCN } from 'date-fns/locale'
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
      const lastModified = session.lastModified * 1000;
      const readableDate = humanReadableDate(new Date(lastModified));

      // create list dom
      const tabList = document.createElement('div');
      tabList.setAttribute('id', sessionId);
      tabList.classList.add('tab-list');

      let tabListItem;
      let tabListIcon  = '';
      let tabListTitle = '';

      if (session.tab) {
        // session is a tab
        const tab = session.tab;

        tabListIcon  = tab.favIconUrl;
        tabListTitle = tab.title;

      } else if (session.window) {
        // session is a window
        const window = session.window;
        const tabCount = window.tabs.length;

        tabListIcon  = '';
        tabListTitle = `Window (contains ${tabCount} tabs)`;

        tabList.classList.add('tab-list--window');
      }

      // creating tab list
      tabListItem = new TabList(tabListIcon, tabListTitle, readableDate);

      // clicking the list
      tabListItem.addEventListener('click', e => {
        chrome.sessions.restore(sessionId, restoredSession => {});
      });

      tabList.appendChild(tabListItem);
      document.querySelector('#listGroup').appendChild(tabList);
    });

  });

  const humanReadableDate = comparisonDate => {
    // Get the date in English locale to match English day of week keys
    // const compare = parseISO(comparisonDate.toISOString());
    // console.log(isThisHour(new Date(2022, 12, 11, 12,30)));

    const result = formatDistanceToNowStrict(comparisonDate);

    return result;
}
})();
