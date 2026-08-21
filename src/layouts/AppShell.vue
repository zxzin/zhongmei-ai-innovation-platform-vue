<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  History, Gauge, UserRound, Settings, LogOut, ChevronDown, BookOpenText,
} from '@lucide/vue'
import { useAuthStore } from '../stores/auth.js'
import { useUiStore } from '../stores/ui.js'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const accountOpen = ref(false)

const isFocus = computed(() => Boolean(route.meta.focus))
const displayProfile = computed(() => auth.profile ?? { avatar: '中', name: '用户', label: '平台用户' })

function logout() {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="app-shell" :class="[`theme-${ui.theme}`, { 'is-focus': isFocus }]">
    <header v-if="isFocus" class="focus-header">
      <button class="brand-button" type="button" aria-label="返回首页" @click="accountOpen = false; router.push('/agents')">
        <img src="/chinacoal-logo.png" alt="中煤 Logo" />
        <span>AI 创新应用平台</span>
      </button>
      <button class="account-trigger compact" type="button" :aria-expanded="accountOpen" @click="accountOpen = !accountOpen">
        <span>{{ displayProfile.avatar }}</span><b>{{ displayProfile.name }}</b><ChevronDown :size="16" />
      </button>
    </header>

    <header v-else class="top-nav">
      <button class="brand-button" type="button" aria-label="返回首页" @click="accountOpen = false; router.push('/agents')">
        <img src="/chinacoal-logo.png" alt="中煤 Logo" />
        <span>AI 创新应用平台</span>
      </button>
      <button class="account-trigger" type="button" :aria-expanded="accountOpen" @click="accountOpen = !accountOpen">
        <span>{{ displayProfile.avatar }}</span><b>{{ displayProfile.name }}</b><ChevronDown :size="16" />
      </button>
    </header>

    <Transition name="menu-pop">
      <aside v-if="accountOpen" class="account-menu">
        <header><span>{{ displayProfile.avatar }}</span><div><b>{{ displayProfile.name }}</b><small>{{ displayProfile.label }}</small></div></header>
        <button type="button" @click="accountOpen = false; router.push('/profile')"><UserRound :size="18" />个人中心</button>
        <button type="button" @click="accountOpen = false; router.push('/knowledge')"><BookOpenText :size="18" />个人知识库</button>
        <button type="button" @click="accountOpen = false; router.push('/history')"><History :size="18" />历史记录</button>
        <button v-if="auth.canViewCockpit" type="button" @click="accountOpen = false; router.push('/cockpit')"><Gauge :size="18" />驾驶舱</button>
        <button v-if="auth.isAdmin" type="button" @click="accountOpen = false; router.push('/admin/operations')"><Settings :size="18" />管理员工作台</button>
        <button type="button" @click="logout"><LogOut :size="18" />退出登录</button>
      </aside>
    </Transition>

    <main class="app-content" @click="accountOpen = false">
      <RouterView />
    </main>

    <Transition name="toast-pop">
      <div v-if="ui.toast" class="app-toast" :class="`tone-${ui.toast.tone}`" role="status">{{ ui.toast.message }}</div>
    </Transition>
  </div>
</template>
