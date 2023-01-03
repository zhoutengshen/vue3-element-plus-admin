<template>
  <div class="layout-main">
    <LayoutMainTabs v-if="appStore.isShowTabs"></LayoutMainTabs>
    <RouterView v-slot="{ Component }">
      <KeepAlive>
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </div>
</template>
<script lang="ts" setup>
import LayoutMainTabs from './components/main-tabs.vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
</script>
<style lang="scss"></style>
