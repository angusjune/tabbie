<script lang="ts" setup>
import { computed, inject } from 'vue'

export interface SelectItemProps {
    value: string | number
    label?: string
    title?: string // backward compatibility
    selected?: string | number
    disabled?: boolean
    // New props for enhanced functionality
    variant?: 'default' | 'color' | 'image' | 'icon' | 'card'
    shape?: 'square' | 'circle' | 'rounded'
    // Legacy props
    circle?: boolean // maps to shape="circle"
    stretch?: boolean
    showItemLabel?: boolean
}

const props = withDefaults(defineProps<SelectItemProps>(), {
    variant: 'default',
    shape: 'rounded',
    showItemLabel: true
})

const emit = defineEmits<{
    'update:selected': [value: string | number]
    'select': [value: string | number]
}>()

// Check for parent context (when used inside KrSelectGroup)
const groupContext = inject('selectGroupContext', null) as any

const isSelected = computed(() => {
    const currentValue = groupContext?.modelValue?.value ?? props.selected
    return currentValue === props.value
})

const finalVariant = computed(() => {
    return groupContext?.variant?.value ?? props.variant
})

const finalShape = computed(() => {
    if (props.circle) return 'circle' // backward compatibility
    return groupContext?.shape?.value ?? props.shape
})

const displayLabel = computed(() => {
    return props.showItemLabel ? (props.label ?? props.title) : '' // backward compatibility
})

function handleClick() {
    if (props.disabled) return
    
    // Emit both events for backward compatibility
    emit('update:selected', props.value)
    emit('select', props.value)
    
    // Call parent handler if available
    groupContext?.onSelect?.(props.value)
}

const itemClasses = computed(() => ({
    'select-item': true,
    'select-item--selected': isSelected.value,
    'select-item--disabled': props.disabled,
    'select-item--stretch': props.stretch,
    [`select-item--${finalVariant.value}`]: true,
    [`select-item--${finalShape.value}`]: true
}))
</script>

<template>
    <label 
        class="select-item" 
        :class="itemClasses"
        :title="title"
        @click="handleClick"
    >
        <input 
            class="select-item__input" 
            type="radio" 
            :value="value" 
            :checked="isSelected"
            :disabled="disabled"
            @click.stop
        />
        
        <div class="select-item__content">
            <slot />
        </div>
        
        <div v-if="displayLabel" class="select-item__label">
            {{ displayLabel }}
        </div>
    </label>
</template>

<style scoped>
.select-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &__input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
    }

    &__content {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--separator);
        background: var(--surface);
        transition: background 0.15s ease-out;
        overflow: hidden;
    }

    &__label {
        font-size: 12px;
        color: var(--on-surface-secondary);
        padding-top: 6px;
        text-align: center;
        transition: color 0.15s ease;
    }

    /* Shapes */
    &--square &__content {
        border-radius: 4px;
    }

    &--rounded &__content {
        border-radius: 8px;
    }

    &--circle &__content {
        border-radius: 50%;
        aspect-ratio: 1;
    }

    /* Variants */
    &--color &__content {
        min-height: 26px;
        min-width: 26px;
    }

    &--image &__content {
        background: var(--surface-secondary);
    }

    &--icon &__content {
        padding: 8px;
    }

    &--card {
        &__content {
            flex-direction: column;
            padding: 16px;
            text-align: center;
            min-height: 80px;
            border-radius: 12px;
        }
    }

    /* States */
    &--selected {
        .select-item__content {
            border-color: var(--theme);
            box-shadow: 0 0 0 1px var(--theme);
            background: var(--theme-surface);
        }

        .select-item__label {
            font-weight: 500;
            color: var(--theme);
        }

        &:focus-within .select-item__content, &:hover .select-item__content {
            outline-offset: 2px;
        }
    }

    &--disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
    }

    &--stretch {
        width: 100%;
        
        .select-item__content {
            width: 100%;
        }
    }

    /* Focus styles */
    &:focus-within .select-item__content, &:hover .select-item__content {
        outline: 2px solid color-mix(in oklab, var(--theme) 20%, transparent);
    }
}
</style>