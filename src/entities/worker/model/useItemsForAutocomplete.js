import { ref, onMounted } from 'vue'
import { WorkerService } from '@/shared/services'

export const useItemsForAutocomplete = ({ ctx, propValue }) => {
  let itemSelected = !!propValue
  let loading = ref(false)
  const items = ref([])

  const searchString = ref('')

  onMounted(async () => {
    if (propValue) {
      loading.value = true
      WorkerService.getForAutocomplete({ id: propValue })
        .then((val) => {
          if (val?.length)
            items.value = val.map((i) => ({
              value: i._id,
              text: i.fullName || i.name,
            }))
        })
        .finally(() => {
          loading.value = false
          itemSelected = true
        })
    }
  })

  const handleChange = (val) => {
    itemSelected = true
    ctx.emit('change', val)
  }
  const handleSearchInputUpdate = async (val) => {
    searchString.value = val
    loading.value = true
    if (itemSelected) {
      itemSelected = false
    } else {
      items.value = (
        (await WorkerService.getForAutocomplete({ searchStr: val })) || []
      ).map((i) => ({ value: i._id, text: i.fullName || i.name }))
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
