<template>
  <v-dialog :value="dialog" max-width="800" @input="closeDialog" persistent>
    <v-card>
      <v-card-title class="text-h5">{{ dialogTitle }}</v-card-title>
      <form @submit.prevent="submitHandler">
        <v-card-text class="form-wrapper">
          <v-autocomplete
            label="Клиент"
            outlined
            dense
            v-model="state.client"
            :items="clientItems"
            item-value="_id"
            item-text="name"
          />

          <v-autocomplete
            label="Соглашение"
            outlined
            dense
            v-model="state.agreement"
            :items="agreements"
            item-value="_id"
            item-text="name"
          />
          <div class="row-sum">
            <v-text-field
              label="Сумма"
              outlined
              dense
              :disabled="sumFieldIsDisabled"
              v-model.number="state.sum"
              :style="{ maxWidth: '200px' }"
            />
            <v-checkbox
              label="Сумма с НДС"
              dense
              :disabled="vatCheckboxIsDisabled"
              v-model="state.sumWithVAT"
            />
          </div>
          <v-text-field
            label="Примечание"
            outlined
            dense
            v-model.trim="state.note"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" text @click="closeDialog"> Отмена </v-btn>
          <v-btn color="primary" text type="submit" :disabled="invalidForm">
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
