<template>
  <div>
    <h1>没有权限访问</h1>
    <h2 @click="navToHomePage">返回首页</h2>
  </div>
</template>
<script lang="ts" setup>
import { navToHomePage } from '@/router/utils'
</script>
