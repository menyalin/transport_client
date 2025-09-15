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
                v-model.trim="v$.form.name.$model"
                label="Имя"
                prepend-icon="mdi-account"
                type="text"
                required
                :error-messages="nameErrors"
                @update:model-value="v$.form.name.$touch()"
                @blur="v$.form.name.$touch()"
              />
              <v-text-field
                v-model.trim="v$.form.email.$model"
                label="Email"
                prepend-icon="mdi-at"
                type="email"
                :error-messages="emailErrors"
                required
                @update:model-value="v$.form.email.$touch()"
                @blur="v$.form.email.$touch()"
              />
              <v-text-field
                id="password"
                v-model="v$.form.password.$model"
                label="Пароль"
                prepend-icon="mdi-lock"
                type="password"
                :error-messages="passwordErrors"
                required
                @update:model-value="v$.form.password.$touch()"
                @blur="v$.form.password.$touch()"
              />
              <v-text-field
                id="password"
                v-model="v$.form.confirmPassword.$model"
                label="Повторите пароль"
                prepend-icon="mdi-lock"
                type="password"
                :error-messages="confirmPasswordErrors"
                required
                @update:model-value="v$.form.confirmPassword.$touch()"
                @blur="v$.form.confirmPassword.$touch()"
              />
            </v-card-text>
            <v-card-actions>
              <router-link to="/auth/login">
                <small>Уже зарегистрирован</small>
              </router-link>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="v$.form.$invalid"
              >
                Зарегистрироваться
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, email } from '@vuelidate/validators'

export default {
  setup() {
    return {
      v$: useVuelidate(),
    }
  },
  data: () => ({
    formTitle: 'Форма регистрации',
    loading: false,
    form: {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    },
    message: null,
    messageType: null,
    errorTimeoutMs: 5000,
  }),
  validations: {
    form: {
      email: {
        required,
        email,
      },
      name: { required },
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
  computed: {
    isValidForm() {
      return false
    },
    nameErrors() {
      const errors = []
      if (!this.v$.form.name.$dirty) return errors
      !this.v$.form.name.required && errors.push('Имя не может быть пустым')
      return errors
    },
    emailErrors() {
      const errors = []
      if (!this.v$.form.email.$dirty) return errors
      !this.v$.form.email.email && errors.push('Не корректный email')
      !this.v$.form.email.required && errors.push('Email не может быть пустым')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.v$.form.password.$dirty) return errors
      !this.v$.form.password.minLength && errors.push('Слишком короткий пароль')
      !this.v$.form.password.required &&
        errors.push('Пароль не может быть пустым')
      return errors
    },
    confirmPasswordErrors() {
      const errors = []
      if (!this.v$.form.confirmPassword.$dirty) return errors
      !this.v$.form.confirmPassword.required &&
        errors.push('Подтверждение пароля не может быть пустым')
      !this.v$.form.confirmPassword.sameAs && errors.push('Password mismatch')
      return errors
    },
  },
  methods: {
    ...mapActions(['signUp']),
    showMessage(message, type) {
      this.messageType = type
      this.message = message
      setTimeout(() => {
        this.message = null
        this.messageType = null
      }, this.errorTimeoutMs)
    },
    submit() {
      this.loading = true
      const newUser = {
        email: this.form.email,
        name: this.form.name,
        password: this.form.password,
      }
      this.signUp(newUser)
        .then((res) => {
          if (res.accessToken) {
            this.$router.push(
              '/profile/settings?status=need_email_confirmation'
            )
          } else this.showMessage(res.message, 'warning')
        })
        .catch((e) => {
          if (e.response.data.message === 'validation fail') {
            this.showMessage('Incorrect data entered :( ', 'error')
          } else if (e.response.status === 406) {
            this.showMessage(
              'Пользователь с таким email уже зарегистрирован',
              'error'
            )
          } else {
            this.showMessage(e.message, 'error')
          }
        })
        .finally(() => (this.loading = false))
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
