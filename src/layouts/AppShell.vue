<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  History, Gauge, UserRound, Settings, LogOut, ChevronDown, ChevronLeft, ChevronRight, BookOpenText,
  Home,
} from '@lucide/vue'
import { useAuthStore } from '../stores/auth.js'
import { useUiStore } from '../stores/ui.js'
import { agents } from '../data/agents.js'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const accountOpen = ref(false)

const displayProfile = computed(() => auth.profile ?? { avatar: '中', name: '用户', label: '平台用户' })
const shellClasses = computed(() => ({
  'with-side': true,
  'side-collapsed': ui.sidebarCollapsed,
}))

function applicationPath(id) {
  if (id === 'innovation') return `/innovation/${auth.isAdmin ? 'admin' : 'researcher'}/upload`
  if (id === 'qa') return '/agent/qa/brief'
  return `/agent/${id}/brief`
}

function logout() {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <div class="app-shell" :class="[`theme-${ui.theme}`, shellClasses]">
    <aside class="side-nav" aria-label="主导航">
      <div class="side-brand">
        <button type="button" aria-label="返回首页" @click="accountOpen = false; router.push('/agents')">
          <i class="side-brand-lockup" aria-hidden="true"></i>
          <span><b>AI 创新应用平台</b><small>中煤深圳研究院</small></span>
        </button>
        <button
          class="collapse-button"
          type="button"
          :aria-label="ui.sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'"
          :title="ui.sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'"
          @click="accountOpen = false; ui.sidebarCollapsed = !ui.sidebarCollapsed"
        >
          <ChevronRight v-if="ui.sidebarCollapsed" :size="17" :stroke-width="2.4" />
          <ChevronLeft v-else :size="17" :stroke-width="2.4" />
        </button>
      </div>

      <nav>
        <div class="side-nav-section">
          <RouterLink class="nav-home" to="/agents" title="首页" @click="accountOpen = false">
            <Home :size="21" /><span>首页</span>
          </RouterLink>
        </div>

        <div class="side-nav-section application-links">
          <small class="side-nav-label">智能应用</small>
          <RouterLink
            v-for="application in agents"
            :key="application.id"
            :to="applicationPath(application.id)"
            :class="['nav-application', `nav-accent-${application.accent}`]"
            :title="application.name"
            @click="accountOpen = false"
          >
            <component :is="application.icon" :size="21" />
            <span>{{ application.name }}</span>
          </RouterLink>
        </div>

        <div class="side-nav-section utility-links">
          <RouterLink class="nav-utility" to="/history" title="历史记录" @click="accountOpen = false">
            <History :size="21" /><span>历史记录</span>
          </RouterLink>
          <RouterLink v-if="auth.isAdmin" class="nav-utility" to="/cockpit" title="驾驶舱" @click="accountOpen = false">
            <Gauge :size="21" /><span>驾驶舱</span>
          </RouterLink>
        </div>
      </nav>

      <button class="side-account" type="button" :aria-expanded="accountOpen" @click="accountOpen = !accountOpen">
        <span>{{ displayProfile.avatar }}</span>
        <b>{{ displayProfile.name }}</b>
        <ChevronDown v-if="!ui.sidebarCollapsed" :size="16" />
      </button>
    </aside>

    <Transition name="menu-pop">
      <aside v-if="accountOpen" class="account-menu from-side">
        <header><span>{{ displayProfile.avatar }}</span><div><b>{{ displayProfile.name }}</b><small>{{ displayProfile.label }}</small></div></header>
        <button type="button" @click="accountOpen = false; router.push('/profile')"><UserRound :size="18" />个人中心</button>
        <button type="button" @click="accountOpen = false; router.push('/knowledge')"><BookOpenText :size="18" />个人知识库</button>
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
