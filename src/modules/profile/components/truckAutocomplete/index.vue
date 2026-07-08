<template>
  <v-autocomplete
    clearable
    hint="Поиск работает по цифрам номера"
    auto-select-first
    return-object
    :model-value="model"
    :items="[...items, ...tmpItems]"
    hide-no-data
    :loading="isLoading"
    v-model:search="search"
    :customFilter="() => true"
    :label="label"
    placeholder="Введите текст для поиска"
    no-data-text="Данные не найдены"
    :disabled="disabled"
    item-value="_id"
    @update:model-value="change"
    @click:clear="clear"
  />
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import TruckService from '../../services/truck.service'

defineOptions({ name: 'TruckAutocomplete' })

const truckId = defineModel({ type: String })
const props = defineProps({
  label: { type: String, required: true },
  type: { type: String, default: null },
  disabled: { type: Boolean, default: false },
})

const store = useStore()

const _getTruckNameString = (truck) => {
  let resStr = ''
  if (truck.name) resStr += truck.name
  if (truck.liftCapacity === 0 && truck.allowUseTrailer) resStr += ' Тягач'
  if (truck.type === 'trailer') resStr += ' Прицеп'
  if (truck.regNum) resStr += ' гос.номер ' + truck.regNum
  if (truck.liftCapacity > 0) resStr += ' г/п: ' + truck.liftCapacity / 1000 + 'т.'
  if (truck.pltCount > 0) resStr += ' ' + truck.pltCount + 'плт'
  return resStr
}

const model = ref(null)
const search = ref(null)
const isLoading = ref(false)
const items = ref([])
const tmpItems = ref([])
const timeout = ref(null)

watch(search, async (val) => {
  if (!val || !val?.trim()) {
    return
  }
  if (isLoading.value) return
  if (timeout.value) clearTimeout(timeout.value)
  timeout.value = setTimeout(async () => {
    try {
      isLoading.value = true
      items.value = await getItems(val)
      isLoading.value = false
    } catch (e) {
      isLoading.value = false
      store.commit('setError', e.message)
    }
  }, 500)
})

onMounted(() => {
  if (truckId.value) {
    getById()
  }
})

async function getItems(str) {
  const res = await TruckService.search(str, props.type || null, store.getters.directoriesProfile)
  return res.map((item) => ({
    ...item,
    text: _getTruckNameString(item),
  }))
}

async function getById() {
  try {
    isLoading.value = true
    let res = await TruckService.getById(truckId.value)
    res = { ...res, text: _getTruckNameString(res) }
    tmpItems.value.push(res)
    model.value = res
    isLoading.value = false
  } catch (e) {
    store.commit('setError', e.message)
    isLoading.value = false
  }
}

function change(val) {
  if (val) {
    tmpItems.value = []
    tmpItems.value.push(val)
    model.value = val
    truckId.value = val._id
  }
}

function clear() {
  model.value = null
  items.value = []
  tmpItems.value = []
  truckId.value = null
}
</script>
<style></style>
