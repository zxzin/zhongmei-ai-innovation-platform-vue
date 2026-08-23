<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  House, UserRound, Settings, LogOut, BookOpenText,
} from '@lucide/vue'
import { useAuthStore } from '../stores/auth.js'
import { useUiStore } from '../stores/ui.js'
import { agents, agentMap } from '../data/agents.js'
import { useTasksStore } from '../stores/tasks.js'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const ui = useUiStore()
const tasks = useTasksStore()
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

function applicationIsActive(id) {
  const path = applicationPath(id)
  return route.path.startsWith(path.slice(0, path.lastIndexOf('/') + 1))
}

function openRecentTask(task) {
  accountOpen.value = false
  router.push(task.agent === 'innovation'
    ? `/innovation/${auth.isAdmin ? 'admin' : 'researcher'}/report`
    : `/agent/${task.agent}/report`)
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
          <img
            class="collapse-reference-icon"
            :class="{ 'is-reversed': ui.sidebarCollapsed }"
            src="/sidebar-collapse-control.png"
            alt=""
            aria-hidden="true"
          />
        </button>
      </div>

      <nav>
        <RouterLink class="nav-home" to="/agents" title="首页" @click="accountOpen = false">
          <House :size="21" /><span>首页</span>
        </RouterLink>

        <div class="side-nav-section application-links">
          <small class="side-nav-label">智能应用</small>
          <RouterLink
            v-for="application in agents"
            :key="application.id"
            :to="applicationPath(application.id)"
            :class="['nav-application', `nav-accent-${application.accent}`, { 'router-link-active': applicationIsActive(application.id) }]"
            :title="application.name"
            @click="accountOpen = false"
          >
            <component :is="application.icon" :size="21" />
            <span>{{ application.name }}</span>
          </RouterLink>
        </div>

        <section v-if="tasks.recent.length" class="recent-tasks" aria-label="最近任务">
          <h2>最近任务</h2>
          <button v-for="task in tasks.recent" :key="task.id" type="button" :title="task.title" @click="openRecentTask(task)">
            <component :is="agentMap[task.agent].icon" :size="20" />
            <span>{{ task.title }}</span>
          </button>
        </section>
      </nav>

      <button class="side-account" type="button" :aria-expanded="accountOpen" @click="accountOpen = !accountOpen">
        <span>{{ displayProfile.avatar }}</span>
        <b>{{ displayProfile.name }}</b>
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
