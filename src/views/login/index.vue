<template>
  <div class="login-page">
    <h1>LOGIN PAGE</h1>
    <div>
      <input v-model="psw" type="input" placeholder="请输入用户名称" />
    </div>
    <div>
      <input v-model="username" type="password" placeholder="请输入密码" />
    </div>
    <button @click="handleLogin">登录</button>
  </div>
</template>

<script lang="ts">
type PageParams = {
  redirect: string
}
</script>
<script lang="ts" setup>
import { ref, unref } from 'vue'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

defineOptions({ name: 'LoginIndex' })
const userStore = useUserStore()
const username = ref('admin')
const psw = ref('admin')
const route = useRoute()
const router = useRouter()
const handleLogin = () => {
  userStore.login(unref(username), unref(psw)).then((resp: boolean) => {
    if (resp) {
      const query = route.query as PageParams
      router.replace(query.redirect || '/')
    }
  })
}
</script>
<style scoped lang="scss">
.login-page {
  display: flex;
  min-height: 70vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
