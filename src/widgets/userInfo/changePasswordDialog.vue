<template>
  <v-dialog
:modelValue="dialog"
maxWidth="600" persistent @update:model-value="$emit('update:dialog', $event)"
>
    <v-card>
      <v-card-title class="text-h5">Изменение пароля</v-card-title>
      <v-card-text>
        <form @submit.prevent>
          <v-text-field v-model="password" type="password" autocomplete="off"
label="Действующий пароль" />
          <v-text-field
            v-model="newPassword"
            type="password"
            label="Новый пароль"
            autocomplete="off"
            :errorMessages="getNewPasswordErrors()"
            @update:model-value="v$.newPassword.$touch()"
            @blur="v$.newPassword.$touch()"
          />
          <v-text-field
            v-model="confirmPassword"
            type="password"
            label="Подтвердите новый пароль"
            autocomplete="off"
            :errorMessages="getConfirmPasswordErrors()"
            @update:model-value="v$.confirmPassword.$touch()"
            @blur="v$.confirmPassword.$touch()"
          />
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="cancel">Отмена</v-btn>

        <v-btn :disabled="v$.$invalid" color="primary" variant="text" @click="saveHandler">Agree</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import useVuelidate from '@vuelidate/core'
import { required, minLength, sameAs } from '@vuelidate/validators'
import { UserService } from '@/shared/services'

export default {
  name: 'ChangePasswordDialog',
  props: {
    dialog: Boolean,
  },
  setup(props, { emit }) {
    const store = useStore()

    // Form state
    const password = ref('')
    const newPassword = ref('')
    const confirmPassword = ref('')

    // Vuelidate rules
    const rules = {
      password: { required },
      newPassword: { required, minLength: minLength(6) },
      confirmPassword: {
        required,
        sameAs: sameAs(() => newPassword.value),
      },
    }

    const v$ = useVuelidate(rules, { password, newPassword, confirmPassword })

    // Methods
    const getNewPasswordErrors = () => {
      const errors = []
      if (!v$.value.newPassword.$dirty) return errors
      !v$.value.newPassword.minLength && errors.push('Слишком короткий пароль')
      !v$.value.newPassword.required && errors.push('Поле не может быть пустым')
      return errors
    }

    const getConfirmPasswordErrors = () => {
      const errors = []
      if (!v$.value.confirmPassword.$dirty) return errors
      !v$.value.confirmPassword.required && errors.push('Поле не может быть пустым')
      !v$.value.confirmPassword.sameAs && errors.push('Пароли не совпадают')
      return errors
    }

    const cancel = () => {
      password.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      v$.value.$reset()
      emit('cancel')
    }

    const saveHandler = async () => {
      const body = {
        oldPassword: password.value,
        newPassword: newPassword.value,
      }
      try {
        await UserService.changePassword(body)
        v$.value.$reset()
        store.commit('setError', 'Пароль успешно обновлен')
        cancel()
      } catch (e) {
        store.commit('setError', e)
      }
    }

    return {
      password,
      newPassword,
      confirmPassword,
      v$,
      getNewPasswordErrors,
      getConfirmPasswordErrors,
      cancel,
      saveHandler,
    }
  },
}
</script>
<style></style>
