<template>
  <el-config-provider>
    <router-view></router-view>
  </el-config-provider>
</template>
<script lang="ts" setup>
import { useDevAllStore } from '@/composable/dev'
import { toRef } from 'vue'
import { useTheme } from './composable/theme'
import { useAppStore } from './stores'
const appStore = useAppStore()
useTheme(toRef(appStore, 'usingTheme'))
useDevAllStore()
</script>
