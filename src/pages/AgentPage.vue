<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SemanticSearchPage from './apps/SemanticSearchPage.vue'
import ResearchReportPage from './apps/ResearchReportPage.vue'
import FeasibilityPage from './apps/FeasibilityPage.vue'
import DisclosurePage from './apps/DisclosurePage.vue'

const route = useRoute()
const views = { semantic: SemanticSearchPage, research: ResearchReportPage, feasibility: FeasibilityPage, disclosure: DisclosurePage }
const currentView = computed(() => views[route.params.id] || SemanticSearchPage)
</script>

<template><component :is="currentView" /></template>
