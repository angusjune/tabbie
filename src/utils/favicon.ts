export function faviconURL(u: string, size: number = 48) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", size.toString());
    return url.toString();
}