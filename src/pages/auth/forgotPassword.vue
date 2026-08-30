<template>
  <v-container class="h-screen" fluid>
    <v-row class="align-center justify-center fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-4">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-form @submit.prevent="submit">
            <v-card-text>
              <v-alert v-if="!!message" :type="messageType" class="mb-4">
                {{ message }}
              </v-alert>
              <v-text-field
                v-model="email"
                label="Email"
                name="email"
                autocomplete="email"
                prepend-icon="mdi-at"
                type="email"
              />
            </v-card-text>
            <v-card-actions>
              <router-link to="/auth/login">
                <small>Войти в систему</small>
              </router-link>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="!isFormValid || loading"
              >
                Восстановить пароль
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

defineOptions({ name: 'ForgotPassword' })

const router = useRouter()
const store = useStore()

onMounted(() => {
  if (store.getters.isLoggedIn) {
    router.push('/')
  }
})
</script>
<script>
import { UserService } from '@/shared/services'

export default {
  data: () => ({
    formTitle: 'Забыли пароль?',
    loading: false,
    email: null,
    message: null,
    messageType: null,
    errorTimeoutMs: 5000,
  }),
  computed: {
    isFormValid() {
      return !!this.email
    },
  },
  methods: {
    showMessage(message, messageType, cb) {
      this.message = message
      this.messageType = messageType
      setTimeout(() => {
        this.message = null
        this.messageType = null
        if (cb) cb()
      }, this.errorTimeoutMs)
    },
    async submit() {
      try {
        this.loading = true
        await UserService.forgotPassword(this.email)
        this.showMessage('На указанный адрес отправлено письмо с ссылкой', 'info')
        this.email = null
        this.loading = false
      } catch (e) {
        if (e?.response?.status === 404) this.showMessage('Email не найден', 'error')
        else if (e?.response?.data) this.showMessage(e.response.data, 'error')
        else this.showMessage(e.message, 'error')
        this.loading = false
      }
    },
  },
}
</script>
