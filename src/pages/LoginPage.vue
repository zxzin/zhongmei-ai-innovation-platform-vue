<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogIn } from '@lucide/vue'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const account = ref('Admin')
const password = ref('demo123')
const remember = ref(true)
const error = ref('')
const submitting = ref(false)

async function submit() {
  if (!password.value) { error.value = '请输入密码'; return }
  error.value = ''
  submitting.value = true
  const authenticated = await auth.login(account.value, password.value)
  submitting.value = false
  if (!authenticated) { error.value = '账号或密码错误'; return }
  router.replace(typeof route.query.redirect === 'string' ? route.query.redirect : '/agents')
}

</script>

<template>
  <main class="login-page">
    <div class="login-stage">
      <section class="login-brand">
        <header class="login-brand-header"><img src="/chinacoal-logo.png" alt="中国中煤能源集团有限公司" /></header>
        <div class="login-brand-message">
          <h1><span>让科研工作</span><span>更清晰、更高效</span></h1>
          <p>汇聚科研智能应用、任务过程与交付成果，为技术创新<br />提供统一的智能工作平台。</p>
        </div>
      </section>
      <section class="login-form-area">
        <form class="login-card" @submit.prevent="submit">
          <header><h2>登录</h2></header>
          <label class="login-field"><span class="login-field-label">账号</span><input v-model.trim="account" type="text" autocomplete="username" placeholder="请输入登录账号" /></label>
          <label class="login-field"><span class="login-field-label">密码</span><input v-model="password" type="password" autocomplete="current-password" /></label>
          <div class="login-options"><label><input v-model="remember" type="checkbox" />记住密码</label></div>
          <p v-if="error" class="form-error">{{ error }}</p>
          <button class="button primary wide" type="submit" :disabled="submitting"><span>{{ submitting ? '验证中…' : '登录' }}</span><i><LogIn :size="17" /></i></button>
        </form>
      </section>
    </div>
  </main>
</template>
