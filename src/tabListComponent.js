class TabList extends HTMLElement {

    constructor(favIconUrl, title) {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        // const tabId = this.getAttribute('tabid');
        // const favIconUrl = this.getAttribute('faviconurl') || 'img/default.png';
        // const title = this.getAttribute('title');
        // const url   = this.getAttribute('url');

        // console.log(title);

        // wrapper
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'tab-list-item');

        // link
        // const anchor = document.createElement('a');
        // anchor.setAttribute('href', url);
        // anchor.setAttribute('id', `a-${tabId}`);
        // anchor.setAttribute('aria-labelledby', `t-${tabId}`)

        // favicon wrapper
        const icon = document.createElement('span');
        icon.setAttribute('class', 'tab-list-item__icon');

        // var imgUrl;
        // if (favIconUrl !== '') {
        //     imgUrl = this.getAttribute('img');
        // } else {
        //     imgUrl = 'img/default.png';
        // }

        // favicon img
        const img = document.createElement('img');
        img.src = favIconUrl;
        icon.appendChild(img);

        // title
        const info = document.createElement('span');
        info.setAttribute('class', 'tab-list-item__title');
        // info.setAttribute('id', `t-${tabId}`);
        info.textContent = title;

        // actions
        // const action = document.createElement('div');
        // action.setAttribute('class', 'tab-list-item__actions');

        // clear
        // const btnClear = document.createElement('button');
        // btnClear.setAttribute('class', 'tab-list__btn tab-list__btn--clear');
        // btnClear.setAttribute('data-tabid', tabId);
        // btnClear.setAttribute('aria-label', 'Clear this history');
        // action.appendChild(btnClear);

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
        `;
        
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        // anchor.appendChild(icon);
        // anchor.appendChild(info);
        wrapper.appendChild(icon);
        wrapper.appendChild(info);
        // wrapper.appendChild(action);
    }
};

customElements.define('tab-list', TabList);

export { TabList };