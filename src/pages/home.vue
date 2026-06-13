<template>
  <page-layout title="Главная">
    <div v-if="isLoggedIn && user">
      <div class="ma-5">Пользователь: {{ user.name }} {{ user.email }}</div>
      <v-divider />
      <div class="my-3">
        <router-link to="/profile">Профиль пользователя</router-link>
      </div>
    </div>
    <div v-else class="text-center text-h3 ma-6">Необходима авторизация</div>
  </page-layout>
</template>

<script setup>
import { PageLayout } from '@/shared/ui'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const isLoggedIn = computed(() => store.getters.isLoggedIn)
const user = computed(() => store.getters.user)
</script>

<style scoped></style>
