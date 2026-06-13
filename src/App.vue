<template>
  <v-app class="rounded rounded-md">
    <LoadSpinner v-if="appLoading" />
    <router-view />
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useAppStore } from './shared/useAppStore'
import { LoadSpinner } from '@/shared/ui'

useAppStore()

const vuexStore = useStore()
const appLoading = computed(() => vuexStore.getters.appLoading)
</script>
