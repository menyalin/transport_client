<template>
  <v-card>
    <v-card-title>Площадка приема документов</v-card-title>
    <v-card-text>
      <form id="form-wrapper">
        <v-text-field
          v-model="state.title"
          label="Название площадки"
          outlined
          @blur="v$.title.$touch"
          :errorMessages="titleErrorMessages"
          :style="{ maxWidth: '600px' }"
        />
        <address-autocomplete
          v-model="state.address"
          label="Адрес площадки"
          outlined
          :partnerId="partnerId"
          @blur="v$.address.$touch"
          :errorMessages="addressErrorMessages"
        />
        <address-autocomplete
          v-model="state.allowedLoadingPoints"
          label="Разрешенные пункты погрузки"
          outlined
          multiple
          :partnerId="partnerId"
          @blur="v$.allowedLoadingPoints.$touch"
        />
        <v-text-field
          v-model="state.contacts"
          label="Контакты"
          outlined
          @blur="v$.contacts.$touch"
        />
        <v-text-field
          v-model="v$.note.$model"
          label="Примечание"
          outlined
          @blur="v$.note.$touch"
        />
      </form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="cancel">Отмена</v-btn>
      <v-btn color="primary" @click="submit" :disabled="invalidForm">
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, nextTick, ref, watch } from 'vue'
import { AddressAutocomplete } from '@/entities/address'

export default {
  name: 'PlaceForTransferDocsForm',
  components: {
    AddressAutocomplete,
  },
  props: {
    item: Object,
    partnerId: { type: String, required: true },
  },
  setup(props, ctx) {
    const state = ref({})
    const initialState = {
      title: null,
      address: null,
      allowedLoadingPoints: [],
      contacts: null,
      note: null,
    }

    function setState(state) {
      return state ? state : initialState
    }

    const itemComputed = computed(() => {
      return props.item
    })
    watch(
      itemComputed,
      () => {
        state.value = setState(itemComputed.value)
      },
      { immediate: true }
    )

    const rules = {
      title: { required },
      address: { required },
      allowedLoadingPoints: {},
      contacts: {},
      note: {},
    }

    const v$ = useVuelidate(rules, state)

    const titleErrorMessages = computed(() => {
      const err = []
      const titleField = v$.value.title
      if (!titleField.$invalid) return err

      titleField.$dirty &&
        titleField.required.$invalid &&
        err.push('Название не может быть пустым')
      return err
    })

    const addressErrorMessages = computed(() => {
      const err = []
      const field = v$.value.address
      if (!field.$invalid) return err

      field.$dirty &&
        field.required.$invalid &&
        err.push('Адрес площадки не может быть пустым')
      return err
    })

    const invalidForm = computed(() => v$.value.$invalid)

    function clear() {
      resetForm()
    }

    function resetForm() {
      v$.value.$reset()
      nextTick(() => {
        state.value = setState()
      })
    }

    function submit() {
      ctx.emit('submit', state.value)
    }

    function cancel() {
      resetForm()
      ctx.emit('cancel')
    }

    return {
      v$,
      addressErrorMessages,
      titleErrorMessages,
      invalidForm,
      submit,
      cancel,
      state,
      clear,
    }
  },
}
</script>

<style scoped>
#form-wrapper {
  display: flex;
  flex-direction: column;
  padding: 20px;
}
</style>
