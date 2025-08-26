<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-autocomplete
        v-model="state.agreement"
        label="Соглашение"
        dense
        :items="agreementItems"
        item-text="name"
        item-value="_id"
        no-data-text="Соглашения отсутствуют"
      />
      <div class="dates-row">
        <DateTimeInput
          v-model="state.startDate"
          label="Дата начала"
          :style="{ maxWidth: '250px' }"
        />
        <DateTimeInput
          v-model="state.endDate"
          label="Дата окончания"
          :style="{ maxWidth: '250px' }"
        />
      </div>

      <v-text-field v-model="state.note" label="Примечание" hide-details />
    </v-card-text>
    <v-card-actions>
      <v-btn v-if="showRemoveBtn" @click="remove" color="error">Удалить</v-btn>
      <v-spacer />
      <v-btn @click="cancel">Отмена</v-btn>
      <v-btn color="primary" @click="save" :disabled="invalidForm">
        Сохранить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ref } from 'vue'
import { DateTimeInput } from '@/shared/ui'
import { computed } from 'vue'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { watch } from 'vue'

export default {
  name: 'AllowedAgreementForm',
  components: { DateTimeInput },
  props: {
    item: Object,
    title: String,
    agreementItems: Array,
    showRemoveBtn: Boolean,
  },

  setup(props, ctx) {
    const initialState = {
      agreement: null,
      startDate: null,
      endDate: null,
      note: null,
    }

    const state = ref(initialState)

    const rules = computed(() => ({
      agreement: { required },
      startDate: { required },
      endDate: {},
      note: {},
    }))

    const v$ = useVuelidate(rules, state, { $scope: false })

    const invalidForm = computed(() => v$.value.$invalid)
    const resetState = () => {
      state.value = { ...initialState }
    }
    const cancel = () => {
      resetState()
      ctx.emit('cancel')
    }
    const save = () => {
      ctx.emit('save', { ...state.value })
      resetState()
    }

    const remove = () => {
      if (!props.showRemoveBtn) return
      ctx.emit('remove')
    }

    watch(
      () => props.item,
      (val) => {
        state.value = val ? { ...val } : { ...initialState }
      },
      { deep: true, immediate: true }
    )
    return { state, save, cancel, remove, invalidForm }
  },
}
</script>
<style scoped>
.dates-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
