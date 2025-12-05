import { computed, getCurrentInstance, ref } from 'vue'

const dateFormatter = date => (date ? new Date(date).toLocaleString() : null)

const truckFormatter = (store, id) => store.getters.trucksMap.get(id)?.regNum ?? null

export const useTransportTableData = (props, ctx) => {
  const { proxy } = getCurrentInstance()
  const dialog = ref(false)
  const startDateFieldDisabled = ref(true)
  const editMode = ref(null)
  const editedItem = ref(null)
  const editableItemMinDate = ref(null)

  const tableData = computed(() => {
    return props.items.map((i, idx, arr) => ({
      ...i,
      startDateStr: dateFormatter(i?.startDate),
      endDateStr: dateFormatter(i?.endDate),
      truck: truckFormatter(proxy.$store, i?.truck),
      trailer: truckFormatter(proxy.$store, i?.trailer),
      allowEdit: props.crewEditable && idx === props.items.length - 1,
      allowDelete: props.crewEditable && idx === arr.length - 1 && idx > 0,
    }))
  })

  const allowAddTransportItems = computed(() => {
    return props.crewEditable
  })
  const readonlyStartDate = computed(() => {
    return !props.crewEditable || startDateFieldDisabled.value
  })
  const lastItem = computed(() => props.items[props.items.length - 1])

  const editLastItem = () => {
    editMode.value = 'edit'
    if (props.items.length === 1) editableItemMinDate.value = props.crewStartDate
    else {
      startDateFieldDisabled.value = false
      editableItemMinDate.value =
        props.items[props.items.length - 2]?.endDate ?? props.items[props.items.length - 2]?.startDate
    }
    editedItem.value = { ...lastItem.value }
    dialog.value = true
  }

  const addItemHandler = () => {
    editMode.value = 'create'

    startDateFieldDisabled.value = props.items.length === 0

    editableItemMinDate.value = lastItem.value?.endDate ?? lastItem.value?.startDate

    editedItem.value = {
      startDate: editableItemMinDate.value ?? props.crewStartDate,
      endDate: null,
      truck: lastItem.value?.truck ?? null,
      trailer: lastItem.value?.trailer ?? null,
      note: null,
    }

    dialog.value = true
  }

  const pushItem = async newItem => {
    const updatedItems = [...(props.items || [])]

    if (editMode.value === 'create') {
      const lastEl = updatedItems.pop()
      if (lastEl && !lastEl.endDate) lastEl.endDate = newItem.startDate

      updatedItems.push(lastEl)
    } else if (editMode.value === 'edit') updatedItems.pop()

    updatedItems.push(newItem)
    closeDialog()
    ctx.emit('update:items', updatedItems.filter(Boolean))
  }

  const popItem = async () => {
    const res = await proxy.$confirm('Вы уверены?')
    if (!res) return

    const updatedItems = [...props.items]
    updatedItems.pop()
    ctx.emit('update:items', [...updatedItems])
  }

  const closeDialog = () => {
    dialog.value = false
    editMode.value = null
    editableItemMinDate.value = null
    startDateFieldDisabled.value = true
  }

  return {
    tableData,
    editLastItem,
    popItem,
    editedItem,
    dialog,
    closeDialog,
    editableItemMinDate,
    readonlyStartDate,
    addItemHandler,
    pushItem,
    allowAddTransportItems,
  }
}
