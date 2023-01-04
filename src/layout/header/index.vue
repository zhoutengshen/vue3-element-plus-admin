<template>
  <ElRow :align="'middle'" class="header">
    <ElCol :span="12">
      <ElRow :justify="'start'">
        <ElIcon :size="20" @click="appStore.toggleMenusCollapse">
          <IEpExpand v-if="appStore.collapseSideMenus" />
          <IEpFold v-else></IEpFold>
        </ElIcon>
      </ElRow>
    </ElCol>
    <ElCol :span="12">
      <ElRow :justify="'end'" :align="'middle'">
        <ElSpace :size="'default'">
          <ElSwitch
            class="el-switch"
            :active-icon="Sunny"
            :inactive-icon="MoonNight"
            v-model="appStore.usingThemeType"
            inline-prompt
            :active-value="ThemeType.dark"
            :inactive-value="ThemeType.light">
          </ElSwitch>
          <ElTooltip :content="'全屏'">
            <ElIcon :size="24" @click="handleFullScreen">
              <FullScreen class="icon"></FullScreen>
            </ElIcon>
          </ElTooltip>
          <ElDropdown @command="handleSelectItem">
            <ElAvatar :size="24" class="icon" v-bind="avatarConfig"> </ElAvatar>
            <template #dropdown>
              <ElDropdownMenu @command="handleSelectItem">
                <ElDropdownItem
                  v-for="(item, index) in dropdownList"
                  :key="index"
                  :command="item.commandType"
                  :icon="item.icon"
                  >{{ item.label }}</ElDropdownItem
                >
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </ElSpace>
      </ElRow>
    </ElCol>
  </ElRow>
</template>
<script lang="ts">
interface DropdownList {
  commandType: CommandType
  label: string
  icon?: Raw<Component>
}
enum CommandType {
  LOGOUT = 'LOGOUT',
  SETTING = 'SETTING',
}
</script>

<script lang="ts" setup>
import { ThemeType } from '@/constant'
import { useRoute } from 'vue-router'
import { useAppStore, useUserStore } from '@/stores'
import { Sunny, MoonNight, UserFilled, SwitchButton, Setting, FullScreen } from '@element-plus/icons-vue'
import { computed, ref, markRaw, type Component, type Raw } from 'vue'
import { useFullscreen } from '@vueuse/core'
import routerNavHelper from '@/router/helper/routerNavHelper'

defineOptions({
  name: 'LayoutHeader',
})
const appStore = useAppStore()
const userStore = useUserStore()
const route = useRoute()
const fullScreenHook = useFullscreen(document.querySelector('html'))
const avatarConfig = computed(() => ({
  src: userStore.avatarUrl,
  icon: UserFilled,
}))

const dropdownList = ref<DropdownList[]>([
  {
    commandType: CommandType.SETTING,
    label: '设置',
    icon: markRaw(Setting),
  },
  {
    commandType: CommandType.LOGOUT,
    label: '退出登录',
    icon: markRaw(SwitchButton),
  },
])

const handleFullScreen = () => {
  fullScreenHook.toggle()
}

const handleSelectItem = async (command: CommandType) => {
  const commandsMapFunc: Record<CommandType, (v?: any) => any> = {
    [CommandType.LOGOUT]: async () => {
      await userStore.logout()
      routerNavHelper.loginReplace({
        redirect: route.path,
      })
    },
    [CommandType.SETTING]: function () {
      appStore.isShowDrawer = true
    },
  }
  commandsMapFunc[command]?.()
}
</script>
<style lang="scss" scoped>
.header {
  height: 100%;

  .el-switch {
    --el-switch-on-color: var(--el-border-color);
    --el-switch-off-color: var(--el-color-info);
  }

  .icon {
    cursor: pointer;
  }
}
</style>
