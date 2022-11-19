<script setup lang="ts">
const props = defineProps<{
    title?: string,
}>()
</script>

<template>
    <div class="empty">
        <div class="empty__icon">
            <svg viewBox="0 0 102 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M65.5272 4.62856C61.568 4.69755 58.0921 8.90085 56.8437 13.6201C54.7368 21.5842 68.1202 19.5056 70.56 29.647C73.6098 42.3237 94.3616 35.9507 97.7487 27.4051C101.136 18.8595 91.834 12.6567 81.9606 14.2432C72.0873 15.8297 70.4762 4.54232 65.5272 4.62856Z" stroke="var(--on-surface-tertiary)" stroke-width="2" stroke-dasharray="4 4"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24 22H49V29H83V68C83 70.2091 81.2091 72 79 72H24C21.7909 72 20 70.2091 20 68V26C20 23.7909 21.7909 22 24 22ZM25 38C23.8954 38 23 38.8954 23 40V67C23 68.1046 23.8954 69 25 69H78C79.1046 69 80 68.1046 80 67V40C80 38.8954 79.1046 38 78 38H25Z" fill="var(--theme)" />
                <path d="M0 47L3.33333 33L16 42.3333L0 47Z" fill="var(--on-surface-tertiary)"/>
                <circle cx="96" cy="57" r="4" fill="var(--on-surface-tertiary)"/>
            </svg>
        </div>
        <h1 class="empty__title">{{title}}</h1>

        <div class="empty__content">
            <slot />
        </div>
    </div>
</template>

<style lang="postcss" scoped>
.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 32px 42px;
    text-align: center;

    &__icon {
        margin-bottom: 16px;
        width: 100px;
    }

    &__title {
        font-size: 16px;
        font-weight: 600;
        color: var(--on-surface-primary);
        margin: 0;
    }

    &__content {
        font-size: 12px;
        color: var(--on-surface-secondary);
        margin-top: 8px;
    }
}
</style>