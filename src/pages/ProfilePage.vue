<script setup>
import { reactive, ref } from 'vue'
import { KeyRound, X } from '@lucide/vue'
import PageHeader from '../components/PageHeader.vue'
import { useAuthStore } from '../stores/auth.js'
import { useUiStore } from '../stores/ui.js'

const auth = useAuthStore()
const ui = useUiStore()
const passwordDialogOpen = ref(false)
const passwordSubmitting = ref(false)
const passwordError = ref('')
const passwordForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })

function resetPasswordForm() {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordError.value = ''
}

function openPasswordDialog() {
  resetPasswordForm()
  passwordDialogOpen.value = true
}

function closePasswordDialog() {
  if (passwordSubmitting.value) return
  passwordDialogOpen.value = false
  resetPasswordForm()
}

async function submitPasswordChange() {
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    passwordError.value = '请完整填写密码信息'
    return
  }
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = '两次输入的新密码不一致'
    return
  }

  passwordSubmitting.value = true
  const result = await auth.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })
  passwordSubmitting.value = false
  const messages = {
    PASSWORD_TOO_SHORT: '新密码至少需要 8 位字符',
    PASSWORD_UNCHANGED: '新密码不能与当前密码相同',
    CURRENT_PASSWORD_INVALID: '当前密码不正确',
  }
  if (!result.ok) {
    passwordError.value = messages[result.code] || '密码修改未完成，请稍后重试'
    return
  }

  closePasswordDialog()
  ui.notify('密码已修改，下次登录请使用新密码', 'success')
}
</script>

<template>
  <section class="page-container">
    <PageHeader title="个人中心" />
    <div class="profile-shell">
      <main class="profile-panel">
        <header><div class="avatar-large"><span>{{ auth.profile.avatar }}</span></div><div><h2>{{ auth.profile.name }}</h2><p>个人信息由管理员统一创建与维护</p></div></header>
        <dl class="account-details">
          <div><dt>用户名</dt><dd>{{ auth.profile.name }}</dd></div>
          <div><dt>登录账号</dt><dd>{{ auth.profile.account }}</dd></div>
          <div><dt>工号</dt><dd>{{ auth.profile.employeeId }}</dd></div>
          <div><dt>邮箱</dt><dd>{{ auth.profile.email }}</dd></div>
          <div><dt>手机号</dt><dd>138****2816</dd></div>
          <div><dt>部门</dt><dd>{{ auth.profile.company }} · {{ auth.profile.department }}</dd></div>
          <div><dt>职务</dt><dd>高级工程师</dd></div>
          <div><dt>平台角色</dt><dd>{{ auth.profile.label }}</dd></div>
        </dl>
        <section class="profile-security" aria-labelledby="profile-security-title">
          <header><div><h3 id="profile-security-title">账号安全</h3></div><button class="button secondary" type="button" @click="openPasswordDialog"><KeyRound :size="17" />修改密码</button></header>
        </section>
      </main>
    </div>
    <Transition name="profile-password-fade">
      <section v-if="passwordDialogOpen" class="profile-password-layer" role="dialog" aria-modal="true" aria-labelledby="profile-password-title" @click.self="closePasswordDialog">
        <form class="profile-password-dialog" @submit.prevent="submitPasswordChange">
          <header><div><span>账号安全</span><h2 id="profile-password-title">修改登录密码</h2></div><button type="button" aria-label="关闭修改密码窗口" @click="closePasswordDialog"><X :size="18" /></button></header>
          <div class="profile-password-dialog-body">
            <p>请输入当前密码，并设置新的登录密码。</p>
            <label>当前密码<input v-model="passwordForm.currentPassword" type="password" autocomplete="current-password" autofocus /></label>
            <label>新密码<input v-model="passwordForm.newPassword" type="password" autocomplete="new-password" /></label>
            <label>确认新密码<input v-model="passwordForm.confirmPassword" type="password" autocomplete="new-password" /></label>
            <small>新密码至少包含 8 位字符。</small>
            <p v-if="passwordError" class="form-error">{{ passwordError }}</p>
          </div>
          <footer><button class="button secondary" type="button" :disabled="passwordSubmitting" @click="closePasswordDialog">取消</button><button class="button primary" type="submit" :disabled="passwordSubmitting">{{ passwordSubmitting ? '修改中…' : '确认修改' }}</button></footer>
        </form>
      </section>
    </Transition>
  </section>
</template>
