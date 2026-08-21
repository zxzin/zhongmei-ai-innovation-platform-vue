<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { UserRound, KeyRound, Camera } from '@lucide/vue'
import PageHeader from '../components/PageHeader.vue'
import { useAuthStore } from '../stores/auth.js'
import { useUiStore } from '../stores/ui.js'

const auth = useAuthStore()
const ui = useUiStore()
const tab = ref('profile')
const avatarInput = ref(null)
const avatarPreview = ref('')
const form = reactive({ name: auth.profile.name, phone: '138****2816', email: 'xu.bo@chinacoal.com', title: '高级工程师' })
function save() { auth.updateProfile({ name: form.name }); ui.notify('个人资料已保存', 'success') }
function chooseAvatar(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
  avatarPreview.value = URL.createObjectURL(file)
  ui.notify('头像已更新，保存资料后生效', 'success')
}
onBeforeUnmount(() => { if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value) })
</script>

<template>
  <section class="page-container">
    <PageHeader title="个人中心" />
    <div class="profile-shell">
      <nav class="profile-tabs"><button :class="{ active: tab === 'profile' }" @click="tab = 'profile'"><UserRound :size="18" />个人资料</button><button :class="{ active: tab === 'account' }" @click="tab = 'account'"><KeyRound :size="18" />账号信息</button></nav>
      <main v-if="tab === 'profile'" class="profile-panel">
        <header><div class="avatar-large"><img v-if="avatarPreview" :src="avatarPreview" alt="个人头像预览" /><span v-else>{{ auth.profile.avatar }}</span><button type="button" aria-label="上传头像" @click="avatarInput?.click()"><Camera :size="17" /></button><input ref="avatarInput" class="sr-only" type="file" accept="image/png,image/jpeg,image/webp" @change="chooseAvatar" /></div><div><h2>{{ form.name }}</h2><p>{{ auth.profile.label }} · {{ auth.profile.department }}</p></div></header>
        <div class="form-grid"><label>昵称<input v-model="form.name" /></label><label>职务<input v-model="form.title" /></label><label>手机<input v-model="form.phone" /></label><label>工作邮箱<input v-model="form.email" type="email" /></label></div>
        <footer><button class="button primary" type="button" @click="save">保存资料</button></footer>
      </main>
      <main v-else class="profile-panel">
        <header><div><h2>账号信息</h2><p>以下信息由管理员统一分配，个人不能修改。</p></div></header>
        <dl class="account-details"><div><dt>登录账号</dt><dd>{{ auth.profile.account }}</dd></div><div><dt>所属公司</dt><dd>{{ auth.profile.company }}</dd></div><div><dt>所属部门</dt><dd>{{ auth.profile.department }}</dd></div><div><dt>平台角色</dt><dd>{{ auth.profile.label }}</dd></div></dl>
      </main>
    </div>
  </section>
</template>
