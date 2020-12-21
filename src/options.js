'use strict';

import './options.scss';
import {MDCSwitch} from '@material/switch';
import {MDCFormField} from '@material/form-field';
import {MDCRadio} from '@material/radio';
import {MDCSlider} from '@material/slider';

const sliderItemLimit = new MDCSlider(document.querySelector('#itemLimit'));
const radio = new MDCRadio(document.querySelector('.mdc-radio'));
const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
formField.input = radio;

const switchShowSearch       = new MDCSwitch(document.querySelector('#showSearch'));
const switchShowLastModified = new MDCSwitch(document.querySelector('#showLastModified'));
// const switchUseTabs          = new MDCSwitch(document.querySelector('#useTabs'));

chrome.storage.sync.get({
    darkMode: 'auto',
    itemLimit: 10,
    showSearch: false,
    showLastModified: true,
    useTabs: false
}, result => {
    new MDCRadio(document.querySelector(`#darkMode-${result.darkMode}`)).checked = true;

    sliderItemLimit.setValue(result.itemLimit);
    document.querySelector('#itemLimitVal').textContent = result.itemLimit;

    switchShowSearch.checked = result.showSearch;
    switchShowLastModified.checked = result.showLastModified;
    // switchUseTabs.checked = result.useTabs;
});

const darkModeRadios = document.querySelectorAll('[name=dark-mode]');
darkModeRadios.forEach(item => {
    item.addEventListener('change', e => {
        if(e.target.checked) {
            chrome.storage.sync.set({ 'darkMode': e.target.value });
        }
    });
});

sliderItemLimit.listen('MDCSlider:change', e => {
    const value = e.detail.value;
    chrome.storage.sync.set({ 'itemLimit': value});
});

sliderItemLimit.listen('MDCSlider:input', e => {
    const value = e.detail.value;
    document.querySelector('#itemLimitVal').textContent = value;
});

document.querySelector('#showSearchNative').addEventListener('change', e => {
    chrome.storage.sync.set({ 'showSearch': e.target.checked });
});

document.querySelector('#showLastModifiedNative').addEventListener('change', e => {
    chrome.storage.sync.set({ 'showLastModified': e.target.checked });
});

// i18n
document.querySelectorAll('[data-msg]').forEach(el => {
    const localeStr = chrome.i18n.getMessage(el.dataset.msg);
    el.textContent = localeStr;
});

document.querySelectorAll('[data-aria-msg]').forEach(el => {
    const localeStr = chrome.i18n.getMessage(el.dataset.ariamsg);
    el.setAttribute('aria-label', localeStr);
});