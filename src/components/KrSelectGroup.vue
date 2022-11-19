<script>
export default {
    props: {
        title: String,
        subtitle: String,
        items: Array,
        hideSeparator: Boolean,
        modelValue: [String, Number],
        distribution: {
            type: String,
            default: 'flex-start',
            validator: (value) => ['flex-start', 'flex-end', 'space-between', 'space-around'].includes(value),
        },
    },
    emits: ['update:modelValue'],
    methods: {
        setSelected(val) {
            this.$emit('update:modelValue', val)
        }
    }
}
</script>

<template>
    <div class="select-group" :class="{'select-group--with-separator': !hideSeparator}">

        <div class="select-group__header" v-if="title || subtitle">
            <div class="select-group__header__title" v-if="title">{{title}}</div>
            <div class="select-group__header__subtitle" v-if="subtitle">{{subtitle}}</div>
        </div>

        <div class="select-group__items" :style="{justifyContent: distribution}">
            <div v-for="item in items" :key="item.value" @click="setSelected(item.value)">
                <slot name="items" :item="item" :selected="modelValue"></slot>
            </div>
        </div>
        
    </div>
</template>

<style lang="postcss" scoped>
.select-group {

    &--with-separator {
        border-bottom: 1px solid var(--separator);
    }

    &__header {
        box-sizing: border-box;
        padding: 12px 20px 6px;
        display: flex;
        align-items: center;

        &__title {
            font-size: 14px;
            color: var(--on-surface-primary);
        }

        &__subtitle {
            font-size: 12px;
            color: var(--on-surface-secondary);
        }
    }

    &__items {
        padding: 6px 20px 12px;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        gap: 8px;
    }
}
</style>