'use strict';

import './popup.scss';
import { TabList } from './tabListComponent';

(function() {

  chrome.storage.local.get({
    removedTabs: []
  }, result => {
    const removedTabs = result.removedTabs;

    removedTabs.forEach(tab => {
      const tabList = document.createElement('div');
      tabList.setAttribute('id', tab.id);
      tabList.classList.add('tab-list');

      const tabListItem = new TabList(tab.favIconUrl, tab.title);

      // actions
      const action = document.createElement('div');
      action.setAttribute('class', 'tab-list__actions');

      // clear
      const btnClear = document.createElement('button');
      btnClear.setAttribute('class', 'tab-list__btn tab-list__btn--clear');
      btnClear.setAttribute('aria-label', 'Clear this history');
      btnClear.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 13H5V11H19V13Z" fill="black"/>
      </svg>                  
      `;

      btnClear.addEventListener('click', e => {
        e.preventDefault();
        tabList.parentNode.removeChild(tabList);
        chrome.storage.local.set({ removedTabs: removeTabFromList(tab.id) });
      });

      action.appendChild(btnClear);

      tabList.appendChild(tabListItem);
      tabList.appendChild(action);


      tabListItem.addEventListener('click', e => {
        chrome.tabs.create({ url: tab.url});
        tabList.parentNode.removeChild(tabList);
        chrome.storage.local.set({ removedTabs: removeTabFromList(tab.id) });
      });

      document.querySelector('#listGroup').appendChild(tabList);
    });

    const removeTabFromList = (tabId) => {
      const isSameId = (tab) => tab.id === tabId;
      const removesTabIndex = removedTabs.findIndex(isSameId);
      let newRemovedTabs = removedTabs;
      newRemovedTabs.splice(removesTabIndex, 1);

      return newRemovedTabs;
    };
  });
})();
