<script lang="ts" setup>
import { provide, computed } from 'vue'
import KrSelectItem from './KrSelectItem.vue'

export type SelectItemData = {
    label: string
    value: string | number
    disabled?: boolean
    hex?: string      // For color swatches
    img?: string      // For image components
    icon?: string     // For icon paths
    description?: string
}

export type SelectVariant = 'default' | 'color' | 'image' | 'icon' | 'card'

const props = withDefaults(defineProps<{
    title?: string
    subtitle?: string
    items: SelectItemData[]
    showItemLabel?: boolean
    showTooltip?: boolean
    modelValue: any
    hideSeparator?: boolean
    columns?: number | 'auto' // number of columns or 'auto' for flex
    gap?: string
    variant?: SelectVariant
    shape?: 'square' | 'circle' | 'rounded'
}>(), {
    variant: 'default',
    shape: 'rounded',
    columns: 'auto',
    gap: '12px',
    showItemLabel: true,
    showTooltip: true,
})

const emit = defineEmits<{
    'update:modelValue': [value: any]
}>()

const layoutStyle = computed(() => {
    if (props.columns === 'auto') {
        return {
            display: 'flex',
            flexWrap: 'wrap' as const,
            gap: props.gap
        }
    }
    return {
        display: 'grid',
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gap: props.gap
    }
})

function handleSelect(value: any) {
    emit('update:modelValue', value)
}

// Provide context for child components
provide('selectGroupContext', {
    modelValue: computed(() => props.modelValue),
    variant: computed(() => props.variant),
    shape: computed(() => props.shape),
    showItemLabel: computed(() => props.showItemLabel),
    onSelect: handleSelect
})
</script>

<template>
    <div 
        class="select-group" 
        :class="{ 'select-group--with-separator': !hideSeparator }"
    >
        <!-- Header -->
        <div v-if="title || subtitle" class="select-group__header">
            <div v-if="title" class="select-group__header__title">{{ title }}</div>
            <div v-if="subtitle" class="select-group__header__subtitle">{{ subtitle }}</div>
        </div>

        <!-- Items Container -->
        <div class="select-group__items" :style="layoutStyle">
            <!-- Use slot if provided (backward compatibility) -->
            <template v-if="$slots.items">
                <template v-for="item in items" :key="item.value">
                    <slot 
                        name="items" 
                        :item="item" 
                        :selected="modelValue === item.value"
                        :setSelected="handleSelect"
                    />
                </template>
            </template>
            
            <!-- Use built-in renderer -->
            <template v-else>
                <KrSelectItem
                    v-for="item in items"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                    :selected="modelValue"
                    :disabled="item.disabled"
                    :variant="variant"
                    :shape="shape"
                    :showItemLabel="showItemLabel"
                    :title="showTooltip ? item.label : undefined"
                    @select="handleSelect"
                >
                    <!-- Built-in content based on variant -->
                    <template v-if="variant === 'color'">
                        <div 
                            class="color-swatch" 
                            :style="{ background: item.hex }"
                        />
                    </template>
                    
                    <template v-else-if="variant === 'image' && item.img">
                        <component :is="item.img" />
                    </template>
                    
                    <template v-else-if="variant === 'icon' && item.icon">
                        <svg class="icon" viewBox="0 0 32 32">
                            <path :d="item.icon" />
                        </svg>
                    </template>
                    
                    <template v-else>
                        {{ item.label }}
                    </template>
                </KrSelectItem>
            </template>
        </div>
    </div>
</template>

<style scoped>
.select-group {
    &--with-separator {
        border-bottom: 1px solid var(--separator);
    }

    &__header {
        box-sizing: border-box;
        padding: 16px 16px 6px;
        display: flex;
        align-items: center;

        &__title {
            font-size: 14px;
            font-weight: 500;
            color: var(--on-surface-primary);
        }

        &__subtitle {
            font-size: 12px;
            color: var(--on-surface-secondary);
            margin-left: 8px;
        }
    }

    &__items {
        padding: 6px 16px 16px;
        align-items: center;
    }
}

.color-swatch {
    width: 24px;
    height: 24px;
    border-radius: inherit;
}

.icon {
    width: 32px;
    height: 32px;
    fill: currentColor;
}
</style>