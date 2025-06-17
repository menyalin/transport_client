<template>
  <v-card>
    <v-card-title>
      {{ item._id ? 'Редактировать площадку' : 'Новая площадка' }}
    </v-card-title>
    <v-card-text>
      <form id="form-wrapper">
        <v-text-field
          v-model="state.title"
          label="Название площадки"
          dense
          outlined
          @blur="v$.title.$touch"
          :errorMessages="titleErrorMessages"
          :style="{ maxWidth: '600px' }"
        />
        <v-autocomplete
          v-model="state.address"
          dense
          label="Адрес площадки"
          :items="addressItems"
          outlined
          auto-select-first
          clearable
          @blur="v$.address.$touch"
          :errorMessages="addressErrorMessages"
        />
        <v-autocomplete
          v-model="state.allowedLoadingPoints"
          label="Разрешенные пункты погрузки"
          :items="addressItems"
          outlined
          multiple
          auto-select-first
          clearable
          dense
          @blur="v$.allowedLoadingPoints.$touch"
        />
        <v-text-field
          v-model="state.contacts"
          label="Контакты"
          dense
          outlined
          @blur="v$.contacts.$touch"
        />

        <v-text-field
          v-model="v$.note.$model"
          label="Примечание"
          dense
          outlined
          @blur="v$.note.$touch"
        />
        <v-checkbox
          v-model="state.resctrictAddresses"
          :disabled="disabledResctrictAddresses"
          hint="Можно редактировать только при пустых полях с адресами"
          :persistentHint="disabledResctrictAddresses"
          label="Скрывать адреса других партнеров"
          color="primary"
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
import store from '@/store'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { computed, ref, watch } from 'vue'

export default {
  name: 'PlaceForTransferDocsForm',
  props: {
    item: Object,
    partnerId: { type: String, required: true },
  },
  setup(props, ctx) {
    const state = ref({})
    const disabledResctrictAddresses = computed(() =>
      Boolean(state.value.address || state.value.allowedLoadingPoints?.length)
    )
    const initialState = {
      title: null,
      address: null,
      allowedLoadingPoints: [],
      contacts: null,
      note: null,
      resctrictAddresses: true,
    }

    function setState(state) {
      return state ? state : initialState
    }

    watch(
      () => props.item,
      (value) => {
        state.value = setState(value)
      },
      { immediate: true, deep: true }
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

    const addressItems = computed(() => {
      if (!props.partnerId) return []
      return store.getters.addressesForAutocomplete.filter((i) => {
        if (state.value.resctrictAddresses) return i.partner === props.partnerId
        else return true
      })
    })

    function clear() {
      resetForm()
    }

    function resetForm() {
      v$.value.$reset()
      state.value = setState()
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
      disabledResctrictAddresses,
      addressItems,
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
