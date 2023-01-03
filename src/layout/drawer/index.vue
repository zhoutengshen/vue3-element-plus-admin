<template>
  <ElDrawer v-model="isShowDrawer" :direction="'rtl'" class="layout-drawer">
    <ElForm>
      <ElFormItem label="是否关闭Tabs">
        <ElSwitch :active-value="true" :inactive-value="false" v-model:model-value="appStore.isShowTabs"></ElSwitch>
      </ElFormItem>
    </ElForm>
  </ElDrawer>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/stores'
import { toRef } from 'vue'
defineOptions({ name: 'LayoutDrawer' })
const appStore = useAppStore()
const isShowDrawer = toRef(appStore, 'isShowDrawer')
</script>
<style lang="scss">
.layout-drawer {
  .tabs-config {
    //
  }
}
</style>
