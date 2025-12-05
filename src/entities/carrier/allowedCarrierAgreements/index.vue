<template>
  <div class="wrapper">
    <div class="text-h6">Доступные соглашения:</div>
    <v-btn size="small" color="primary" @click="addAgreementHandler">Добавить</v-btn>
    <v-data-table
      :headers="headers"
      :items="preparedAgreements"
      hideDefaultFooter
      height="300px"
     
      fixedHeader
      :itemsPerPage="-1"
      selected
      @dblclick:row="dblClickRowHandler"
    />
    <v-dialog :modelValue="dialog" maxWidth="800" @update:model-value="$emit('update:dialog', $event)">
      <AllowedAgreementForm
        :title="formTitle"
        :item="editedItem"
        :agreementItems="agreementItems"
        :showRemoveBtn="Boolean(editedItem)"
        @remove="removeHandler"
        @save="saveHandler"
        @cancel="cancelHandler"
      />
    </v-dialog>
  </div>
</template>
<script>
import { ref, computed, getCurrentInstance, nextTick } from 'vue'
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
    const { proxy } = getCurrentInstance()
    const editedItem = ref(null)
    const dialog = ref(false)
    const agreementItemsMap = computed(() => {
      return new Map(props.agreementItems.map(i => [i._id, i]))
    })
    const formTitle = computed(() => {
      return editedItem.value === null ? 'Новое соглашение' : 'Редактирование соглашения'
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
      nextTick(() => {
        editedItem.value = null
        dialog.value = false
      })
    }

    const addAgreementHandler = () => {
      nextTick(() => {
        editedItem.value = null
        dialog.value = true
      })
    }

    const cancelHandler = () => {
      closeAndResetItem()
    }

    const dblClickRowHandler = (_, { item }) => {
      editedItem.value = { ...item }
      dialog.value = true
    }
    const removeHandler = async () => {
      const res = await proxy.$confirm('Вы уверены?')
      if (!res) return

      const tmpRes = [...props.agreements]
      tmpRes.splice(editedItem.value.idx, 1)
      ctx.emit('change', [...tmpRes])
      closeAndResetItem()
    }

    const saveHandler = val => {
      const tmpRes = [...props.agreements]
      if (editedItem.value === null) {
        tmpRes.push(val) // Добавление нового соглашения
      } else {
        tmpRes.splice(editedItem.value.idx, 1, { ...val }) // Редактирование существующего соглашения
      }
      ctx.emit('change', tmpRes)
      closeAndResetItem()
    }

    return {
      preparedAgreements,
      formTitle,
      editedItem,
      dialog,
      addAgreementHandler,
      dblClickRowHandler,
      removeHandler,
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
