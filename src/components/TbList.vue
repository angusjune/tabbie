<script setup lang="ts">
import { computed } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { zhHK, zhTW, zhCN } from 'date-fns/locale'
import IconWindow from '~icons/material-symbols/tab-outline-rounded'
import IconTab from '~icons/material-symbols/public'

const props = withDefaults(defineProps<{
    title?: string
    url?: string,
    iconUrl?: string,
    lastModified?: number,
    showLastModified?: boolean,
    type: 'tab' | 'window'
}>(), {
    showLastModified: true,
    type: 'tab',
})

const locale = chrome.i18n.getUILanguage()

const formattedTime = computed(() => {
    if (props.lastModified) {
        return formatDistanceToNow(props.lastModified * 1000, {
            locale: locale === 'zh-TW' ? zhTW : locale === 'zh-CN' ? zhCN : locale === 'zh-HK' ? zhHK : undefined
        })
    }
})
</script>

<template>
    <div class="list" tabindex="0" role="list">
        <div class="list__icon" :style="{backgroundImage: `url(${iconUrl})`}">
            <template v-if="!iconUrl">
                <IconWindow v-if="type === 'window'" />
                <IconTab v-else />
            </template>
        </div>
        <div class="list__content">{{title}}</div>
        <div class="list__addon" v-if="showLastModified">{{formattedTime}}</div>
    </div>
</template>

<style lang="postcss" scoped>
@property --list-icon-size {
    syntax: '<length>';
    initial-value: 20px;
    inherits: false;
}

.list {
    position: relative;
    display: grid;
    grid-template-columns: var(--list-icon-size) 1fr;
    grid-template-areas: 'icon content';
    grid-column-gap: 16px;
    align-items: center;
    cursor: default;
    padding: 12px var(--padding-horizontal);

    &:hover, &:focus {
        background: var(--ripple);

        .list__addon {
            opacity: 1;
            transform: translateX(0);
        }
    }

    &__icon {
        grid-area: icon;
        width: var(--list-icon-size);
        height: var(--list-icon-size);
        font-size: var(--list-icon-size);
        color: var(--on-surface-secondary);
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
    }

    &__content {
        color: var(--on-surface-primary);
        grid-area: content;
        font-size: 14px;
        line-height: var(--list-icon-size);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    &__addon {
        color: var(--on-surface-secondary);
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 999px;
        background: var(--surface);
        position: absolute;
        right: 8px;
        transform: translateX(5px);
        opacity: 0;
        transition: 0.12s ease;
        transition-property: transform, opacity;
    }
}
</style>