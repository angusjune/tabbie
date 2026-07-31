import type { Options, Themes } from './options-storage';
import { optionsSync, themesLocal } from './options-storage';

const storedOptions = <Options>{};
const CONTEXT_MENU_ID = 'open-tabbie-popup';

function getSessions(maxResults: number): Promise<chrome.sessions.Session[]> {
    const filter: chrome.sessions.Filter = { maxResults };
    return new Promise((resolve) => {
        chrome.sessions.getRecentlyClosed(filter, resolve);
    });
}

async function restoreLastClosedTab() {
    const sessions = await getSessions(1);
    if (sessions && sessions.length > 0) {
        const lastSession = sessions[0];
        if (lastSession.tab) {
            chrome.sessions.restore(lastSession.tab.sessionId);
        } else if (lastSession.window) {
            chrome.sessions.restore(lastSession.window.sessionId);
        }
    }
}

function updatePopupBehavior(quickUndoEnabled: boolean) {
    if (quickUndoEnabled) {
        // Remove default popup to enable onClicked
        chrome.action.setPopup({ popup: '' });
    } else {
        // Restore default popup
        chrome.action.setPopup({ popup: 'index.html' });
    }
}

async function getOptions() {
    const options: Options = await optionsSync.getAll();
    return options;
}

async function getThemes() {
    const themes: Themes = await themesLocal.getAll();
    return themes;
}

function setIcon(iconTheme: Themes['icon'] = 'dark') {
    const prefix = iconTheme === 'light' ? '-light' : '';
    const path = {
        16: `icons/tab-16${prefix}.png`,
        24: `icons/tab-24${prefix}.png`,
        32: `icons/tab-32${prefix}.png`
    }
    chrome.action.setIcon({ path });
}

function isEmpty(obj: any) {
    return Object.keys(obj).length === 0;
}

function init() {
    // init icon
    getThemes().then(themes => {
        setIcon(themes.icon);
    });
    // init options
    getOptions().then(options => {
        Object.assign(storedOptions, options);
        updatePopupBehavior(options.quickUndoLastClosedTab);
    });
}

init();

chrome.runtime.onStartup.addListener(() => {
    init();
});

chrome.runtime.onMessage.addListener(({ type, data }, sender, sendResponse) => {
    switch(type) {
        case 'GET_SESSIONS':
            if (isEmpty(storedOptions)) {
                getOptions().then(options => {
                    Object.assign(storedOptions, options);
                    getSessions(storedOptions.itemLimit).then(sendResponse);
                    return true;
                })
                return true;
            }
            getSessions(storedOptions.itemLimit).then(sendResponse);
            return true;
        case 'RESTORE_SESSION':
            chrome.sessions.restore(data.sessionId);
            return true;
        case 'GET_OPTIONS':
            if (isEmpty(storedOptions)) {
                getOptions().then(options => {
                    Object.assign(storedOptions, options);
                    sendResponse(storedOptions);
                    return true;
                })
                return true;
            }
            sendResponse(storedOptions);
            return true;
        case 'SET_OPTIONS':
            optionsSync.set(data);
            Object.assign(storedOptions, data);
            updatePopupBehavior(data.quickUndoLastClosedTab);
            return;
        case 'SET_ICON_THEME':
            const iconTheme: Themes['icon'] = data.theme;
            themesLocal.set({ icon: iconTheme });
            return;
        default:
            break;
    }
});

// Handle browser action click (only fires when popup is disabled)
chrome.action.onClicked.addListener(() => {
    if (storedOptions.quickUndoLastClosedTab) {
        restoreLastClosedTab();
    }
});

// Handle context menu click to open popup
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === CONTEXT_MENU_ID) {
        chrome.sidePanel.open({ windowId: tab?.windowId ?? 0 });
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
        if (changes.themes) {
            const newTheme = themesLocal.decode(changes.themes.newValue);
            // set icon whenever the theme changes
            setIcon(newTheme.icon);
        }
    } else if (areaName === 'sync') {
        if (changes.options) {
            const newOptions = optionsSync.decode(changes.options.newValue);
            // update stored options
            Object.assign(storedOptions, newOptions);

            const { iconColor, quickUndoLastClosedTab } = newOptions;
            // change icon immediately after options changed
            // currently unable to detect browser color scheme in sw
            if (iconColor === 'light' || iconColor === 'dark') {
                themesLocal.set({ icon: iconColor });
            }
            
            // update popup behavior when quickUndoLastClosedTab changes
            updatePopupBehavior(quickUndoLastClosedTab);
        }
    }
});
