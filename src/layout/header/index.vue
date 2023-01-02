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
      <ElRow :justify="'end'" :align="'middle'">
        <ElSpace :size="'default'">
          <ElSwitch
            class="el-switch"
            :active-icon="Sunny"
            :inactive-icon="MoonNight"
            v-model="appStore.usingTheme"
            inline-prompt
            :active-value="ThemeType.dark"
            :inactive-value="ThemeType.light">
          </ElSwitch>
          <ElDropdown @command="handleSelectItem">
            <ElAvatar :size="32" class="avatar" v-bind="avatarConfig"> </ElAvatar>
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
}
</script>
<script lang="ts" setup>
import { ThemeType } from '@/constant'
import { navToLogin } from '@/router/utils'
import { useAppStore, useUserStore } from '@/stores'
import { Sunny, MoonNight, UserFilled, SwitchButton } from '@element-plus/icons-vue'
import { computed, ref, markRaw, type Component, type Raw } from 'vue'

defineOptions({
  name: 'LayoutHeader',
})
const appStore = useAppStore()
const userStore = useUserStore()
const avatarConfig = computed(() => {
  if (userStore.avatarUrl) {
    return {
      src: userStore.avatarUrl,
    }
  }
  return {
    icon: UserFilled,
  }
})
const dropdownList = ref<DropdownList[]>([
  {
    commandType: CommandType.LOGOUT,
    label: '退出登录',
    icon: markRaw(SwitchButton),
  },
])
const handleSelectItem = async (command: CommandType) => {
  if (command === CommandType.LOGOUT) {
    await userStore.logout()
    navToLogin()
  }
}
</script>
<style lang="scss" scoped>
.header {
  height: 100%;

  .el-switch {
    --el-switch-on-color: var(--el-border-color);
    --el-switch-off-color: var(--el-color-info);
  }

  .avatar {
    cursor: pointer;
  }
}
</style>
