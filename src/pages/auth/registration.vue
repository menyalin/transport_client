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
                v-model.trim="form.name"
                label="Имя"
                name="name"
                autocomplete="name"
                prepend-icon="mdi-account"
                :error-messages="nameErrors"
                @update:model-value="v.form.name.$touch()"
                @blur="v.form.name.$touch()"
              />
              <v-text-field
                v-model.trim="form.email"
                label="Email"
                name="email"
                autocomplete="email"
                prepend-icon="mdi-at"
                type="email"
                :error-messages="emailErrors"
                @update:model-value="v.form.email.$touch()"
                @blur="v.form.email.$touch()"
              />
              <v-text-field
                id="password"
                v-model="form.password"
                label="Пароль"
                name="password"
                autocomplete="new-password"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :error-messages="passwordErrors"
                @click:append-inner="showPassword = !showPassword"
                @update:model-value="v.form.password.$touch()"
                @blur="v.form.password.$touch()"
              />
              <v-text-field
                id="confirm-password"
                v-model="form.confirmPassword"
                label="Повторите пароль"
                name="confirm-password"
                autocomplete="new-password"
                prepend-icon="mdi-lock"
                :type="showConfirmPassword ? 'text' : 'password'"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :error-messages="confirmPasswordErrors"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                @update:model-value="v.form.confirmPassword.$touch()"
                @blur="v.form.confirmPassword.$touch()"
              />
            </v-card-text>
            <v-card-actions>
              <router-link to="/auth/login">
                <small>Уже зарегистрирован</small>
              </router-link>
              <v-spacer />
              <v-btn color="primary" type="submit" :loading="loading" :disabled="v.$invalid">
                Зарегистрироваться
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, email } from '@vuelidate/validators'

defineOptions({ name: 'AuthRegistration' })

const router = useRouter()

const store = useStore()

onMounted(() => {
  if (store.getters.isLoggedIn) {
    router.push('/')
  }
})

const formTitle = ref('Форма регистрации')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const form = ref({
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
})
const message = ref(null)
const messageType = ref(null)
const errorTimeoutMs = 5000

const rules = {
  form: {
    email: { required, email },
    name: { required },
    password: {
      required,
      minLength: minLength(6),
    },
    confirmPassword: {
      required,
      sameAs: sameAs(computed(() => form.value.password)),
    },
  },
}

const v = useVuelidate(rules, form)

const nameErrors = computed(() => {
  const errors = []
  if (!v.value.form.name.$dirty) return errors
  !v.value.form.name.required && errors.push('Имя не может быть пустым')
  return errors
})

const emailErrors = computed(() => {
  const errors = []
  if (!v.value.form.email.$dirty) return errors
  !v.value.form.email.email && errors.push('Не корректный email')
  !v.value.form.email.required && errors.push('Email не может быть пустым')
  return errors
})

const passwordErrors = computed(() => {
  const errors = []
  if (!v.value.form.password.$dirty) return errors
  !v.value.form.password.minLength && errors.push('Слишком короткий пароль')
  !v.value.form.password.required && errors.push('Пароль не может быть пустым')
  return errors
})

const confirmPasswordErrors = computed(() => {
  const errors = []
  if (!v.value.form.confirmPassword.$dirty) return errors
  !v.value.form.confirmPassword.required && errors.push('Подтверждение пароля не может быть пустым')
  !v.value.form.confirmPassword.sameAs && errors.push('Password mismatch')
  return errors
})

const showMessage = (msg, type) => {
  messageType.value = type
  message.value = msg
  setTimeout(() => {
    message.value = null
    messageType.value = null
  }, errorTimeoutMs)
}

const submit = async () => {
  if (v.value.$invalid) return

  loading.value = true
  const newUser = {
    email: form.value.email,
    name: form.value.name,
    password: form.value.password,
  }

  try {
    const res = await store.dispatch('signUp', newUser)
    if (res.accessToken) {
      router.push('/profile/settings?status=need_email_confirmation')
    } else {
      showMessage(res.message, 'warning')
    }
  } catch (e) {
    if (e.response?.data?.message === 'validation fail') {
      showMessage('Incorrect data entered :( ', 'error')
    } else if (e.response?.status === 406) {
      showMessage('Пользователь с таким email уже зарегистрирован', 'error')
    } else {
      showMessage(e.message, 'error')
    }
  } finally {
    loading.value = false
  }
}
</script>
