<template>
  <div>
    <h1>该页面不存在</h1>
    <h2 @click="handleBackHome">返回首页</h2>
  </div>
</template>
<script lang="ts" setup>
import routerNavHelper from '@/router/helper/routerNavHelper'
const handleBackHome = () => {
  routerNavHelper.dashboardReplace()
}
</script>
