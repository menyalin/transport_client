<template>
  <v-card>
    <form>
      <buttons-panel
        panel-type="form"
        :disabled-submit="$v.form.$invalid"
        @cancel="cancel"
        @submit="submit"
      />
      <v-card-text>
        <v-text-field
          v-model.trim="$v.form.name.$model"
          type="text"
          label="Сокращенное название"
          :error-messages="nameErrors"
          @input="$v.form.name.$touch()"
          @blur="$v.form.name.$touch()"
        />
        <v-text-field
          v-model.trim="$v.form.fullName.$model"
          type="text"
          label="Полное название"
          :error-messages="fullNameErrors"
          @input="$v.form.fullName.$touch()"
          @blur="$v.form.fullName.$touch()"
        />
        <v-text-field
          v-model="form.inn"
          type="text"
          label="ИНН"
          :error-messages="innErrors"
          @input="delayTouch($v.form.inn)"
          @blur="$v.form.inn.$touch()"
        />
        <v-checkbox
          v-model="form.hasOwnDirectories"
          label="У компании есть свои справочники"
        />
        <v-alert type="info" outlined>
          <p>ИНН - Должен быть уникален</p>
          <p>
            Пользователь может работать со справочниками только одной компании.
            Если компания не основная, рекомендуем отключить опцию
          </p>
        </v-alert>
      </v-card-text>
    </form>
  </v-card>
</template>
<script>
import { required } from 'vuelidate/lib/validators'
import { ButtonsPanel } from '@/shared/ui'
import { mapActions } from 'vuex'
const touchMap = new WeakMap()

export default {
  name: 'CompanyForm',
  components: {
    ButtonsPanel,
  },
  data() {
    return {
      form: {
        name: '',
        fullName: '',
        inn: '',
        hasOwnDirectories: true,
      },
    }
  },
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.form.name.$dirty) return errors
      !this.$v.form.name.required &&
        errors.push('Название не может быть пустым')
      return errors
    },
    fullNameErrors() {
      const errors = []
      if (!this.$v.form.fullName.$dirty) return errors
      !this.$v.form.fullName.required &&
        errors.push('Полное название не может быть пустым')
      return errors
    },
    innErrors() {
      const errors = []
      if (!this.$v.form.inn.$dirty) return errors
      !this.$v.form.inn.required && errors.push('ИНН не может быть пустым')
      !this.$v.form.inn.existInn &&
        errors.push('ИНН уже зарегистрирован в системе')
      return errors
    },
  },
  methods: {
    ...mapActions(['isExistInn']),
    cancel() {
      this.$emit('cancel')
    },
    submit() {
      this.$emit('submit', Object.assign({}, this.$v.form.$model))
    },
    delayTouch($v) {
      $v.$reset()
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v))
      }
      touchMap.set($v, setTimeout($v.$touch, 500))
    },
  },
  validations: {
    form: {
      name: { required },
      fullName: { required },
      inn: {
        required,
        existInn(val) {
          if (val === '') return true
          return new Promise((resolve) => {
            this.isExistInn(val)
              .then((res) => {
                resolve(!res)
              })
              .catch((e) => {
                this.$store.commit('setError', e)
              })
          })
        },
      },
    },
  },
}
</script>
<style></style>
