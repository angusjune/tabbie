"use strict";

import { LitElement, html, css } from "lit-element";

class TabList extends LitElement {
  static get properties() {
    return {
      id: { type: String },
      iconurl: { type: String },
      iconalt: { type: String },
      meta: { type: String },
    };
  }

  constructor() {
    super();
    this.iconalt = `favicon of this tab`;
  }

  static get styles() {
    return css`
      :host {
        width: 100%;
        outline: 0;
      }

      :host(:hover) .tab-list,
      :host(:focus) .tab-list {
        background: var(--list-hover-bg);
      }

      .tab-list {
        position: relative;
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
      .tab-list__icon {
        display: block;
        width: 18px;
        height: 18px;
        margin-right: 12px;
      }
      .tab-list__icon img {
        width: 100%;
      }
      .tab-list__title {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .tab-list__meta {
        background: var(--bg);
        color: var(--secondary);
        position: absolute;
        top: 8px;
        bottom: 8px;
        right: 8px;
        display: var(--tab-list-meta-display);
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
      :host(:hover) .tab-list__meta,
      :host(:focus) .tab-list__meta {
        transform: translateX(0) scale(0.8);
        opacity: 1;
      }
    `;
  }

  render() {
    return html`
      <div class="tab-list">
        <span class="tab-list__icon"><img src="${this.iconurl}" alt="${this.iconalt}"/></span>
        <span class="tab-list__title"><slot></slot></span>
        <div class="tab-list__meta">${this.meta}</div>
      </div>
    `;
  }
}

customElements.define("tab-list", TabList);
