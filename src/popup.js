'use strict';

import './popup.scss';
import { formatDistanceToNowStrict } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { TabList } from './tabListComponent';

(function() {

  // detect if browser is dark
  const isBrowserDark = window.matchMedia('(prefers-color-scheme: dark)').matches || chrome.extension.inIncognitoContext;
  chrome.runtime.sendMessage({ isBrowserDark: isBrowserDark });

  let sessions = [];

  // get sessions
  chrome.storage.local.get({ closedSessions: [] }, results => {
    sessions = results.closedSessions;

    // no recently closed sessions
    if (sessions.length < 1) {
      document.querySelector('body').classList.add('empty');
    }

    // loop through closed sessions
    sessions.forEach(session => {
      const tabList = createTabList(session);
      document.querySelector('#listGroup').appendChild(tabList);
    });

  });

  document.querySelector('#input').addEventListener('input', e => {
    const term = e.target.value;
    console.log(term);
    document.querySelector('#listGroup').innerHTML = '';

    let result = [];

    if (term === '') {
      result = sessions;
    } else {
      result = sessions.filter(obj => {
        let match;
        if (obj.tab) {
          // if matches title or url
          match = obj.tab.title.toLowerCase().search(term.toLowerCase()) > -1 || obj.tab.url.toLowerCase().search(term.toLowerCase()) > -1;
        }
        return match;
      });
    }

    if (result.length < 1) {
      // document.querySelector('body').classList.add('empty');
      document.querySelector('body').classList.add('empty--search');
    }

    result.forEach(session => {
      const tabList = createTabList(session);
      document.querySelector('#listGroup').appendChild(tabList);
    });

  });

  const createTabList = (session) => {
    const info = session.tab || session.window;
      const sessionId = info.sessionId;
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

        tabListIcon  = tab.favIconUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgMS41QzQuODYgMS41IDEuNSA0Ljg2IDEuNSA5QzEuNSAxMy4xNCA0Ljg2IDE2LjUgOSAxNi41QzEzLjE0IDE2LjUgMTYuNSAxMy4xNCAxNi41IDlDMTYuNSA0Ljg2IDEzLjE0IDEuNSA5IDEuNVpNOC4yNSAxNC45NDc1QzUuMjg3NSAxNC41OCAzIDEyLjA2IDMgOUMzIDguNTM1IDMuMDYgOC4wOTI1IDMuMTU3NSA3LjY1NzVMNi43NSAxMS4yNVYxMkM2Ljc1IDEyLjgyNSA3LjQyNSAxMy41IDguMjUgMTMuNVYxNC45NDc1Wk0xMy40MjUgMTMuMDQyNUMxMy4yMyAxMi40MzUgMTIuNjc1IDEyIDEyIDEySDExLjI1VjkuNzVDMTEuMjUgOS4zMzc1IDEwLjkxMjUgOSAxMC41IDlINlY3LjVINy41QzcuOTEyNSA3LjUgOC4yNSA3LjE2MjUgOC4yNSA2Ljc1VjUuMjVIOS43NUMxMC41NzUgNS4yNSAxMS4yNSA0LjU3NSAxMS4yNSAzLjc1VjMuNDQyNUMxMy40NDc1IDQuMzM1IDE1IDYuNDg3NSAxNSA5QzE1IDEwLjU2IDE0LjQgMTEuOTc3NSAxMy40MjUgMTMuMDQyNVoiIGZpbGw9IiNDNEM0QzQiLz4KPC9zdmc+Cg==';
        tabListTitle = tab.title;

      } else if (session.window) {
        // session is a window
        const window   = session.window;
        const tabCount = window.tabs.length;

        tabListIcon  = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yIDE0QzIgMTQuNTUyMyAyLjQ0NzcyIDE1IDMgMTVIMTVDMTUuNTUyMyAxNSAxNiAxNC41NTIzIDE2IDE0VjVDMTYgMy44OTU0MyAxNS4xMDQ2IDMgMTQgM0g0QzIuODk1NDMgMyAyIDMuODk1NDMgMiA1VjE0Wk00IDEzSDE0VjZINFYxM1oiIGZpbGw9IiNDNEM0QzQiLz4KPC9zdmc+Cg==';
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

      return tabList;
  };

  const humanReadableDate = comparisonDate => {
    const result = formatDistanceToNowStrict(comparisonDate);
    return result;
  };

})();
