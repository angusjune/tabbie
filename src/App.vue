<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Options } from './options-storage'
import { defaults } from './options-storage'
import TbList from '@/components/TbList.vue'
import KrSearch from '@/components/KrSearch.vue'
import TbEmptyState from '@/components/TbEmptyState.vue'

const i18n = chrome.i18n.getMessage

const sessions = ref([])
const options  = ref<Options>(defaults)
const hasInit  = ref(false)

const list = computed(() => {
  if (searchTerm.value) {
    return sessions.value.filter((session: chrome.sessions.Session) => {
      if (session.tab) {
        return session.tab.title?.toLowerCase().includes(searchTerm.value.toLowerCase())
      }
      if (session.window) {
        return session.window.tabs?.some((tab: chrome.tabs.Tab) => tab.title?.toLowerCase().includes(searchTerm.value.toLowerCase()))
      }
    })
  } else {
    return sessions.value
  }
})

const searchTerm = ref('')

chrome.runtime.sendMessage({ type: 'GET_SESSIONS' }, res => {
  sessions.value = res
  hasInit.value = true
})

chrome.runtime.sendMessage({ type: 'GET_OPTIONS' }, res => {
  options.value = res
})

function restoreSession(sessionId: string) {
  chrome.runtime.sendMessage({ type: 'RESTORE_SESSION', data: { sessionId } })
}

const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches

watch(options, (val) => {
  const iconTheme = val.iconColor === 'auto' ? (isDarkTheme ? 'light' : 'dark') : val.iconColor
  chrome.runtime.sendMessage({ type: 'SET_ICON_THEME', data: { theme: iconTheme } })
})

function openHistory() {
  chrome.tabs.create({ url:'chrome://history', active: false })
}

</script>

<template>
  <div class="container" :class="{'theme-light': options.theme === 'light', 'theme-dark': options.theme === 'dark'}">
    <div class="search-container" v-if="options.showSearch">
      <KrSearch v-model="searchTerm" />
    </div>
    <div class="list-container" :class="{'list-container--empty':  list.length < 1, 'list-container--custom-scrollbar': !options.useNativeScrollbar}">
      <TbList
        v-for="({ lastModified, window, tab }, index) in list"
        :key="index"
        :id="tab ? tab.sessionId : window.sessionId"
        :title="tab ? tab.title : i18n('list_title_window', window.tabs.length.toString())"
        :url="tab ? tab.url : ''"
        :iconUrl="tab ? tab.favIconUrl : ''"
        :lastModified="lastModified"
        :showLastModified="options.showLastModified"
        :type="tab ? 'tab' : 'window'"
        @click="restoreSession(tab ? tab.sessionId : window.sessionId)"
      />

      <template v-if="hasInit">
      <Transition name="fade">
      <TbEmptyState v-if="searchTerm && list.length < 1" :title="i18n('empty_search_title')">
        <p class="line">{{i18n('empty_search_desc')}}</p>
        <p class="line">{{i18n('empty_search_desc_line2')}}<span class="link" @click="openHistory">{{i18n('browser_history')}}</span></p>
      </TbEmptyState>

      <TbEmptyState v-else-if="list.length < 1" :title="i18n('empty_tabs_title')">
        {{i18n('empty_tabs_desc')}}
      </TbEmptyState>
      </Transition>
      </template>

    </div>
  </div>
</template>

<style lang="postcss" scoped>
.container {
  width: 340px;
  min-height: 300px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-container {
  padding: var(--padding-horizontal);
}

.list-container {
  padding: 0 0 8px 0;
  flex: 1;
  overflow: hidden auto;
  max-height: 500px;

  &:first-child {
    padding-top: 8px;
  }

  &--empty {
    display: grid;
    place-items: center;

    .line {
      margin: 0 0 2px 0;
    }

    .link {
      color: var(--on-surface-primary);
      cursor: pointer;
    }
  }

  &--custom-scrollbar{
    --scrollbar-thumb-color-rgb: 0, 0, 0;

    @media (prefers-color-scheme: dark) {
        --scrollbar-thumb-color-rgb: 255, 255, 255;
    }

    overflow: hidden auto;

    &::-webkit-scrollbar {
        width: 16px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(var(--scrollbar-thumb-color-rgb), 0);
        border: 4px solid transparent;
        border-radius: 100px;
        background-clip: content-box;

        &:hover {
            background: rgba(var(--scrollbar-thumb-color-rgb), 0.2);
        }
    }

    &:hover {
        &::-webkit-scrollbar-thumb {
            background: rgba(var(--scrollbar-thumb-color-rgb), 0.1);
            border: 4px solid transparent;
            border-radius: 100px;
            background-clip: content-box;
        }
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transition: none;
}
</style>
