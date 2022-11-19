<script setup lang="ts">
import { computed } from 'vue'
import Search from '~icons/material-symbols/search-rounded'
import Cancel from '~icons/material-symbols/cancel-rounded'

const props = defineProps<{ modelValue?: string }>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const value = computed<string>({
    get() { return props.modelValue + '' },
    set(value: string) { emit('update:modelValue', value) }
})
</script>

<template>
    <div class="textfield">
        <div class="textfield__icon">
            <Search />
        </div>
        <input
            class="textfield__input"
            type="text"
            v-model="value"
            autofocus
            aria-label="search"
        />
        <div class="textfield__icon textfield__icon--clear" v-show="value" @click="value=''" role="button" aria-label="clear">
            <Cancel />
        </div>
    </div>
</template>

<style scoped lang="postcss">
.textfield {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'icon input clear';
    align-items: center;
    gap: 4px;
    border-radius: 999px;
    background: var(--kr-input-background);

    &:focus-within {
        .textfield__icon {
            opacity: 0.6;
        }
    }

    &__icon {
        grid-area: icon;
        display: grid;
        place-items: center;
        padding: var(--spacing-2);
        box-sizing: content-box;
        width: var(--icon-size, 18px);
        height: var(--icon-size, 18px);
        font-size: var(--icon-size, 18px);
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
        font-size: var(--font-size, 14px);
        color: var(--on-surface-primary);

        &:focus {
            outline: none;
        }
    }
}
</style>