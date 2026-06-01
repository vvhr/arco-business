<script setup lang="ts">
import { computed, ref, unref, type PropType } from 'vue'
import { AbIcon } from '@/components/Icon'
import { t } from '@/locale'

type DividerPosition = 'left' | 'center' | 'right'
type DividerStyle = 'solid' | 'dashed' | 'dot'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  extra: {
    type: String,
    default: ''
  },
  toggleable: {
    type: Boolean,
    default: true
  },
  expand: {
    type: Boolean,
    default: false
  },
  toggleText: {
    type: String,
    default: t('disclosure.toggleText')
  },
  collapsedText: {
    type: String,
    default: t('disclosure.collapsedText')
  },
  divider: {
    type: Boolean,
    default: true
  },
  dividerPosition: {
    type: String as PropType<DividerPosition>,
    default: 'center'
  },
  dividerStyle: {
    type: String as PropType<DividerStyle>,
    default: 'solid'
  }
})

const isExpanded = ref(unref(props).expand)
const bodyRef = ref<HTMLElement>()

const showLineLeft = computed(
  () => props.divider && (props.dividerPosition === 'center' || props.dividerPosition === 'right')
)
const showLineRight = computed(
  () => props.divider && (props.dividerPosition === 'center' || props.dividerPosition === 'left')
)

const titleRowClass = computed(() => ({
  'is-divider': props.divider,
  [`divider-position-${props.dividerPosition}`]: props.divider,
  [`divider-style-${props.dividerStyle}`]: props.divider
}))

function handleExpandChange() {
  const body = bodyRef.value
  if (!body) return
  if (isExpanded.value) {
    body.style.height = `${body.scrollHeight}px`
    requestAnimationFrame(() => {
      body.style.height = '0px'
    })
  } else {
    body.style.height = '0px'
    requestAnimationFrame(() => {
      body.style.height = `${body.scrollHeight}px`
    })
  }
  isExpanded.value = !isExpanded.value
}

function onTransitionEnd() {
  if (isExpanded.value && bodyRef.value) {
    bodyRef.value.style.height = 'auto'
  }
}
</script>

<template>
  <div class="ab-form-disclosure">
    <div
      class="ab-form-disclosure-header"
      :class="{ toggleable, isExpanded, 'has-divider': divider, [`divider-position-${dividerPosition}`]: divider }"
    >
      <div class="ab-form-disclosure-header__title-row" :class="titleRowClass">
        <span v-if="showLineLeft" class="ab-form-disclosure-header__line" aria-hidden="true" />
        <div class="ab-form-disclosure-header__label">
          <span class="title">{{ label }}</span>
          <div class="toggle" @click="toggleable ? handleExpandChange() : undefined">
            <span class="toggle-text">{{ isExpanded ? toggleText : collapsedText }}</span>
            <AbIcon
              v-if="toggleable"
              :icon="isExpanded ? 'icon-park-outline:hide' : 'icon-park-outline:preview-open'"
              size="14"
              class="toggle-icon"
            />
          </div>
        </div>
        <span v-if="showLineRight" class="ab-form-disclosure-header__line" aria-hidden="true" />
      </div>
      <div v-if="extra" class="ab-form-disclosure-header__extra">
        <span>{{ extra }}</span>
      </div>
    </div>
    <div
      ref="bodyRef"
      class="ab-form-disclosure-body"
      :class="{ expanded: isExpanded }"
      @transitionend="onTransitionEnd"
    >
      <div class="ab-form-disclosure-body__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.ab-form-disclosure {
  width: 100%;
  margin-bottom: 10px;
  position: relative;

  .ab-form-disclosure-header {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 0;
    font-size: 14px;
    box-sizing: border-box;
  }

  .ab-form-disclosure-header__title-row {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 12px;

    &:not(.is-divider),
    &.is-divider.divider-position-left {
      justify-content: flex-start;
    }

    &.is-divider.divider-position-center {
      justify-content: center;
    }

    &.is-divider.divider-position-right {
      justify-content: flex-end;
    }

    &.divider-style-solid .ab-form-disclosure-header__line {
      border-top-style: solid;
    }

    &.divider-style-dashed .ab-form-disclosure-header__line {
      border-top-style: dashed;
    }

    &.divider-style-dot .ab-form-disclosure-header__line {
      border-top-style: dotted;
    }
  }

  .ab-form-disclosure-header__line {
    flex: 1;
    min-width: 0;
    height: 0;
    border-top-width: 1px;
    border-top-color: var(--color-border-2);
    border-top-style: solid;
  }

  .ab-form-disclosure-header__label {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    gap: 10px;

    > .title {
      font-size: 14px;
      font-weight: 500;
      user-select: none;
    }

    > .toggle {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      color: rgb(var(--primary-6));
      font-size: 13px;
    }
  }

  .ab-form-disclosure-header__extra {
    color: var(--color-text-3);
    font-size: 13px;
  }

  .ab-form-disclosure-body {
    position: relative;
    overflow: hidden;
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:not(.expanded) {
      height: 0;
    }
  }
}
</style>
