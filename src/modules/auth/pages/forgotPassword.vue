<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-4">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-form @submit.prevent="submit">
            <v-card-text>
              <transition name="fade">
                <v-alert v-if="!!message" :type="messageType">
                  {{ message }}
                </v-alert>
              </transition>
              <v-text-field
                v-model="email"
                label="Email"
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
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$store.getters.isLoggedIn) {
        vm.$router.push('/')
      }
    })
  },
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
        this.showMessage(
          'На указанный адрес отправлено письмо с ссылкой',
          'info'
        )
        this.email = null
        this.loading = false
      } catch (e) {
        if (e?.response?.status === 404)
          this.showMessage('Email не найден', 'error')
        else if (e?.response?.data) this.showMessage(e.response.data, 'error')
        else this.showMessage(e.message, 'error')
        this.loading = false
      }
    },
  },
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
