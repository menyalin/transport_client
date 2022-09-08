<template>
  <div>
    <div v-if="!error">
      ...Подтверждение электройнной почты пользователя
    </div>
    <div v-else>
      Ошибка подтверждения: {{ error }}  
    </div>
  </div>
</template>
<script>
import UserService from '../services/user.service'


export default {
  name: 'ConfirmEmail',
  props: {
    token: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      error: null
    }
  },
  async mounted() {
    try {
      await UserService.confirmEmail(this.token)
      this.$store.dispatch('getUserData')
      this.$router.push('/profile/settings?status=email_confirmed')
    } catch (e) {
      this.error = e?.response?.data || e.message
    }
  }
}
</script>
<style>
  
</style>