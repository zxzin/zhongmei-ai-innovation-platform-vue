<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  House, Gauge, History, ChevronDown, UserRound, Settings, LogOut, BookOpenText,
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
const recentTasksOpen = ref(false)
const recentTasksExpanded = ref(true)
const recentTasksAnchorY = ref(16)
let recentTasksCloseTimer

const displayProfile = computed(() => auth.profile ?? { avatar: '中', name: '用户', label: '平台用户' })
const shellClasses = computed(() => ({
  'with-side': true,
  'side-collapsed': ui.sidebarCollapsed,
  'cockpit-fullscreen': ui.cockpitFullscreen,
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

function openHistoryRecord(record) {
  accountOpen.value = false
  recentTasksOpen.value = false
  router.push(record.resumePath || '/agents')
}

function openHistory() {
  accountOpen.value = false
  recentTasksOpen.value = false
  router.push('/history')
}

function showRecentTasks(event) {
  keepRecentTasksOpen()
  const { top } = event.currentTarget.getBoundingClientRect()
  const flyoutHeight = Math.min(248, window.innerHeight - 32)
  recentTasksAnchorY.value = Math.max(16, Math.min(Math.round(top - 10), window.innerHeight - flyoutHeight - 16))
  recentTasksOpen.value = true
}

function keepRecentTasksOpen() {
  window.clearTimeout(recentTasksCloseTimer)
}

function scheduleRecentTasksClose() {
  keepRecentTasksOpen()
  recentTasksCloseTimer = window.setTimeout(() => {
    recentTasksOpen.value = false
  }, 180)
}

function toggleRecentTasksList() {
  recentTasksExpanded.value = !recentTasksExpanded.value
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
          @click="accountOpen = false; recentTasksOpen = false; ui.sidebarCollapsed = !ui.sidebarCollapsed"
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

        <div class="side-nav-scroll-region">
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

          <section
            v-if="tasks.recent.length"
            class="recent-tasks"
            :class="{ 'is-collapsed': !recentTasksExpanded }"
            aria-label="历史记录"
          >
            <div class="recent-tasks-heading">
              <RouterLink
                class="recent-tasks-page-link"
                to="/history"
                @click="accountOpen = false; recentTasksOpen = false"
              >
                <History :size="21" aria-hidden="true" />
                <span>历史记录</span>
              </RouterLink>
              <button
                class="recent-tasks-toggle"
                type="button"
                :aria-expanded="recentTasksExpanded"
                aria-controls="recent-tasks-list"
                :aria-label="recentTasksExpanded ? '收起历史记录列表' : '展开历史记录列表'"
                :title="recentTasksExpanded ? '收起历史记录列表' : '展开历史记录列表'"
                @click="toggleRecentTasksList"
              >
                <ChevronDown :size="16" aria-hidden="true" />
              </button>
            </div>
            <div v-show="recentTasksExpanded" id="recent-tasks-list" class="recent-tasks-list">
              <button v-for="task in tasks.recent" :key="task.id" type="button" :title="task.title" @click="openHistoryRecord(task)">
                <component :is="agentMap[task.agent].icon" :size="20" />
                <span>{{ task.title }}</span>
              </button>
            </div>
          </section>
        </div>
        <button
          v-if="tasks.recent.length"
          class="recent-tasks-trigger"
          type="button"
          title="历史记录"
          aria-label="打开历史记录"
          :aria-expanded="recentTasksOpen"
          aria-controls="recent-tasks-flyout"
          @mouseenter="showRecentTasks"
          @mouseleave="scheduleRecentTasksClose"
          @focus="showRecentTasks"
          @blur="scheduleRecentTasksClose"
          @click="openHistory"
        >
          <i class="recent-tasks-trigger-icon" aria-hidden="true">
            <History :size="21" />
            <span class="recent-tasks-trigger-caret"></span>
          </i>
          <span class="recent-tasks-trigger-label">历史记录</span>
        </button>
      </nav>

      <RouterLink
        v-if="auth.isAdmin"
        class="side-cockpit"
        to="/cockpit"
        title="驾驶舱"
        @click="accountOpen = false"
      >
        <Gauge :size="21" />
        <span>驾驶舱</span>
      </RouterLink>
      <div class="side-footer">
        <button class="side-account" type="button" :aria-expanded="accountOpen" @click="accountOpen = !accountOpen">
          <span>{{ displayProfile.avatar }}</span>
          <b>{{ displayProfile.name }}</b>
        </button>
      </div>
      <Transition name="menu-pop">
        <aside v-if="accountOpen" class="account-menu from-side">
          <header><span>{{ displayProfile.avatar }}</span><div><b>{{ displayProfile.name }}</b><small>{{ displayProfile.label }}</small></div></header>
          <button type="button" @click="accountOpen = false; router.push('/profile')"><UserRound :size="18" />个人中心</button>
          <button type="button" @click="accountOpen = false; router.push('/knowledge')"><BookOpenText :size="18" />个人知识库</button>
          <a v-if="auth.isAdmin" class="account-menu-link" href="#/admin/operations" target="_blank" rel="noopener" @click="accountOpen = false"><Settings :size="18" />管理中心</a>
          <button type="button" @click="logout"><LogOut :size="18" />退出登录</button>
        </aside>
      </Transition>
    </aside>

    <Transition name="recent-tasks-pop">
      <aside
        v-if="ui.sidebarCollapsed && recentTasksOpen"
        id="recent-tasks-flyout"
        class="recent-tasks-flyout"
        aria-label="历史记录"
        :style="{ top: `${recentTasksAnchorY}px` }"
        @mouseenter="keepRecentTasksOpen"
        @mouseleave="scheduleRecentTasksClose"
      >
        <header class="recent-tasks-flyout-heading">
          <History :size="18" aria-hidden="true" />
          <h2>历史记录</h2>
        </header>
        <div class="recent-tasks-flyout-list">
          <button v-for="task in tasks.recent" :key="task.id" type="button" :title="task.title" @click="openHistoryRecord(task)">
            <component :is="agentMap[task.agent].icon" :size="18" />
            <span>{{ task.title }}</span>
          </button>
        </div>
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
