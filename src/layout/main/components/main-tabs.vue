<template>
  <ElTabs class="main-tabs" :active-name="activeName" closable @tab-change="handleTabChange" @edit="handleRemovePath">
    <ElTabPane
      v-for="item in appStore.openedPages"
      :modelValue="activeName"
      :key="item.path"
      :name="item.path"
      :label="item.label"></ElTabPane>
  </ElTabs>
</template>
<script setup lang="ts">
import { useAppStore } from '@/stores'
import type { TabPaneName } from 'element-plus'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
defineOptions({ name: 'LayoutMainTabs' })
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const activeName = computed(() => route?.path || '/dashboard')
const handleRemovePath = (pathName?: TabPaneName, action?: 'remove' | 'add') => {
  if (action === 'remove' && pathName) {
    const removeIndex = appStore.removeOpenedPage(pathName.toString())
    const toItem = appStore.openedPages[removeIndex - 1] || appStore.openedPages[removeIndex]
    if (toItem) {
      router.push(toItem.path)
    } else {
      // 如果全部关闭了，默认打开 dashboard
      const defaultOpenPage = appStore.pathOpenPageMap['/dashboard']
      if (!defaultOpenPage) {
        return
      }
      appStore.addOpenedPage(defaultOpenPage)
      router.push(defaultOpenPage.path)
    }
  }
}
const handleTabChange = (name: TabPaneName) => {
  const value = appStore.openedPages.find((item) => item?.path === name?.toString())
  if (value) {
    router.push(value.path)
  }
}
</script>
<style lang="scss">
.main-tabs .el-tabs__content {
  padding: 0;
}
</style>
