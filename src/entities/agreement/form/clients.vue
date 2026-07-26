<template>
  <div class="my-2">
    <div class="text-headline-small">
      Клиенты:
      <div v-if="!clientList || !clientList.length" class="text-body-small pl-6 my-2">
        нет данных
      </div>
      <v-list v-else>
        <v-list-item v-for="item in clientList" :key="item">
          <v-list-item-title>
            {{ partnersMap.get(item)?.name ?? 'запись недоступна' }}
          </v-list-item-title>
          <template #append>
            <v-icon size="small" color="error" @click="deleteClient(item)"> mdi-delete </v-icon>
          </template>
        </v-list-item>
      </v-list>
      <v-autocomplete :items="clientItems" v-if="!isVisibleBtn" @update:model-value="addClient" />
      <v-btn v-else size="small" variant="text" color="primary" @click="showAutocomplete">
        Добавить клиента
      </v-btn>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'AgreementClients' })
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const tmpItems = ref([])
const clientList = computed(() => props.modelValue)

const isVisibleBtn = ref(true)

const clientItems = computed(() => {
  return store.getters.partners
    .filter((i) => i.isClient)
    .map((i) => ({ value: i._id, text: i.name }))
})

const partnersMap = computed(() => store.getters.partnersMap)

watch(
  () => props.modelValue,
  (val) => {
    tmpItems.value = val
  },
  { immediate: true }
)

const showAutocomplete = () => {
  isVisibleBtn.value = false
}

const addClient = (val) => {
  if (val && !tmpItems.value.includes(val)) {
    tmpItems.value.push(val)
    emit('update:modelValue', tmpItems.value)
  }
  isVisibleBtn.value = true
}

const deleteClient = async (id) => {
  if (!id) return null
  const res = confirm('Вы уверены? ')
  if (!res) return null
  emit(
    'update:modelValue',
    tmpItems.value.filter((item) => item !== id)
  )
}
</script>

<style></style>
