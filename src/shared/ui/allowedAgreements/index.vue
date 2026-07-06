<template>
  <CardSection title="Доступные соглашения">
    <template #actions>
      <v-btn @click="addAgreementHandler" size="small" color="primary">Добавить</v-btn>
    </template>
    <template #default>
      <v-data-table
        :headers="headers"
        :items="preparedAgreements"
        hide-default-footer
        height="300px"
        fixed-header
        :itemsPerPage="-1"
        selected
        @dblclick:row="dblClickRowHandler"
      />
      <v-dialog :model-value="dialog" @update:model-value="showDialog = $event" max-width="800">
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
    </template>
  </CardSection>

  <div class="wrapper" />
</template>
<script setup>
import { ref, computed, nextTick } from 'vue'
import { HEADERS as headers } from './tableHeaders'
import AllowedAgreementForm from './allowedAgreementForm.vue'
import { CardSection } from '@/shared/ui'

defineOptions({ name: 'AllowedCarrierAgreements' })

const agreements = defineModel({ type: Array, default: () => [] })

const props = defineProps({
  agreementItems: Array,
})

const editedItem = ref(null)
const dialog = ref(false)
const agreementItemsMap = computed(() => {
  return new Map(props.agreementItems.map((i) => [i._id, i]))
})
const formTitle = computed(() => {
  return editedItem.value === null ? 'Новое соглашение' : 'Редактирование соглашения'
})
const preparedAgreements = computed(() => {
  return agreements.value.map((i, idx) => ({
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
  const res = confirm('Вы уверены?')
  if (!res) return

  const tmpRes = [...agreements.value]
  tmpRes.splice(editedItem.value.idx, 1)
  agreements.value = [...tmpRes]
  closeAndResetItem()
}

const saveHandler = (val) => {
  const tmpRes = [...agreements.value]
  if (editedItem.value === null) {
    tmpRes.push(val)
  } else {
    tmpRes.splice(editedItem.value.idx, 1, { ...val })
  }
  agreements.value = tmpRes
  closeAndResetItem()
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
