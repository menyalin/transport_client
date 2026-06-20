<template>
  <div>
    <div class="title-row">
      <BlockTitle>Доплата водителю</BlockTitle>
      <v-spacer />
      <v-btn v-if="!showDataRow && hasWritePermission" @click="add"> Добавить </v-btn>
    </div>
    <div v-if="showDataRow" class="data-row">
      <div><i>Сумма:</i> {{ new Intl.NumberFormat().format(value.sum) }}</div>
      <div :style="{ maxWidth: '340px' }"><i>Примечание:</i> {{ value.note }}</div>
      <div>
        <i>Отв:</i>
        <WorkerAutocomplete labelOnly v-model="value.worker" />
      </div>
      <v-btn v-if="hasWritePermission" icon size="small" @click="deletePayment">
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
          {{ tmpVal }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">Отмена</v-btn>
          <v-btn @click="setPayment" :disabled="!isValidForm">Добавить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { BlockTitle } from '@/entities/order'
import WorkerAutocomplete from '@/modules/common/components/workerAutocomplete/index.vue'
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'

defineOptions({ name: 'PaymentToDriver' })

const value = defineModel()

const store = useStore()

const hasWritePermission = computed(() => store.getters.hasPermission('order:writePaymentToDriver'))

const initialState = { sum: 0, note: null, worker: null }
const tmpVal = ref(initialState)
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
