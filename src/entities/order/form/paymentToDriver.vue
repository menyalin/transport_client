<template>
  <CardSection title="Доплата водителю">
    <template #header>
      <v-btn v-if="!showDataRow && hasWritePermission" @click="add" size="small"> Добавить </v-btn>
    </template>

    <div v-if="showDataRow" class="data-row">
      <div><i>Сумма:</i> {{ new Intl.NumberFormat().format(value.sum) }}</div>
      <div :style="{ maxWidth: '340px' }"><i>Примечание:</i> {{ value.note }}</div>
      <div v-if="value.worker">
        <i>Отв:</i>
        <AppAutocomplete
          label-only
          v-model="value.worker"
          :fetch-items="fetchWorkers"
          :fetch-by-id="fetchWorkerById"
        />
      </div>
      <v-btn v-if="hasWritePermission" icon size="small" @click="deletePayment" variant="text">
        <v-icon color="red" size="small">mdi-delete</v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title>Доплата водителю</v-card-title>
        <v-card-text>
          <v-text-field
            type="number"
            v-model.number="tmpVal.sum"
            label="Сумма"
            :style="{ maxWidth: '200px' }"
          />
          <v-text-field v-model.trim="tmpVal.note" label="Примечание" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Отмена</v-btn>
          <v-btn @click="setPayment" :disabled="!isValidForm">Добавить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </CardSection>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'

import AppAutocomplete from '@/shared/ui/AppAutocomplete/AppAutocomplete.vue'
import { WorkerService } from '@/shared/services'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { CardSection } from '@/shared/ui'

defineOptions({ name: 'PaymentToDriver' })

const value = defineModel({ type: Object })

const store = useStore()

const hasWritePermission = computed(() => store.getters.hasPermission('order:writePaymentToDriver'))

const initialState = { sum: 0, note: null, worker: null }
const tmpVal = ref(initialState)

async function fetchWorkers(query: string) {
  const items = (await WorkerService.getForAutocomplete({ searchStr: query })) || []
  return items.map((i: any) => ({ value: i._id, text: i.fullName || i.name }))
}

async function fetchWorkerById(id: string) {
  const items = (await WorkerService.getForAutocomplete({ id })) || []
  if (!items.length) return null
  const i = items[0]
  return { value: i._id, text: i.fullName || i.name }
}
const dialog = ref(false)

function add() {
  Object.assign(initialState)
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

const rules = computed(() => ({
  sum: { required },
  note: { required },
}))
const v$ = useVuelidate(rules, tmpVal)

const isValidForm = computed(() => !v$.value.$invalid)

function setPayment() {
  if (isValidForm.value) {
    value.value = { ...tmpVal.value }
  }
  dialog.value = false
}

function deletePayment() {
  value.value = {}
}

const showDataRow = computed(() => !!value.value?.sum && value.value.sum > 0)
</script>
<style scoped>
.title-row {
  display: flex;
  flex-direction: row;
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
