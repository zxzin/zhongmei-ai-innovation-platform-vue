import { createRouter, createWebHashHistory } from 'vue-router'
import AppShell from '../layouts/AppShell.vue'
import LoginPage from '../pages/LoginPage.vue'
import AgentHubPage from '../pages/AgentHubPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'
import CockpitPage from '../pages/CockpitPage.vue'
import ProfilePage from '../pages/ProfilePage.vue'
import KnowledgeBasePage from '../pages/KnowledgeBasePage.vue'
import AdminPage from '../pages/AdminPage.vue'
import AgentPage from '../pages/AgentPage.vue'
import QaAgentPage from '../pages/QaAgentPage.vue'
import InnovationPage from '../pages/InnovationPage.vue'

function pathFromLegacyRoute(route = '') {
  const [kind, id, stage] = route.split('/')
  if (kind === 'page') {
    if (['dashboard', 'agents'].includes(id)) return '/agents'
    if (id === 'history') return '/history'
    if (id === 'profile') return '/profile'
    if (id === 'knowledge') return '/knowledge'
    if (id === 'cockpit') return '/cockpit'
    if (['admin', 'users', 'templates', 'operations', 'security'].includes(id)) return `/admin/${id === 'admin' ? 'users' : id === 'security' ? 'logs' : id}`
  }
  if (kind === 'agent') return id === 'qa' ? `/agent/qa/${stage || 'brief'}` : `/agent/${id}/${stage || 'brief'}`
  if (kind === 'innovation') return `/innovation/researcher/${id || 'upload'}`
  return '/agents'
}

const legacyRoute = new URLSearchParams(window.location.search).get('cmRoute')

function readSession() {
  try {
    return JSON.parse(localStorage.getItem('cm-vue-session') || 'null')
  } catch {
    localStorage.removeItem('cm-vue-session')
    return null
  }
}

const routes = [
  { path: '/login', name: 'login', component: LoginPage, meta: { public: true } },
  {
    path: '/', component: AppShell,
    children: [
      { path: '', redirect: () => legacyRoute ? pathFromLegacyRoute(legacyRoute) : '/agents' },
      { path: 'agents', name: 'agents', component: AgentHubPage },
      { path: 'history', name: 'history', component: HistoryPage },
      { path: 'cockpit', name: 'cockpit', component: CockpitPage, meta: { cockpit: true } },
      { path: 'profile', name: 'profile', component: ProfilePage },
      { path: 'knowledge', name: 'knowledge', component: KnowledgeBasePage },
      { path: 'admin/:section?', name: 'admin', component: AdminPage, meta: { admin: true } },
      { path: 'agent/qa/:stage?', name: 'qa-agent', component: QaAgentPage, meta: { focus: true } },
      { path: 'agent/:id/:stage?', name: 'agent', component: AgentPage, meta: { focus: true } },
      { path: 'innovation/:mode/:stage?', name: 'innovation', component: InnovationPage, meta: { focus: true } },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/agents' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const session = readSession()
  if (!to.meta.public && !session) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.name === 'login' && session) return { name: 'agents' }
  if (to.meta.admin && session?.account !== 'Admin') return { name: 'agents' }
  if (to.meta.cockpit && session?.account !== 'Admin') return { name: 'agents' }
  return true
})

export default router
