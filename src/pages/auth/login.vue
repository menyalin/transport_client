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
              <v-text-field
                id="password"
                v-model="password"
                label="Пароль"
                name="password"
                autocomplete="current-password"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
              />
            </v-card-text>
            <v-card-actions>
              <router-link to="/auth/registration">
                <small>Зарегистрироваться</small>
              </router-link>
              <router-link to="/auth/forgot_password" class="ml-3">
                <small>Забыли пароль?</small>
              </router-link>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="!isFormValid && loading"
              >
                Войти
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
defineOptions({ name: 'AuthLogin' })
</script>
<script>
import { mapActions } from 'vuex'
export default {
  data: () => ({
    formTitle: 'Войти в систему',
    loading: false,
    email: '',
    password: '',
    showPassword: false,
    message: null,
    messageType: null,
    errorTimeoutMs: 5000,
  }),
  computed: {
    isFormValid() {
      return !!this.email && this.password
    },
  },
  methods: {
    ...mapActions(['signIn']),
    showMessage(message, messageType) {
      this.message = message
      this.messageType = messageType
      setTimeout(() => {
        this.message = null
        this.messageType = null
      }, this.errorTimeoutMs)
    },
    submit() {
      this.loading = true
      const user = { email: this.email, password: this.password }
      this.$store
        .dispatch('signIn', user)
        .then(() => {
          this.$router.push(this.$route.query.redirect || '/')
        })
        .catch((e) => {
          if (e.response?.status === 404) {
            this.showMessage('User not found', 'error')
          } else {
            this.showMessage(e.message, 'error')
          }
        })
        .finally(() => (this.loading = false))
    },
  },
}
</script>
