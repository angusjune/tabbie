<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Options } from './options-storage'
import { defaults } from './options-storage'
import KrToggleRow from '@/components/KrToggleRow.vue'
import KrSelectGroup from '@/components/KrSelectGroup.vue'
import KrSelectItem from '@/components/KrSelectItem.vue'
import KrSliderRow from '@/components/KrSliderRow.vue'

const i18n = chrome.i18n.getMessage

const themeOptionItems = [
    { value: 'auto', label: i18n('options_theme_auto') },
    { value: 'light', label: i18n('options_theme_light') },
    { value: 'dark', label: i18n('options_theme_dark') },
]

const iconColorOptionItems = [
    { value: 'auto', label: i18n('options_theme_auto'), color: 'linear-gradient(135deg, #fff 0%, #fff 50%, #444 50.1%, #444 100%)' },
    { value: 'light', label: i18n('options_theme_light'), color: '#fff' },
    { value: 'dark', label: i18n('options_theme_dark'), color: '#444' },
]

const options: Options = reactive(defaults)

chrome.runtime.sendMessage({ type: 'GET_OPTIONS' }, res => {
    Object.assign(options, res)
})

watch(options, (newOptions) => {
    chrome.runtime.sendMessage({ type: 'SET_OPTIONS', data: newOptions })
}, { deep: true })

</script>

<template>
    <KrSelectGroup v-model="options.theme" :title="i18n('options_theme')" :items="themeOptionItems" distribution="space-around" hideSeparator>
        <template #items="{ item, selected }">
            <KrSelectItem v-bind="item" :selected="selected">
                <img alt="" :src="`assets/theme-${item.value}.svg`" />
            </KrSelectItem>
        </template>
    </KrSelectGroup>

    <KrSelectGroup v-model="options.iconColor" :title="i18n('options_icon_color')" :items="iconColorOptionItems">
        <template #items="{ item, selected }">
            <KrSelectItem v-bind="item" :selected="selected" circle>
                <div class="color-option" :style="{background: item.color}"></div>
            </KrSelectItem>
        </template>
    </KrSelectGroup>

    <KrSliderRow :title="i18n('options_item_limit')" :min="5" :max="25" :step="1" v-model="options.itemLimit" />

    <KrToggleRow :title="i18n('options_show_search')" v-model="options.showSearch" />

    <KrToggleRow :title="i18n('options_show_last_modified')" v-model="options.showLastModified" />

    <KrToggleRow :title="i18n('options_use_native_scrollbar')" v-model="options.useNativeScrollbar" hideSeparator />
</template>

<style lang="postcss" scoped>
.color-option {
    width: 24px;
    height: 24px;
    border-radius: 50%;
}
</style>