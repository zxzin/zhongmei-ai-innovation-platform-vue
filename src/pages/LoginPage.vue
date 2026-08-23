<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogIn } from '@lucide/vue'
import BaseSelect from '../components/BaseSelect.vue'
import { useAuthStore } from '../stores/auth.js'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const account = ref('Admin')
const password = ref('demo123')
const remember = ref(true)
const error = ref('')
const accountOptions = [
  { value: 'Admin', label: 'Admin' },
  { value: 'User', label: 'User' },
]

function submit() {
  if (!password.value) { error.value = '请输入密码'; return }
  auth.login(account.value)
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
          <div class="login-field">
            <span class="login-field-label">账号</span>
            <BaseSelect v-model="account" :options="accountOptions" aria-label="选择账号" size="lg" />
          </div>
          <label class="login-field"><span class="login-field-label">密码</span><input v-model="password" type="password" autocomplete="current-password" /></label>
          <div class="login-options"><label><input v-model="remember" type="checkbox" />记住密码</label></div>
          <p v-if="error" class="form-error">{{ error }}</p>
          <button class="button primary wide" type="submit"><span>登录</span><i><LogIn :size="17" /></i></button>
        </form>
      </section>
    </div>
  </main>
</template>
