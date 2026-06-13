<template>
  <v-main>
    <v-container fluid>
      <v-row class="align-center justify-center">
        <v-col cols="12" md="6">
          <v-alert :type="alertType">{{ message }}</v-alert>
          <router-link :to="redirectPath">
            {{ linkText }}
          </router-link>
          <br />
          <small>До автоматического перехода осталось {{ secBefore }} сек</small>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  alertType: {
    type: String,
    default: 'error',
  },
  message: {
    type: String,
    default: 'Произошла ошибка',
  },
  redirectPath: {
    type: String,
    default: '/',
  },
  autoRedirectDelay: {
    type: Number,
    default: 5,
  },
})

const router = useRouter()

const secBefore = ref(props.autoRedirectDelay)
let interval = null

const linkText = computed(() => {
  return props.redirectPath !== '/' ? 'Вернуться назад' : 'Перейти на главную страницу'
})

const intervalHandler = () => {
  if (secBefore.value <= 0) {
    clearInterval(interval)
    router.push(props.redirectPath)
  } else {
    secBefore.value--
  }
}

onMounted(() => {
  interval = setInterval(intervalHandler, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped></style>
