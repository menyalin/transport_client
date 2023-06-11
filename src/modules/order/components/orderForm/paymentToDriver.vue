<template>
  <div>
    <div class="title-row">
      <BlockTitle>Доплата водителю</BlockTitle>
      <v-btn
        v-if="!showDataRow && hasWritePermission"
        small
        text
        outlined
        color="primary"
        @click="add"
      >
        Добавить
      </v-btn>
    </div>
    <div v-if="showDataRow" class="data-row">
      <div><i>Сумма:</i> {{ new Intl.NumberFormat().format(value.sum) }}</div>
      <div :style="{ maxWidth: '340px' }">
        <i>Примечание:</i> {{ value.note }}
      </div>
      <div>
        <i>Отв:</i>
        <app-worker-autocomplete labelOnly v-model="value.worker" />
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
            type="number"
            v-model.number="tmpVal.sum"
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
          <v-btn @click="setPayment" :disabled="!isValidForm">Добавить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { BlockTitle } from '@/entities/order'
import AppWorkerAutocomplete from '@/modules/common/components/workerAutocomplete'
import { reactive, ref, computed } from 'vue'
import store from '@/store'

export default {
  name: 'PaymentToDriver',
  components: {
    BlockTitle,
    AppWorkerAutocomplete,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: Object,
  },
  setup(props, ctx) {
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
      if (isValidForm.value) ctx.emit('change', tmpVal)
      dialog.value = false
    }

    function deletePayment() {
      ctx.emit('change', {})
    }

    const showDataRow = computed(() => {
      return !!props.value.sum && props.value.sum > 0
    })

    const isValidForm = computed(() => {
      const keys = Object.keys({ ...tmpVal })
      return !keys.map((key) => !!tmpVal[key]).includes(false)
    })

    return {
      add,
      tmpVal,
      dialog,
      setPayment,
      closeDialog,
      isValidForm,
      deletePayment,
      showDataRow,
      hasWritePermission,
    }
  },
}
</script>
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
