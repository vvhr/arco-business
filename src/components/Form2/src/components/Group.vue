<script setup lang="ts">
import { ref, unref, type CSSProperties, type PropType } from 'vue'
import { AbIcon } from '@/components/Icon'

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
    default: true
  },
  border: {
    type: Boolean,
    default: true
  },
  bg: {
    type: Boolean,
    default: true
  },
  decor: {
    type: Boolean,
    default: false
  },
  headerStyle: {
    type: [Object as PropType<CSSProperties>, String] as PropType<CSSProperties | string>,
    default: () => ''
  },
  bodyStyle: {
    type: [Object as PropType<CSSProperties>, String] as PropType<CSSProperties | string>,
    default: () => ''
  }
})

const isExpanded = ref(unref(props).expand)
const bodyRef = ref<HTMLElement>()

function handleExpandChange() {
  const body = bodyRef.value
  if (!body) return
  if (isExpanded.value) {
    const currentHeight = body.scrollHeight
    body.style.height = `${currentHeight}px`
    requestAnimationFrame(() => {
      body.style.height = '0px'
      body.style.padding = '0px'
    })
  } else {
    body.style.height = '0px'
    body.style.padding = '0px'
    requestAnimationFrame(() => {
      body.style.height = `${body.scrollHeight}px`
      body.style.padding = '10px'
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
  <div class="ab-form-group" :class="{ border, bg }">
    <div
      class="ab-form-group-header"
      :class="{ toggleable, isExpanded }"
      :style="headerStyle"
      @click="toggleable ? handleExpandChange() : undefined"
    >
      <div class="ab-form-group-header__label">
        <div class="ab-form-group-header__title-line">
          <div v-if="decor" class="decor"></div>
          <span class="title">{{ label }}</span>
        </div>
        <span v-if="extra" class="extra">{{ extra }}</span>
      </div>
      <AbIcon
        v-if="toggleable"
        :icon="isExpanded ? 'icon-park-outline:up' : 'icon-park-outline:down'"
        class="ab-form-group-header__icon"
      />
    </div>
    <div
      ref="bodyRef"
      class="ab-form-group-body"
      :class="{ expanded: isExpanded }"
      :style="bodyStyle"
      @transitionend="onTransitionEnd"
    >
      <div class="ab-form-group-body__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.ab-form-group {
  width: 100%;
  margin-bottom: 10px;
  position: relative;

  &.border {
    border: 1px solid var(--color-border-2);
    border-radius: 4px;

    .ab-form-group-header.isExpanded {
      border-bottom: 1px solid var(--color-border-2);
    }
  }

  &.bg {
    .ab-form-group-header {
      background: var(--color-fill-1);
    }

    .ab-form-group-body {
      background: var(--color-bg-1);
    }
  }

  .ab-form-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 10px 15px 10px 10px;
    font-size: 14px;
    box-sizing: border-box;

    &.toggleable {
      cursor: pointer;
    }
  }

  .ab-form-group-header__label {
    display: flex;
    flex-direction: column;
  }

  .ab-form-group-header__title-line {
    position: relative;
    display: inline-flex;
    align-items: center;

    > .title {
      font-size: 14px;
      font-weight: 500;
    }

    > .decor {
      position: absolute;
      left: -10px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 1.1em;
      background: rgb(var(--primary-6));
      border-radius: 4px;
    }
  }

  .extra {
    font-size: 13px;
    color: var(--color-text-3);
  }

  .ab-form-group-body {
    position: relative;
    overflow: hidden;
    transition:
      height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      padding 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.expanded {
      padding: 10px;
    }

    &:not(.expanded) {
      height: 0;
      padding: 0;
    }
  }
}
</style>
