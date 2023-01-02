<template>
  <ElRow :align="'middle'" class="header">
    <ElCol :span="12">
      <ElRow :justify="'start'">
        <ElIcon :size="20" @click="appStore.toggleMenusCollapse">
          <IEpExpand v-if="appStore.collapse" />
          <IEpFold v-else></IEpFold>
        </ElIcon>
      </ElRow>
    </ElCol>
    <ElCol :span="12">
      <ElRow :justify="'end'">
        <ElSwitch
          class="el-switch"
          :active-icon="Sunny"
          :inactive-icon="MoonNight"
          v-model="appStore.usingTheme"
          inline-prompt
          :active-value="ThemeType.dark"
          :inactive-value="ThemeType.light">
        </ElSwitch>
      </ElRow>
    </ElCol>
  </ElRow>
</template>
<script lang="ts" setup>
import { ThemeType } from '@/constant'
import { useAppStore } from '@/stores'
import { MoonNight } from '@element-plus/icons-vue'
import { Sunny } from '@element-plus/icons-vue'
defineOptions({
  name: 'LayoutHeader',
})
const appStore = useAppStore()
</script>
<style lang="scss" scoped>
.header {
  height: 100%;

  .el-switch {
    --el-switch-on-color: var(--el-border-color);
    --el-switch-off-color: var(--el-color-info);
  }
}
</style>
