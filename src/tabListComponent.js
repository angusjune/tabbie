'use strict';

class TabList extends HTMLElement {

    constructor(favIconUrl, title, desc) {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        // wrapper
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'tab-list-item');

        // favicon wrapper
        const icon = document.createElement('span');
        icon.setAttribute('class', 'tab-list-item__icon');

        // favicon img
        const img = document.createElement('img');
        img.src = favIconUrl;
        icon.appendChild(img);

        // title
        const info = document.createElement('span');
        info.setAttribute('class', 'tab-list-item__title');
        info.textContent = title;

        // additional info
        const addition = document.createElement('div');
        addition.setAttribute('class', 'tab-list-item__addition');
        addition.textContent = desc;

        const style = document.createElement('style');
        style.textContent = `
        :host {
            width: 100%;
        }
        .tab-list-item {
            width: 100%;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            width: 100%;
            padding-inline-start: 16px;
            padding-inline-end: 16px;
            padding-top: 12px;
            padding-bottom: 12px;
            color: var(--primary);
            line-height: 18px;
            cursor: pointer;
          }
          .tab-list-item__icon {
            display: block;
            width: 18px;
            height: 18px;
            margin-right: 12px;
          }
          .tab-list-item__icon img {
            width: 100%;
          }
          .tab-list-item__title {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .tab-list-item__addition {
            background: var(--bg);
            color: var(--secondary);
            position: absolute;
            top: 8px;
            bottom: 8px;
            right: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-inline-start: 8px;
            padding-inline-end: 8px;
            border-radius: 20px;
            opacity: 0;
            transform: translateX(5px) scale(0.8);
            transform-origin: 100% 50%;
            transition: opacity 0.12s linear, transform 0.14s ease-out;
            will-change: transform, opacity;
          }
          .tab-list-item:hover .tab-list-item__addition {
            transform: translateX(0) scale(0.8);
            opacity: 1;
          }
        `;
        
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(icon);
        wrapper.appendChild(info);
        wrapper.appendChild(addition);
    }
}

customElements.define('tab-list', TabList);

export { TabList };