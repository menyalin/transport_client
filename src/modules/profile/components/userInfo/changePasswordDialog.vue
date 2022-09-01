<template>
  <v-dialog
    v-model="dialog"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="text-h5">
        Изменение пароля
      </v-card-title>
      <v-card-text>
        <form @submit.prevent>  
          <v-text-field 
            v-model="$v.password.$model"
            type="password" 
            autocomplete="off"
            label="Действующий пароль" 
          />
          <v-text-field 
            v-model="$v.newPassword.$model"
            type="password" 
            label="Новый пароль"
            autocomplete="off"
            :error-messages="newPasswordErrors"
            @input="$v.newPassword.$touch()"
            @blur="$v.newPassword.$touch()"
          />
          <v-text-field 
            v-model="$v.confirmPassword.$model"
            type="password" 
            label="Новый пароль"
            autocomplete="off"
            :error-messages="confirmPasswordErrors"
            @input="$v.confirmPassword.$touch()"
            @blur="$v.confirmPassword.$touch()" 
          />
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="cancel"
        >
          Отмена
        </v-btn>

        <v-btn
          :disabled="$v.$invalid"
          color="primary"
          text
          @click="saveHandler"
        >
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import userService from '@/modules/auth/services/user.service'
import { required, minLength, sameAs } from 'vuelidate/lib/validators'
export default {
  name: 'ChangePasswordDialog',
  props: {
    dialog: Boolean
  },
  data() {
    return {
      password: '',
      newPassword: '',
      confirmPassword: '',
    }
  },
  computed: {
    newPasswordErrors() {
      const errors = []
      if (!this.$v.newPassword.$dirty) return errors
      !this.$v.newPassword.minLength && errors.push('Слишком короткий пароль')
      !this.$v.newPassword.required && errors.push('Поле не может быть пустым')
      return errors
    },
    confirmPasswordErrors() {
      const errors = []
      if (!this.$v.confirmPassword.$dirty) return errors
      !this.$v.confirmPassword.required &&
        errors.push('Поле не может быть пустым')
      !this.$v.confirmPassword.sameAs && errors.push('Пароли не совпадают')
      return errors
    },
  },
  validations: {
    password: { required },
    newPassword: { required, minLength: minLength(6) },
    confirmPassword: {
      required,
      sameAs: sameAs('newPassword'),
    },
  },
  methods: {
    cancel() {
      this.password = ''
      this.newPassword = ''
      this.confirmPassword = ''
      this.$emit('cancel')
    },
    async saveHandler() {
      const body = { 
        oldPassword: this.password, 
        newPassword : this.newPassword 
      }
      try {
        await userService.changePassword(body)
        this.$v.$reset()
        this.$store.commit('setError', 'Пароль успешно обновлен')
        this.cancel()
      } catch (e) {
        this.$store.commit('setError', e)
      }
    }
  }
}
</script>
<style>
  
</style>