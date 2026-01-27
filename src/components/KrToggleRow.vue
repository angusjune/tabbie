<script lang="ts" setup>
import KrSwitch from '@/components/KrSwitch.vue'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    modelValue?: boolean,
    title?: string,
    subtitle?: string,
    disabled?: boolean,
    hideSeparator?: boolean,
}>(), {
    modelValue: false,
    disabled: false,
    hideSeparator: false,
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
    <div class="toggle-row" :class="{'toggle-row--with-separator': !hideSeparator}">
        <label class="toggle-row__label">
            <input class="toggle-row__native" type="checkbox" v-model="inputModelValue" :aria-disabled="disabled" />
            <div class="toggle-row__title" v-if="title">{{title}}</div>
            <div class="toggle-row__subtitle" v-if="subtitle">{{subtitle}}</div>
        </label>
        <KrSwitch v-model="inputModelValue" :disabled="disabled" />
    </div>
</template>

<style scoped>
.toggle-row {
    box-sizing: border-box;
    padding: 16px;
    display: flex;
    align-items: center;
    touch-action: none;

    &--with-separator {
        border-bottom: 1px solid var(--separator);
    }

    &__label {
        flex: 1;
        cursor: pointer;
        user-select: none;
    }

    &__title {
        font-size: 14px;
        font-weight: 500;
        color: var(--on-surface-primary);
    }

    &__subtitle {
        font-size: 12px;
        color: var(--on-surface-secondary);
    }

    &__native {
        display: none;
    }
}
</style>