<template>
  <router-view></router-view>
</template>
<script lang="ts" setup>
import { useDevAllStore } from '@/hooks/dev-hooks'
useDevAllStore()
</script>
