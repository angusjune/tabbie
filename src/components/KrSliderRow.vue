<script>
export default {
    props: {
        title: String,
        subtitle: String,
        modelValue: [String, Number],
        hideSeparator: {
            type: Boolean,
            default: false,
        },
        min: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 100,
        },
        step: {
            type: Number,
            default: 1,
        },
    },
    emits: ['update:modelValue'],
    computed: {
        modelValue_: {
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
    <div class="slider" :class="{'slider--with-separator': !hideSeparator}">
        <div class="slider__header" v-if="title || subtitle">
            <div class="slider__header__title" v-if="title">{{title}}</div>
            <div class="slider__header__subtitle" v-if="subtitle">{{subtitle}}</div>
            <div class="slider__header__value">{{modelValue_}}</div>
        </div>
        <div class="slider__control">
            <input
                class="slider__input"
                type="range" 
                v-model.number="modelValue_" 
                :min="min" 
                :max="max" 
                :step="step"
                :style="{backgroundSize: (modelValue - min) * 100 / (max - min) + '% 100%'}"
            />
        </div>
    </div>
</template>

<style lang="postcss" scoped>
.slider {
    &--with-separator {
        border-bottom: 1px solid var(--separator);
    }

    &__header {
        box-sizing: border-box;
        padding: 12px 20px 6px;
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: auto auto;
        grid-template-areas: 'title value' 'subtitle subtitle';

        &__title {
            font-size: 14px;
            color: var(--on-surface-primary);
            grid-area: title;
        }

        &__subtitle {
            font-size: 12px;
            color: var(--on-surface-secondary);
            grid-area: subtitle;
        }

        &__value {
            font-size: 14px;
            color: var(--on-surface-primary);
            grid-area: value;
        }
    }

    &__control {
        padding: 4px var(--padding-horizontal) 16px;
    }

    &__input {
        --kr-slider-thumb-size: 24px;
        --kr-slider-track-height: 6px;

        -webkit-appearance: none;
        width: 100%;
        margin: calc(var(--kr-slider-thumb-size) / 2) 0;
        background: var(--on-surface-tertiary);
        background-image: linear-gradient(var(--theme), var(--theme));
        background-repeat: no-repeat;
        background-size: 50% 100%;
        border-radius: 4px;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: var(--kr-slider-thumb-size);
            width: var(--kr-slider-thumb-size);
            border-radius: 50%;
            background: #fff;
            cursor: default;
            margin-top: calc((var(--kr-slider-thumb-size) - var(--kr-slider-track-height)) / -2);
            box-shadow: 0 1px 3px 0 rgba(0,0,0,.4);
        }

        &::-webkit-slider-runnable-track {
            width: 100%;
            height: var(--kr-slider-track-height);
        }
    }
}
</style>