<script>
export default {
    props: {
        title: [String, Number],
        value: [String, Number],
        label: String,
        circle: Boolean,
        selected: [String, Number],
    },
    emits: ['update:selected'],
    computed: {
        inputModelValue: {
            get() {
                return this.selected
            },
            set(val) {
                this.$emit('update:selected', val)
            }
        }
    }
}
</script>

<template>
    <label class="select-item" :class="{'select-item--selected': selected === value, 'select-item--circle': circle}">
        <input class="select-item__input" type="radio" :value="value" v-model="inputModelValue" />
        <span class="select-item__content"><slot /></span>
        <span class="select-item__label" v-if="label">{{label}}</span>
    </label>
</template>

<style lang="postcss" scoped>
.select-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    &__content {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        border: 1px solid var(--separator);
        transition: box-shadow 0.1s ease-out, background 0.1s ease-out;
        will-change: box-shadow, background;
    }

    &__label {
        display: flex;
        font-size: 12px;
        color: var(--on-surface-secondary);
        padding-top: 4px;
        text-align: center;
    }

    &__input {
        display: none;
    }

    &--circle {
        .select-item__content {
            border-radius: 50%;
        }
    }

    &--selected {
        .select-item__content {
            box-shadow: 0 0 0 2px var(--theme);
            background: var(--ripple);
        }

        .select-item__label {
            font-weight: 500;
            color: var(--theme);
        }
    }
}
</style>