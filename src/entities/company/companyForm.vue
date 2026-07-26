<template>
  <v-card>
    <form>
      <ButtonsPanel
        panel-type="form"
        :disabled-submit="v.form.$invalid"
        @cancel="cancel"
        @submit="submit"
      />
      <v-card-text>
        <v-text-field
          v-model.trim="form.name"
          type="text"
          label="Сокращенное название"
          :error-messages="nameErrors"
          @update:model-value="v.form.name.$touch()"
          @blur="v.form.name.$touch()"
        />
        <v-text-field
          v-model.trim="form.fullName"
          type="text"
          label="Полное название"
          :error-messages="fullNameErrors"
          @update:model-value="v.form.fullName.$touch()"
          @blur="v.form.fullName.$touch()"
        />
        <v-text-field
          v-model="form.inn"
          type="text"
          label="ИНН"
          :error-messages="innErrors"
          @update:model-value="delayTouch(v.value.form.inn)"
          @blur="v.form.inn.$touch()"
        />
        <v-checkbox v-model="form.hasOwnDirectories" label="У компании есть свои справочники" />
        <v-alert type="info">
          <p>ИНН - Должен быть уникален</p>
          <p>
            Пользователь может работать со справочниками только одной компании. Если компания не
            основная, рекомендуем отключить опцию
          </p>
        </v-alert>
      </v-card-text>
    </form>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { ButtonsPanel } from '@/shared/ui'

const emit = defineEmits(['submit', 'cancel'])

const store = useStore()

const form = ref({
  name: '',
  fullName: '',
  inn: '',
  hasOwnDirectories: true,
})

const touchMap = new WeakMap()

const rules = {
  form: {
    name: { required },
    fullName: { required },
    inn: {
      required,
      existInn: (val) => {
        if (val === '') return true
        return new Promise((resolve) => {
          store
            .dispatch('isExistInn', val)
            .then((res) => {
              resolve(!res)
            })
            .catch((e) => {
              store.commit('setError', e)
            })
        })
      },
    },
  },
}

const v = useVuelidate(rules, form)

const nameErrors = computed(() => {
  const errors = []
  if (!v.value.form.name.$dirty) return errors
  !v.value.form.name.required && errors.push('Название не может быть пустым')
  return errors
})

const fullNameErrors = computed(() => {
  const errors = []
  if (!v.value.form.fullName.$dirty) return errors
  !v.value.form.fullName.required && errors.push('Полное название не может быть пустым')
  return errors
})

const innErrors = computed(() => {
  const errors = []
  if (!v.value.form.inn.$dirty) return errors
  !v.value.form.inn.required && errors.push('ИНН не может быть пустым')
  !v.value.form.inn.existInn && errors.push('ИНН уже зарегистрирован в системе')
  return errors
})

const cancel = () => {
  emit('cancel')
}

const submit = () => {
  emit('submit', { ...form.value })
}

const delayTouch = (vField) => {
  vField.$reset()
  if (touchMap.has(vField)) {
    clearTimeout(touchMap.get(vField))
  }
  touchMap.set(vField, setTimeout(vField.$touch, 500))
}
</script>
<style></style>
