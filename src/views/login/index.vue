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
<script lang="ts" setup>
import { ref, unref } from 'vue'
import { useUserStore } from '@/stores'
import { navToHomePage } from '@/router/utils'
defineOptions({
  name: 'LoginIndex',
})
const userStore = useUserStore()
const username = ref('')
const psw = ref('')
const handleLogin = () => {
  userStore.login(unref(username), unref(psw)).then((resp: boolean) => {
    if (resp) {
      navToHomePage()
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
