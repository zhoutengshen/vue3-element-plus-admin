<template>
  <div>
    <h1>dashboard</h1>
    <IEpEdit @click="handleCLick" />
  </div>
</template>
<script setup lang="ts">
import NProgress from 'nprogress'
const handleCLick = () => {
  console.log('>>>>>>>>>')
  NProgress.start()
  NProgress.set(70)
}
</script>
