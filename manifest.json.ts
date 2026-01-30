import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
    "manifest_version": 3,
    "name": "__MSG_ext_name__",
    "description": "__MSG_ext_desc__",
    "short_name": "Tabbie",
    "version": "2.1.0",
    "icons": {
        "48": "icons/icon-48.png",
        "128": "icons/icon-128.png"
    },
    "action": { 
        "default_popup": "index.html",
        "default_icon": {
            "16": "icons/tab-16.png",
            "24": "icons/tab-24.png",
            "32": "icons/tab-32.png"
        }
    },
    "side_panel": {
        "default_path": "side-panel.html"
    },
    "background": {
        "service_worker": "src/background.ts",
        "type": "module"
    },
    "options_ui": {
        "page": "options.html"
    },
    "permissions": [
        "storage",
        "sessions",
        "tabs",
        "favicon",
        "contextMenus",
        "sidePanel",
        "offscreen"
    ],
    "default_locale": "en",
    "minimum_chrome_version": "116"
});