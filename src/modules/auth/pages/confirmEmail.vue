<template>
  <div>
    <div v-if="!error">...Подтверждение электройнной почты пользователя</div>
    <div v-else>Ошибка подтверждения: {{ error }}</div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { UserService } from '@/shared/services'

defineOptions({ name: 'ConfirmEmail' })

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
})

const store = useStore()
const router = useRouter()

const error = ref(null)

onMounted(async () => {
  try {
    await UserService.confirmEmail(props.token)
    store.dispatch('getUserData')
    router.push('/profile/settings?status=email_confirmed')
  } catch (e) {
    error.value = e?.response?.data || e.message
  }
})
</script>
<style />
