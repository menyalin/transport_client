<template>
  <CardSection :title="showTitle ? 'НДС' : null">
    <template #actions>
      <v-btn @click="addHandler">Добавить</v-btn>
    </template>
    <template #default>
      <v-data-table
        :headers="HEADERS"
        :items="preparedItems"
        hide-default-footer
        height="300px"
        fixed-header
        :itemsPerPage="-1"
        @dblclick:row="dblClickRowHandler"
      />

      <v-dialog :model-value="dialog" @update:model-value="showDialog = $event" max-width="600">
        <VatRatesInfoForm
          :title="formTitle"
          :item="editedItem"
          :editingItemIndex="editingItemIndex"
          :existingItems="items"
          :showRemoveBtn="Boolean(editedItem)"
          @remove="removeHandler"
          @save="saveHandler"
          @cancel="cancelHandler"
        />
      </v-dialog>
    </template>
  </CardSection>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { HEADERS } from './tableHeaders'
import VatRatesInfoForm from './vatRatesInfoForm.vue'
import { CardSection } from '@/shared/ui'

defineOptions({ name: 'VatRatesInfo' })

const items = defineModel({ type: Array, default: () => [] })

defineProps({
  showTitle: {
    type: Boolean,
    default: true,
  },
})

const editedItem = ref(null)
const editingItemIndex = ref(null)
const dialog = ref(false)

const formTitle = computed(() => {
  return editedItem.value === null ? 'Новая ставка НДС' : 'Редактирование ставки НДС'
})

const preparedItems = computed(() => {
  return items.value
    .map((i, idx) => {
      const startDate = new Date(i.startPeriod)
      const startStr = startDate.toLocaleDateString()

      let periodDisplay
      if (!i.endPeriod) {
        periodDisplay = `${startStr} — ...`
      } else {
        const endDate = new Date(i.endPeriod)
        const endStr = endDate.toLocaleDateString()
        periodDisplay = `${startStr} — ${endStr}`
      }

      return {
        ...i,
        idx,
        vatRateDisplay: `${i.vatRate}%`,
        periodDisplay,
        noteDisplay: i.note || '-',
      }
    })
    .sort((a, b) => {
      const dateA = new Date(a.startPeriod)
      const dateB = new Date(b.startPeriod)
      return dateA - dateB
    })
})

const closeAndResetItem = () => {
  editedItem.value = null
  editingItemIndex.value = null

  nextTick(() => {
    dialog.value = false
  })
}

const addHandler = () => {
  editedItem.value = null
  editingItemIndex.value = null
  nextTick(() => {
    dialog.value = true
  })
}

const cancelHandler = () => {
  closeAndResetItem()
}

const dblClickRowHandler = (_, { item }) => {
  editedItem.value = { ...item }
  editingItemIndex.value = item.idx
  dialog.value = true
}

const removeHandler = async () => {
  const res = confirm('Уверены, что хотите удалить эту ставку НДС?')
  if (!res) return

  const tmpRes = [...items.value]
  tmpRes.splice(editedItem.value.idx, 1)
  items.value = [...tmpRes]
  closeAndResetItem()
}

const saveHandler = (val) => {
  const tmpRes = [...items.value]

  if (editedItem.value === null) {
    const sortedItems = tmpRes.sort((a, b) => {
      const dateA = new Date(a.startPeriod)
      const dateB = new Date(b.startPeriod)
      return dateA - dateB
    })

    const lastItemWithoutEnd = sortedItems
      .filter((item) => !item.endPeriod)
      .sort((a, b) => {
        const dateA = new Date(a.startPeriod)
        const dateB = new Date(b.startPeriod)
        return dateB - dateA
      })[0]

    if (lastItemWithoutEnd && val.startPeriod) {
      const newStartDate = new Date(val.startPeriod)
      const dayBefore = new Date(newStartDate)
      dayBefore.setDate(dayBefore.getDate() - 1)

      tmpRes[tmpRes.findIndex((item) => item === lastItemWithoutEnd)].endPeriod =
        dayBefore.toISOString()
    }

    tmpRes.push(val)
  } else {
    tmpRes.splice(editedItem.value.idx, 1, { ...val })
  }

  items.value = tmpRes
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
