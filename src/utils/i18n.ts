export function msg(key: string, ...args: string[]): string {
    return chrome.i18n.getMessage(key, args)
}