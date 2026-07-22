import { ref, onMounted, watch } from 'vue'
import { WorkerService } from '@/shared/services'

export const useItemsForAutocomplete = ({ ctx, propValue }) => {
  const itemSelected = ref(!!propValue.value)
  const loading = ref(false)
  const items = ref([])

  const searchString = ref('')

  watch(propValue, (val) => {
    itemSelected.value = !!val
  })

  onMounted(async () => {
    if (propValue.value) {
      loading.value = true
      WorkerService.getForAutocomplete({ id: propValue.value })
        .then((val) => {
          if (val?.length)
            items.value = val.map((i) => ({
              value: i._id,
              text: i.fullName || i.name,
            }))
        })
        .finally(() => {
          loading.value = false
          itemSelected.value = true
        })
    }
  })

  const handleChange = (val) => {
    itemSelected.value = true
    ctx.emit('change', val)
  }
  const handleSearchInputUpdate = async (val) => {
    searchString.value = val
    loading.value = true
    if (itemSelected.value) {
      itemSelected.value = false
    } else {
      items.value = ((await WorkerService.getForAutocomplete({ searchStr: val })) || []).map(
        (i) => ({ value: i._id, text: i.fullName || i.name })
      )
    }
    loading.value = false
  }

  return {
    handleChange,
    items,
    handleSearchInputUpdate,
    searchString,
    loading,
  }
}
