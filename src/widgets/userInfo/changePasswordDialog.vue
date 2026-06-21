<template>
  <v-dialog :model-value="dialog" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h5"> Изменение пароля </v-card-title>
      <v-card-text>
        <form @submit.prevent>
          <v-text-field v-model="password" type="password" label="Действующий пароль" />
          <v-text-field
            v-model="newPassword"
            type="password"
            label="Новый пароль"
            :error-messages="newPasswordErrors"
            @update:model-value="v.newPassword.$touch()"
            @blur="v.newPassword.$touch()"
          />
          <v-text-field
            v-model="confirmPassword"
            type="password"
            label="Новый пароль"
            :error-messages="confirmPasswordErrors"
            @update:model-value="v.confirmPassword.$touch()"
            @blur="v.confirmPassword.$touch()"
          />
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel"> Отмена </v-btn>

        <v-btn :disabled="v.$invalid" color="primary" variant="text" @click="saveHandler">
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'
import { UserService } from '@/shared/services'

defineProps({
  dialog: Boolean,
})

const emit = defineEmits(['cancel'])

const store = useStore()

const password = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const rules = {
  password: { required },
  newPassword: { required, minLength: minLength(6) },
  confirmPassword: {
    required,
    sameAs: sameAs(computed(() => newPassword.value)),
  },
}

const v = useVuelidate(rules, { password, newPassword, confirmPassword })

const newPasswordErrors = computed(() => {
  const errors = []
  if (!v.value.newPassword.$dirty) return errors
  !v.value.newPassword.minLength && errors.push('Слишком короткий пароль')
  !v.value.newPassword.required && errors.push('Поле не может быть пустым')
  return errors
})

const confirmPasswordErrors = computed(() => {
  const errors = []
  if (!v.value.confirmPassword.$dirty) return errors
  !v.value.confirmPassword.required && errors.push('Поле не может быть пустым')
  !v.value.confirmPassword.sameAs && errors.push('Пароли не совпадают')
  return errors
})

const cancel = () => {
  password.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  emit('cancel')
}

const saveHandler = async () => {
  const body = {
    oldPassword: password.value,
    newPassword: newPassword.value,
  }
  try {
    await UserService.changePassword(body)
    v.value.$reset()
    store.commit('setError', 'Пароль успешно обновлен')
    cancel()
  } catch (e) {
    store.commit('setError', e)
  }
}
</script>
<style></style>
