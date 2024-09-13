<script setup lang="ts">
//@ts-nocheck
import { defineProps, defineEmits, ref, reactive, computed } from 'vue'

import { BlockTitle } from '@/entities/order'
import AppWorkerAutocomplete from '@/modules/common/components/workerAutocomplete/index.vue'
import store from '@/store'

const props = defineProps<{
  value: Record<string, unknown>
}>()

const emit = defineEmits<{
  (e: 'change', value: Record<string, unknown>): void
}>()

const hasWritePermission = computed(() => {
  return store.getters.hasPermission('order:writePaymentToDriver')
})

const tmpVal = reactive({
  sum: 0,
  note: null,
  worker: null,
})

const dialog = ref(false)

function add() {
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

function setPayment() {
  if (isValidForm.value) emit('change', tmpVal)
  dialog.value = false
}

function deletePayment() {
  emit('change', {})
}

const showDataRow = computed(() => {
  return !!props.value.sum && (props.value?.sum as number) > 0
})

const isValidForm = computed(() => {
  const keys = Object.keys({ ...tmpVal })
  return !keys.map((key) => !!tmpVal[key]).includes(false)
})
</script>

<template>
  <div>
    <div class="title-row">
      <BlockTitle>Доплата водителю</BlockTitle>
      <v-btn
        v-if="!showDataRow && hasWritePermission"
        small
        outlined
        color="primary"
        @click="add"
      >
        Добавить
      </v-btn>
    </div>
    <div v-if="showDataRow" class="data-row">
      <div>
        <i>Сумма:</i> {{ new Intl.NumberFormat().format(value.sum as number) }}
      </div>
      <div :style="{ maxWidth: '340px' }">
        <i>Примечание:</i> {{ value.note }}
      </div>
      <div>
        <i>Отв:</i>
        <app-worker-autocomplete :value="value.worker" labelOnly />
      </div>
      <v-btn v-if="hasWritePermission" icon small @click="deletePayment">
        <v-icon color="red" small>mdi-delete</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>Доплата водителю </v-card-title>
        <v-card-text>
          <v-text-field
            v-model.number="tmpVal.sum"
            type="number"
            outlined
            dense
            label="Сумма"
            :style="{ maxWidth: '200px' }"
          />
          <v-text-field
            v-model.trim="tmpVal.note"
            outlined
            dense
            label="Примечание"
          />
          <app-worker-autocomplete
            v-model="tmpVal.worker"
            outlined
            dense
            label="Ответственный"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Отмена</v-btn>
          <v-btn :disabled="!isValidForm" @click="setPayment">Добавить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.title-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.data-row {
  display: flex;
  margin-top: 10px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
</style>
