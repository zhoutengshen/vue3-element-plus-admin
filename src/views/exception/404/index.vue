<template>
  <div>
    <h1>该页面不存在</h1>
    <h2 @click="handleBackHome">返回首页</h2>
  </div>
</template>
<script lang="ts" setup>
import { navToHomePage } from '@/router/utils'
const handleBackHome = () => {
  navToHomePage()
}
</script>
