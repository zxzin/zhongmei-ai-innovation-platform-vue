<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  History, Gauge, UserRound, Settings, LogOut, ChevronDown, BookOpenText,
  LayoutDashboard, PanelLeftClose, PanelLeftOpen,
} from '@lucide/vue'
import { useAuthStore } from '../stores/auth.js'
import { useUiStore } from '../stores/ui.js'
import { agents } from '../data/agents.js'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const accountOpen = ref(false)
const sideCollapsed = ref(false)

const displayProfile = computed(() => auth.profile ?? { avatar: '中', name: '用户', label: '平台用户' })
function agentPath(agent) {
  if (agent.id === 'innovation') return '/innovation/researcher/upload'
  if (agent.id === 'qa') return '/agent/qa/brief'
  return `/agent/${agent.id}/brief`
}

function logout() {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="app-shell with-side" :class="[`theme-${ui.theme}`, { 'side-collapsed': sideCollapsed }]">
    <aside class="side-nav" aria-label="主导航">
      <div class="side-brand">
        <button type="button" aria-label="返回首页" @click="accountOpen = false; router.push('/agents')">
          <img src="/chinacoal-logo.png" alt="中煤 Logo" />
          <span><b>AI 创新应用平台</b><small>中煤深圳研究院</small></span>
        </button>
        <button class="collapse-button" type="button" :aria-label="sideCollapsed ? '展开导航' : '收起导航'" @click="sideCollapsed = !sideCollapsed">
          <PanelLeftOpen v-if="sideCollapsed" :size="19" /><PanelLeftClose v-else :size="19" />
        </button>
      </div>

      <nav>
        <RouterLink to="/agents" exact-active-class="router-link-active"><LayoutDashboard :size="19" /><span>首页</span></RouterLink>
        <RouterLink v-if="auth.canViewCockpit" class="side-cockpit-link" to="/cockpit"><Gauge :size="18" /><span>驾驶舱</span></RouterLink>
        <p class="side-section-label">智能应用</p>
        <RouterLink v-for="agent in agents" :key="agent.id" class="side-agent-link" :to="agentPath(agent)">
          <component :is="agent.icon" :size="18" /><span>{{ agent.name }}</span>
        </RouterLink>
      </nav>

      <button class="side-account" type="button" :aria-expanded="accountOpen" @click="accountOpen = !accountOpen">
        <span>{{ displayProfile.avatar }}</span><b>{{ displayProfile.name }}</b><ChevronDown :size="16" />
      </button>
    </aside>

    <Transition name="menu-pop">
      <aside v-if="accountOpen" class="account-menu from-side">
        <header><span>{{ displayProfile.avatar }}</span><div><b>{{ displayProfile.name }}</b><small>{{ displayProfile.label }}</small></div></header>
        <button type="button" @click="accountOpen = false; router.push('/profile')"><UserRound :size="18" />个人中心</button>
        <button type="button" @click="accountOpen = false; router.push('/knowledge')"><BookOpenText :size="18" />个人知识库</button>
        <button type="button" @click="accountOpen = false; router.push('/history')"><History :size="18" />历史记录</button>
        <button v-if="auth.isAdmin" type="button" @click="accountOpen = false; router.push('/admin/operations')"><Settings :size="18" />管理员工作台</button>
        <button type="button" @click="logout"><LogOut :size="18" />退出登录</button>
      </aside>
    </Transition>

    <section class="app-content" @click="accountOpen = false"><main><RouterView /></main></section>

    <Transition name="toast-pop">
      <div v-if="ui.toast" class="app-toast" :class="`tone-${ui.toast.tone}`" role="status">{{ ui.toast.message }}</div>
    </Transition>
  </div>
</template>
