<template>
  <v-dialog :model-value="dialog" max-width="800" persistent @update:model-value="closeDialog">
    <v-card>
      <v-card-title class="text-h5">{{ dialogTitle }}</v-card-title>
      <form @submit.prevent="submitHandler">
        <v-card-text class="form-wrapper">
          <v-autocomplete
            v-model="state.client"
            label="Клиент"
            variant="outlined"
            density="compact"
            :items="clientItems"
            item-value="_id"
            item-title="name"
          />

          <v-autocomplete
            v-model="state.agreement"
            label="Соглашение"
            variant="outlined"
            density="compact"
            :items="agreements"
            item-value="_id"
            item-title="name"
          />
          <div class="row-sum">
            <v-text-field
              v-model.number="state.sum"
              label="Сумма"
              variant="outlined"
              density="compact"
              :disabled="sumFieldIsDisabled"
              :style="{ maxWidth: '200px' }"
            />
            <v-checkbox
              v-model="state.sumWithVAT"
              label="Сумма с НДС"
              density="compact"
              :disabled="vatCheckboxIsDisabled"
            />
          </div>
          <v-text-field
            v-model.trim="state.note"
            label="Примечание"
            variant="outlined"
            density="compact"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="closeDialog"> Отмена </v-btn>
          <v-btn color="primary" variant="text" type="submit" :disabled="invalidForm">
            Добавить
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>
<script>
import { computed } from 'vue'
import { usePaymentPartForm } from './model/usePaymentPartForm'
export default {
  name: 'PaymentPartsDialog',
  props: {
    routeDate: { type: String, required: true },
    dialog: { type: Boolean, default: true },
  },
  setup(props, ctx) {
    const dialogTitle = computed(() => 'Добавить сумму для частичной оплаты')

    function closeDialog() {
      ctx.emit('close')
    }

    const {
      state,
      clientItems,
      agreements,
      vatCheckboxIsDisabled,
      sumFieldIsDisabled,
      submitHandler,
      invalidForm,
    } = usePaymentPartForm({ routeDate: props.routeDate }, ctx)

    return {
      dialogTitle,
      closeDialog,
      state,
      clientItems,
      agreements,
      vatCheckboxIsDisabled,
      sumFieldIsDisabled,
      invalidForm,
      submitHandler,
    }
  },
}
</script>
<style scoped>
.row-sum {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: flex-start;
}
</style>
