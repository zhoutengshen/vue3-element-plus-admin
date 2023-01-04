<template>
  <div class="redirect-page"></div>
</template>
<script lang="ts">
interface PageParams {
  readonly redirect: string
}
defineExpose<PageParams>()
</script>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()
const query = route.query as unknown as PageParams
onMounted(() => {
  if (query.redirect) {
    router.replace(query.redirect)
  }
})
</script>
