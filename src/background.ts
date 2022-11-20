import type { Options, Themes } from './options-storage';
import { optionsSync, themesLocal } from './options-storage';

const storedOptions = <Options>{};

function getSessions(maxResults = 10) {
    const filter: chrome.sessions.Filter = { maxResults };
    return new Promise((resolve) => {
        chrome.sessions.getRecentlyClosed(filter, resolve);
    });
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
                })
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
            return;
        case 'SET_ICON_THEME':
            const iconTheme: Themes['icon'] = data.theme;
            themesLocal.set({ icon: iconTheme });
            return;
        default:
            break;
    }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
        if (changes.themes) {
            // @ts-ignore
            const newTheme = themesLocal._decode(changes.themes.newValue);
            // set icon whenever the theme changes
            setIcon(newTheme.icon);
        }
    } else if (areaName === 'sync') {
        if (changes.options) {
            // @ts-ignore
            const newOptions = optionsSync._decode(changes.options.newValue);
            // update stored options
            Object.assign(storedOptions, newOptions);

            const { iconColor } = newOptions;
            // change icon immediately after options changed
            // currently unable to detect browser color scheme in sw
            if (iconColor === 'light' || iconColor === 'dark') {
                themesLocal.set({ icon: iconColor });
            }
        }
    }
});