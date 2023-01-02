<template>
  <ElContainer class="layout-container" style="height: 100vh">
    <ElScrollbar>
      <LayoutSideBar :menus="appStore.clientMenus" :collapse="appStore.collapse"></LayoutSideBar>
    </ElScrollbar>
    <ElContainer>
      <ElHeader>
        <LayoutHeader></LayoutHeader>
      </ElHeader>
      <ElMain>
        <RouterView></RouterView>
      </ElMain>
    </ElContainer>
  </ElContainer>
</template>

<script lang="ts" setup>
import LayoutHeader from './header/index.vue'
import LayoutSideBar from './side-bar'
import { useAppStore } from '@/stores'
defineOptions({
  name: 'LayoutDefault',
})
const appStore = useAppStore()
</script>

<style scoped lang="scss">
.layout-container {
  box-sizing: border-box;

  .el-main {
  }

  .el-aside {
    border-right: 1px solid var(--el-border-color);
    box-shadow: var(--el-box-shadow-lighter);
  }

  .el-header {
    border-bottom: 1px solid var(--el-border-color);
    box-shadow: var(--el-box-shadow-lighter);
  }
}
</style>
