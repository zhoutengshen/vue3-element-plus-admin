<template>
  <ElContainer class="layout-container" style="height: 100vh">
    <ElScrollbar>
      <LayoutSideBar></LayoutSideBar>
    </ElScrollbar>
    <ElContainer>
      <ElHeader>
        <LayoutHeader></LayoutHeader>
      </ElHeader>
      <ElMain>
        <LayoutMain></LayoutMain>
      </ElMain>
    </ElContainer>
    <LayoutDrawer></LayoutDrawer>
  </ElContainer>
</template>

<script lang="ts" setup>
import LayoutHeader from './header/index.vue'
import LayoutSideBar from './side-bar'
import LayoutMain from './main/index.vue'
import LayoutDrawer from './drawer/index.vue'
defineOptions({
  name: 'LayoutDefault',
})
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
