<template>
  <v-autocomplete
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
import { DriverService } from '@/shared/services'

defineOptions({ name: 'DriverAutocomplete' })

const driverId = defineModel({ type: String })
defineProps({
  label: { type: String, required: true },
  disabled: { type: Boolean, default: false },
})

const store = useStore()

const _getDriverNameString = (driver) => {
  return driver?.surname + ' ' + driver?.name
}

const model = ref(null)
const search = ref(null)
const isLoading = ref(false)
const items = ref([])
const tmpItems = ref([])
const timeout = ref(null)

watch(search, async (val, oldVal) => {
  if (!val || !val?.trim() || oldVal === val) {
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
  if (driverId.value) {
    getById()
  }
})

async function getItems(str) {
  const res = await DriverService.search(str, store.getters.directoriesProfile)
  return res.map((item) => ({
    ...item,
    text: _getDriverNameString(item),
  }))
}

async function getById() {
  try {
    isLoading.value = true
    let res = await DriverService.getById(driverId.value)
    res = { ...res, text: _getDriverNameString(res) }
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
    driverId.value = val._id
  }
}

function clear() {
  model.value = null
  items.value = []
  tmpItems.value = []
  driverId.value = null
}
</script>
<style></style>
