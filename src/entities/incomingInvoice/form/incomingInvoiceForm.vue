<template>
  <div class="wrapper">
    <buttons-panel
      panelType="form"
      showSaveBtn
      @cancel="cancelHandler"
      :disabledSubmit="invalidForm"
      @submit="submitHandler"
      @save="saveHandler"
    />
    {{ state }}
    <div id="form">
      <div class="fields-row">
        <v-text-field
          label="Номер"
          v-model.trim="state.number"
          dense
          outlined
          :style="{ maxWidth: '250px' }"
        />
        <v-text-field
          label="Дата"
          v-model="state.date"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
          @paste="pasteDate"
        />
        <v-select
          label="Статус"
          v-model="state.status"
          :items="incomingInvoiceStatuses"
          dense
          outlined
          :style="{ maxWidth: '200px' }"
        />

        <v-autocomplete
          v-model="state.agreement"
          label="Соглашение"
          dense
          required
          item-value="_id"
          item-text="name"
          clearable
          outlined
          :items="agreementItems"
          :style="{ maxWidth: '300px' }"
        />
      </div>
      <div class="fields-row">
        <v-text-field
          label="Плановая дата оплаты"
          v-model="state.plannedPayDate"
          dense
          outlined
          type="date"
          :style="{ maxWidth: '250px' }"
          @paste="pasteDate"
        />
      </div>

      <v-alert v-if="disabledPickOrders || needSave" type="info" text>
        Для подбора рейсов требуется сохранение документа
      </v-alert>
      <v-btn
        color="primary"
        @click="pickOrdersHandler"
        class="ma-3"
        :disabled="disabledPickOrders || needSave || invalidForm"
      >
        Подобрать рейсы
      </v-btn>
      <v-text-field
        v-model="state.note"
        label="Примечание"
        dense
        outlined
        @blur="v$.note.$touch"
        hide-details
      />
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'
import { incomingInvoiceStatuses } from '../config.js'
import { useForm } from './useForm.js'
import { usePasteDateInput } from '@/modules/common/hooks/usePasteDateInput'
import { ButtonsPanel, DownloadDocTemplateMenu } from '@/shared/ui'
export default {
  name: 'IncomingInvoiceForm',
  components: {
    ButtonsPanel,
    DownloadDocTemplateMenu,
  },
  props: {
    disabledPickOrders: Boolean,
    agreementItems: Array,
    readonly: Boolean,
    item: Object,
  },
  setup(props, ctx) {
    const { pasteDate } = usePasteDateInput()

    const needSave = computed(() => false) // TODO: fix it

    function pickOrdersHandler() {
      ctx.emit('pickOrders')
    }

    const {
      state,
      v$,
      submitHandler,
      cancelHandler,
      saveHandler,
      statusItems,
      invalidForm,
    } = useForm(props, ctx)
    return {
      state,
      v$,
      submitHandler,
      cancelHandler,
      saveHandler,
      statusItems,
      pasteDate,
      invalidForm,
      incomingInvoiceStatuses,
      needSave,
      pickOrdersHandler,
    }
  },
}
</script>
<style scoped>
#form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px;
}
.fields-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 5px;
}
</style>
