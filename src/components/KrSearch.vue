<script lang="ts" setup>
import { ref, computed, VNodeRef } from 'vue'
import { msg } from '@/utils/i18n'
import IconSearch from '~icons/material-symbols/search-rounded'
import IconClose from '~icons/material-symbols/close-rounded'

const props = withDefaults(defineProps<{
    modelValue?: string,
}>(), {
    modelValue: '',
})

const inputRef = ref<VNodeRef | undefined>(undefined)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void,
}>()

const value = computed<string>({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
        inputRef.value?.focus()
    }
})

</script>

<template>
    <div class="textfield">
        <div class="textfield__icon">
            <IconSearch />
        </div>
        <input
            ref="inputRef"
            class="textfield__input"
            type="text"
            v-model="value"
            autofocus
            :aria-label="msg('search')"
        />
        <div class="textfield__icon textfield__icon--clear" v-show="value" @click="value=''" role="button" :aria-label="msg('clear')">
            <IconClose />
        </div>
    </div>
</template>

<style scoped>
.textfield {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'icon input clear';
    align-items: center;
    gap: 4px;
    border-radius: 999px;
    background: var(--textfield-background);

    &:focus-within {
        .textfield__icon {
            opacity: 0.6;
        }
    }

    &__icon {
        grid-area: icon;
        display: grid;
        place-items: center;
        padding: var(--node-padding-vertical, var(--spacing-2));
        box-sizing: content-box;
        width: var(--node-icon-size, 18px);
        height: var(--node-icon-size, 18px);
        font-size: var(--node-icon-size, 18px);
        color: var(--on-surface-primary);
        opacity: 0.35;
        transition: opacity 0.15s ease;

        &--clear {
            grid-area: clear;
        }
    }

    &__input {
        grid-area: input;
        border: none;
        outline: none;
        background-color: transparent;
        font-size: var(--node-font-size, 14px);
        color: var(--on-surface-primary);

        &:focus {
            outline: none;
        }
    }
}
</style>
