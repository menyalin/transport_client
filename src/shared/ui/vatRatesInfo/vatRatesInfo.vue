<template>
  <div class="wrapper">
    <div v-if="showTitle" class="text-h6">НДС:</div>
    <v-btn @click="addHandler" small color="primary">Добавить</v-btn>
    <v-data-table
      :headers="HEADERS"
      :items="preparedItems"
      hide-default-footer
      height="300px"
      dense
      fixed-header
      :itemsPerPage="-1"
      @dblclick:row="dblClickRowHandler"
    />

    <v-dialog v-model="dialog" max-width="600">
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
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance, nextTick } from 'vue'
import { HEADERS } from './tableHeaders'
import VatRatesInfoForm from './vatRatesInfoForm.vue'

export default {
  name: 'VatRatesInfo',

  components: {
    VatRatesInfoForm,
  },

  model: {
    prop: 'items',
    event: 'change',
  },

  props: {
    showTitle: {
      type: Boolean,
      default: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['change'],

  setup(props, ctx) {
    const { proxy } = getCurrentInstance()
    const editedItem = ref(null)
    const editingItemIndex = ref(null)
    const dialog = ref(false)

    const formTitle = computed(() => {
      return editedItem.value === null
        ? 'Новая ставка НДС'
        : 'Редактирование ставки НДС'
    })

    const preparedItems = computed(() => {
      return props.items
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
      // Копируем только нужные поля данных, без служебных
      editedItem.value = { ...item }
      // Находим индекс в исходном массиве props.items
      editingItemIndex.value = item.idx
      dialog.value = true
    }

    const removeHandler = async () => {
      const res = await proxy.$confirm(
        'Уверены, что хотите удалить эту ставку НДС?'
      )
      if (!res) return

      const tmpRes = [...props.items]
      tmpRes.splice(editedItem.value.idx, 1)
      ctx.emit('change', [...tmpRes])
      closeAndResetItem()
    }

    const saveHandler = (val) => {
      const tmpRes = [...props.items]

      if (editedItem.value === null) {
        // При добавлении новой записи проверяем последнюю запись с незаполненной датой окончания
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

          tmpRes[
            tmpRes.findIndex((item) => item === lastItemWithoutEnd)
          ].endPeriod = dayBefore.toISOString()
        }

        tmpRes.push(val)
      } else {
        tmpRes.splice(editedItem.value.idx, 1, { ...val })
      }

      ctx.emit('change', tmpRes)
      closeAndResetItem()
    }

    return {
      preparedItems,
      formTitle,
      editedItem,
      editingItemIndex,
      dialog,
      addHandler,
      dblClickRowHandler,
      removeHandler,
      saveHandler,
      cancelHandler,
      HEADERS,
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
