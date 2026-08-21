<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogIn, Building2 } from '@lucide/vue'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const account = ref('Admin')
const password = ref('demo123')
const remember = ref(true)
const error = ref('')

function submit() {
  if (!password.value) { error.value = '请输入密码'; return }
  auth.login(account.value)
  router.replace(typeof route.query.redirect === 'string' ? route.query.redirect : '/agents')
}

function singleSignOn() {
  auth.login('Admin')
  router.replace(route.query.redirect || '/agents')
}
</script>

<template>
  <main class="login-page">
    <section class="login-brand">
      <div class="login-logo"><img src="/chinacoal-logo.png" alt="中煤 Logo" /><span><b>中煤深圳院</b><small>AI 创新应用平台</small></span></div>
      <div class="login-statement"><span>科研智能工作平台</span><h1>让技术研究更清晰，<br />让创新依据可追溯。</h1><p>汇聚六项科研智能应用、任务过程与成果材料，为技术创新提供统一的工作入口。</p></div>
      <footer><i /> 专利 · 论文 · 政策 · 授权知识库</footer>
    </section>
    <section class="login-form-area">
      <form class="login-card" @submit.prevent="submit">
        <header><span>欢迎使用</span><h2>登录平台</h2><p>请选择账号进入对应工作空间。</p></header>
        <label>账号<select v-model="account"><option value="Admin">Admin · 平台管理员</option><option value="User">User · 科研人员</option><option value="Judge">Judge · 复核专家</option></select></label>
        <label>密码<input v-model="password" type="password" autocomplete="current-password" /></label>
        <div class="login-options"><label><input v-model="remember" type="checkbox" />记住密码</label><span>账号由管理员统一分配</span></div>
        <p v-if="error" class="form-error">{{ error }}</p>
        <button class="button primary wide" type="submit"><LogIn :size="18" />登录</button>
        <div class="login-divider"><span>或</span></div>
        <button class="button secondary wide" type="button" @click="singleSignOn"><Building2 :size="18" />企业单点登录</button>
        <small>账号由平台管理员统一分配，也可使用企业单点登录。</small>
      </form>
    </section>
  </main>
</template>
