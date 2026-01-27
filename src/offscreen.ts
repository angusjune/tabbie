import { MESSAGE_TYPES } from '@/constants';
import { Themes } from './options-storage';

/**
 * Offscreen document for detecting system color scheme changes
 * This runs in an offscreen context instead of content scripts for better performance
 */

console.log('Offscreen document loaded for color scheme detection');


let cachedScheme: Themes['icon'] = 'light';

function getColorScheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const scheme = mediaQuery.matches ? 'dark' : 'light';

    if (cachedScheme === scheme) {
        return;
    }

    cachedScheme = scheme;

    chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.SET_COLOR_SCHEME,
        data: { scheme }
    }).catch(error => {
        console.error('Error sending color scheme change:', error);
    });

    console.log('Color scheme changed to:', scheme);
}

getColorScheme();

// Currently there's no way to detect color scheme changes in offscreen document
// This is a workaround to detect changes every 3 seconds
setInterval(getColorScheme, 3000);
