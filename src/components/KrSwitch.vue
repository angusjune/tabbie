<script>
export default {
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        inset: {
            type: Boolean,
            default: false,
        }
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
    <label class="switch" :class="{'switch--inset': inset}" :aria-checked="inputModelValue" :aria-disabled="disabled">
        <input
            class="switch__input"
            type="checkbox"
            v-model="inputModelValue"
            :disabled="disabled"
        />
        <div class="switch__track"></div>
        <div class="switch__thumb">
            <div class="switch__thumb__ripple"></div>
        </div>

    </label>
</template>

<style lang="postcss" scoped>
.switch {
    --track-height: 12px;
    --track-width: 28px;
    --track-background-unchecked: var(--grey-400);
    --track-background-checked: var(--theme);

    --thumb-size: 16px;
    --thumb-box-shadow: 0 1px 3px 0 rgba(0,0,0,.4);
    --thumb-background-unchecked: var(--surface);
    --thumb-background-checked: var(--theme);

    --hs: 212, 9%;
    --l: 88%;

    @media (prefers-color-scheme: dark) {
        --hs: 0, 0%;
        --l: 32%;
        --thumb-background-unchecked: var(--grey-100);
        --track-background-unchecked: var(--grey-500);
    }

    display: inline-flex;
    position: relative;

    &--inset {
        --track-height: 22px;
        --track-width: 44px;
        --thumb-size: 18px;
    }

    &[aria-checked=true] {
        .switch__track {
            background: var(--track-background-checked);
        }
        .switch__thumb {
            background: var(--thumb-background-checked);
            transform: translateX(calc((var(--track-width) - var(--track-height))));
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
        background: var(--track-background-unchecked);
        border-radius: 999px;
        transition: background 0.2s ease-out;
        opacity: 0.5;
    }

    &__thumb {
        position: absolute;
        top: calc(var(--track-height) / 2 - var(--thumb-size) / 2);
        left: calc(var(--track-height) / 2 - var(--thumb-size) / 2);
        background: var(--thumb-background-unchecked);
        width: var(--thumb-size);
        height: var(--thumb-size);
        border-radius: 50%;
        box-shadow: var(--thumb-box-shadow);
        transition: transform 0.12s ease-out, background 0.12s ease-out;
        
        &__ripple {
            position: absolute;
            top: calc(var(--thumb-size) * -1 / 2);
            left: calc(var(--thumb-size) * -1 / 2);
            width: calc(var(--thumb-size) * 2);
            height: calc(var(--thumb-size) * 2);
            border-radius: 50%;
            background: var(--ripple);
            opacity: 0;
            transform: scale(0);
            transition: opacity 0.08s ease-out, transform 0.08s ease-out;
        }
    }
}
</style>