<template>
  <v-dialog :model-value="dialog" max-width="800" persistent>
    <v-card>
      <v-card-title class="text-headline-medium">{{ dialogTitle }}</v-card-title>
      <form @submit.prevent="submitHandler">
        <v-card-text class="form-wrapper">
          <v-autocomplete
            label="Клиент"
            v-model="state.client"
            :items="clientItems"
            item-value="_id"
            item-title="name"
          />

          <v-autocomplete
            label="Соглашение"
            v-model="state.agreement"
            :items="agreements"
            item-value="_id"
            item-title="name"
          />
          <div class="row-sum">
            <v-text-field
              label="Сумма"
              :disabled="sumFieldIsDisabled"
              v-model.number="state.sum"
              :style="{ maxWidth: '200px' }"
            />
            <v-checkbox
              label="Сумма с НДС"
              :disabled="vatCheckboxIsDisabled"
              v-model="state.sumWithVAT"
            />
          </div>
          <v-text-field label="Примечание" v-model.trim="state.note" />
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

<script setup>
import { computed } from 'vue'
import { usePaymentPartForm } from './model/usePaymentPartForm'

defineOptions({ name: 'PaymentPartsDialog' })

const props = defineProps({
  routeDate: { type: String, required: true },
  dialog: { type: Boolean, default: true },
})

const emit = defineEmits(['close'])

const dialogTitle = computed(() => 'Добавить сумму для частичной оплаты')

function closeDialog() {
  emit('close')
}

const {
  state,
  clientItems,
  agreements,
  vatCheckboxIsDisabled,
  sumFieldIsDisabled,
  submitHandler,
  invalidForm,
} = usePaymentPartForm({ routeDate: props.routeDate }, { emit })
</script>

<style scoped>
.row-sum {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: flex-start;
}
</style>
