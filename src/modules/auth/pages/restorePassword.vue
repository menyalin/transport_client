<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
        lg="4"
      >
        <v-card class="elevation-4">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title>Введите новый пароль</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-form @submit.prevent="submit">
            <v-card-text>
              <transition name="fade">
                <v-alert
                  v-if="!!message"
                  :type="messageType"
                >
                  {{ message }}
                </v-alert>
              </transition>
              <v-text-field
                v-model="$v.form.password.$model"
                label="Пароль"
                prepend-icon="mdi-lock"
                type="password"
                autocomplete="off"
                :error-messages="passwordErrors"
                @input="$v.form.password.$touch()"
                @blur="$v.form.password.$touch()"
              />
              <v-text-field
                id="password"
                v-model="$v.form.confirmPassword.$model"
                label="Повторите пароль"
                prepend-icon="mdi-lock"
                type="password"
                autocomplete="off"
                :error-messages="confirmPasswordErrors"
                @input="$v.form.confirmPassword.$touch()"
                @blur="$v.form.confirmPassword.$touch()"
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
                :disabled="$v.$invalid || loading"
              >
                Установить пароль
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { required, minLength, sameAs  } from 'vuelidate/lib/validators'
import userService from '../services/user.service'

export default {
  name: 'RestorePassword',
  props: {
    token: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      loading: false,
      message: null,
      messageType: null,
      errorTimeoutMs: 5000,
      form: {
        password: '',
        confirmPassword: '',
      }
    }
  },
  computed: {
    passwordErrors() {
      const errors = []
      if (!this.$v.form.password.$dirty) return errors
      !this.$v.form.password.minLength && errors.push('Слишком короткий пароль')
      !this.$v.form.password.required && errors.push('Поле не может быть пустым')
      return errors
    },
    confirmPasswordErrors() {
      const errors = []
      if (!this.$v.form.confirmPassword.$dirty) return errors
      !this.$v.form.confirmPassword.required &&
        errors.push('Поле не может быть пустым')
      !this.$v.form.confirmPassword.sameAs && errors.push('Пароли не совпадают')
      return errors
    },
  },
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(6),
      },
      confirmPassword: {
        required,
        sameAs: sameAs('password'),
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$store.getters.isLoggedIn) {
        vm.$router.push('/')
      }
    })
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
      if (this.$v.$invalid) return null
      try {
        this.loading = true
        await userService.setPassword({ token: this.token, password: this.form.password })
        this.email = null
        this.loading = false
        this.$store.dispatch('getUserData')
        this.$router.push('/')
      } catch (e) {
        if (e?.response?.status === 404) 
          this.showMessage('Email не найден', 'error')
        else if (e?.response?.data === 'jwt expired')  this.showMessage('Время жизни ссылки истекло', 'error')
        else if (e?.response?.data)  this.showMessage(e.response.data, 'error')
        else this.showMessage(e.message, 'error')
        this.loading = false
      }
    },
  }
}
</script>
<style>
  
</style>