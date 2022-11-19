<script>
import KrSwitch from '@/components/KrSwitch.vue'

export default {
    components: { KrSwitch },
    props: {
        modelValue: Boolean,
        title: String,
        subtitle: String,
        disabled: Boolean,
        hideSeparator: Boolean,
    },
    emits: ['update:modelValue'],
    computed: {
        inputModelValue: {
            get() {
                return this.modelValue
            },
            set(val) {
                this.$emit('update:modelValue', val)
            }
        }
    }
}
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

<style lang="postcss" scoped>
.toggle-row {
    box-sizing: border-box;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    touch-action: none;

    &--with-separator {
        border-bottom: 1px solid var(--separator);
    }

    &__label {
        flex: 1;
        cursor: pointer;
    }

    &__title {
        font-size: 14px;
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