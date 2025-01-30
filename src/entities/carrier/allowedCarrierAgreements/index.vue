<template>
  <div class="wrapper">
    <div class="text-h6">Доступные соглашения:</div>
    <v-btn @click="addAgreementHandler" small color="primary">Добавить</v-btn>
    <v-data-table
      :headers="headers"
      :items="preparedAgreements"
      hide-default-footer
      height="300px"
      dense
      fixed-header
      :itemsPerPage="-1"
      selected
      @dblclick:row="dblClickRowHandler"
    />
    <v-dialog v-model="dialog" max-width="800">
      <AllowedAgreementForm
        :title="formTitle"
        :item="editedItem"
        :agreementItems="agreementItems"
        @save="saveHandler"
        @cancel="cancelHandler"
      />
    </v-dialog>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { BorderedBlock } from '@/shared/ui'
import { HEADERS } from './tableHeaders'
import AllowedAgreementForm from './allowedAgreementForm.vue'

export default {
  name: 'AllowedCarrierAgreements',
  components: {
    BorderedBlock,
    AllowedAgreementForm,
  },
  model: {
    prop: 'agreements',
    event: 'change',
  },
  props: {
    agreements: { type: Array, default: () => [] }, // разрешенные соглашения для перевозчика
    agreementItems: Array, // все соглашения с перевозчика - для селекта
  },
  setup(props, ctx) {
    const editedItem = ref(null)
    const dialog = ref(false)
    const agreementItemsMap = computed(() => {
      return new Map(props.agreementItems.map((i) => [i._id, i]))
    })
    const formTitle = computed(() => {
      return editedItem.value === null
        ? 'Новое соглашение'
        : 'Редактирование соглашения'
    })
    const preparedAgreements = computed(() => {
      return props.agreements.map((i, idx) => ({
        ...i,
        idx,
        agreementName: agreementItemsMap.value.get(i.agreement)?.name ?? '',
        startDateStr: new Date(i.startDate).toLocaleDateString(),
        endDateStr: i.endDate ? new Date(i.endDate).toLocaleDateString() : null,
      }))
    })

    const closeAndResetItem = () => {
      editedItem.value = null
      dialog.value = false
    }

    const addAgreementHandler = () => {
      dialog.value = true
    }

    const cancelHandler = () => {
      closeAndResetItem()
    }

    const dblClickRowHandler = (_, { item }) => {
      editedItem.value = { ...item }
      dialog.value = true
    }

    const saveHandler = (val) => {
      const tmpRes = [...props.agreements]
      if (editedItem.value === null) {
        tmpRes.push(val) // Добавление нового соглашения
      } else {
        tmpRes.splice(editedItem.value.idx, 1, { ...val }) // Редактирование существующего соглашения
      }
      ctx.emit('change', [...tmpRes])
      closeAndResetItem()
    }

    return {
      preparedAgreements,
      formTitle,
      editedItem,
      dialog,
      addAgreementHandler,
      dblClickRowHandler,
      saveHandler,
      cancelHandler,
      headers: HEADERS,
    }
  },
}
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  padding: 15px;
}
</style>
