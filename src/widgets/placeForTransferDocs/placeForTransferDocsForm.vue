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
import { computed, nextTick, ref } from 'vue'
import { AddressAutocomplete } from '@/entities'

/*
   {
        _id: 1,
        title: 'БИКОМ',
        address: '61b759ad30a28a9af8a7b0c4',
        allowedLoadingPoints: [
          '61b759ad30a28a9af8a7b0c4',
          '61e7f19c87579a0c2af03fe5',
          '61b7508c30a28a9af8a7b034',
        ],
        contacts:
          'Строка с контактной информацией. можно выводить в печатную форму',
        note: 'Комментарий к площадке',
      },

 */

export default {
  name: 'PlaceForTransferDocsForm',
  components: {
    AddressAutocomplete,
  },
  props: {
    partnerId: { type: String, required: true },
  },
  setup(_props, ctx) {
    function setState(state) {
      if (!state)
        return {
          title: null,
          address: null,
          allowedLoadingPoints: [],
          contacts: null,
          note: null,
        }
    }

    let state = ref(setState())

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

    function resetForm() {
      v$.value.$reset()
      nextTick(() => {
        state.value = setState()
      })
    }

    function submit() {
      console.log('submit form')
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
