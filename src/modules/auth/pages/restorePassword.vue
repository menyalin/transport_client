<template>
  <v-container class="fill-height" fluid>
    <v-row class="align-center justify-center">
      <v-col cols="12" sm="8" md="4" lg="4">
        <v-card class="elevation-4">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Введите новый пароль</v-toolbar-title>
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
                v-model="form.password"
                label="Пароль"
                prepend-icon="mdi-lock"
                type="password"
                autocomplete="off"
                :error-messages="passwordErrors"
                @update:model-value="v.form.password.$touch()"
                @blur="v.form.password.$touch()"
              />
              <v-text-field
                id="password"
                v-model="form.confirmPassword"
                label="Повторите пароль"
                prepend-icon="mdi-lock"
                type="password"
                autocomplete="off"
                :error-messages="confirmPasswordErrors"
                @update:model-value="v.form.confirmPassword.$touch()"
                @blur="v.form.confirmPassword.$touch()"
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
                :disabled="v.$invalid || loading"
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'
import { UserService } from '@/shared/services'

const router = useRouter()

const store = useStore()

onMounted(() => {
  if (store.getters.isLoggedIn) {
    router.push('/')
  }
})

const props = defineProps({
  token: {
    type: String,
    required: true,
  },
})

const loading = ref(false)
const message = ref(null)
const messageType = ref(null)
const errorTimeoutMs = 5000
const form = ref({
  password: '',
  confirmPassword: '',
})

const rules = {
  form: {
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

const passwordErrors = computed(() => {
  const errors = []
  if (!v.value.form.password.$dirty) return errors
  !v.value.form.password.minLength && errors.push('Слишком короткий пароль')
  !v.value.form.password.required && errors.push('Поле не может быть пустым')
  return errors
})

const confirmPasswordErrors = computed(() => {
  const errors = []
  if (!v.value.form.confirmPassword.$dirty) return errors
  !v.value.form.confirmPassword.required && errors.push('Поле не может быть пустым')
  !v.value.form.confirmPassword.sameAs && errors.push('Пароли не совпадают')
  return errors
})

const showMessage = (msg, type, cb) => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = null
    messageType.value = null
    if (cb) cb()
  }, errorTimeoutMs)
}

const submit = async () => {
  if (v.value.$invalid) return

  try {
    loading.value = true
    await UserService.setPassword({
      token: props.token,
      password: form.value.password,
    })
    loading.value = false
    await store.dispatch('getUserData')
    router.push('/')
  } catch (e) {
    if (e?.response?.status === 404) showMessage('Email не найден', 'error')
    else if (e?.response?.data === 'jwt expired') showMessage('Время жизни ссылки истекло', 'error')
    else if (e?.response?.data) showMessage(e.response.data, 'error')
    else showMessage(e.message, 'error')
    loading.value = false
  }
}
</script>
<style></style>
