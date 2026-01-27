<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    modelValue?: boolean,
    disabled?: boolean,
    inset?: boolean,
}>(), {
    modelValue: false,
    disabled: false,
    inset: false,
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void,
}>()

const inputModelValue = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})
</script>

<template>
    <label class="switch" :class="{'switch--inset': inset}" :aria-checked="inputModelValue" :aria-disabled="disabled">
        <input
            class="switch__input"
            type="checkbox"
            v-model="inputModelValue"
            :disabled="disabled"
        />
        <div class="switch__track"></div>
        <div class="switch__thumb"></div>

    </label>
</template>

<style lang="postcss" scoped>
.switch {
    --track-height: 16px;
    --track-width: 26px;
    --thumb-size: 8px;

    display: inline-flex;
    position: relative;

    &--inset {
        --track-height: 22px;
        --track-width: 44px;
        --thumb-size: 18px;
    }

    &[aria-checked=true] {
        .switch__track {
            background: var(--switch-track-background-checked);
            box-shadow: none;
        }
        .switch__thumb {
            background: var(--switch-thumb-background-checked);
            transform: translateX(calc((var(--track-width) - var(--track-height)))) scale(1.5);
        }
    }

    &:focus .switch__thumb__ripple {
        transform: scale(1);
        opacity: 1;
    }

    &__input {
        display: none;
    }

    &__track {
        position: relative;
        width: var(--track-width);
        height: var(--track-height);
        background: var(--switch-track-background-unchecked);
        border-radius: 999px;
        transition: background 0.2s ease-out;
        box-shadow: inset 0 0 0 1px var(--switch-thumb-background-unchecked);
    }

    &__thumb {
        position: absolute;
        top: calc(var(--track-height) / 2 - var(--thumb-size) / 2);
        left: calc(var(--track-height) / 2 - var(--thumb-size) / 2);
        background: var(--switch-thumb-background-unchecked);
        width: var(--thumb-size);
        height: var(--thumb-size);
        border-radius: 50%;
        transition: transform 0.12s ease-out, background 0.12s ease-out;
    }
    &[aria-disabled=true] {
        opacity: 0.5;
        cursor: not-allowed;
    }
}
</style>