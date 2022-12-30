<template>
  <div>
    <h1>服务器异常</h1>
    <h2 @click="navToHomePage">返回首页</h2>
  </div>
</template>
<script lang="ts" setup>
import { navToHomePage } from '@/router/utils'
</script>
