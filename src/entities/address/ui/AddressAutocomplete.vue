<template>
  <AppAutocomplete
    v-model="model"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    :hint="hint || undefined"
    :persistent-hint="persistentHint"
    :fetch-items="fetchItems"
    :fetch-by-id="fetchById"
    show-action
    v-bind="$attrs"
    @create="$emit('create')"
    @edit="$emit('edit', $event)"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppAutocomplete from '@/shared/ui/AppAutocomplete/AppAutocomplete.vue'
import { useAddressStore } from '@/entities/address'

export interface AddressAutocompleteItem {
  value: string
  text: string
  loading: boolean
  unloading: boolean
  service: boolean
  partner?: string
}

defineOptions({ name: 'AddressAutocomplete' })

const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    hideDetails?: boolean
    hint?: string | null
    persistentHint?: boolean
    pointType?: 'loading' | 'unloading' | 'service' | null
  }>(),
  {
    label: 'Адрес',
    disabled: false,
    hideDetails: false,
    persistentHint: false,
    pointType: null,
  }
)

defineEmits<{
  create: []
  edit: [id: string | null]
}>()

const model = defineModel<string | null>()

const addressStore = useAddressStore()

onMounted(() => {
  addressStore.getAddresses()
})

function pointTypeFilter(item: AddressAutocompleteItem) {
  if (!props.pointType) return true
  return item[props.pointType]
}

async function fetchItems(query: string): Promise<AddressAutocompleteItem[]> {
  const search = query.toLowerCase()
  return addressStore.addressesForAutocomplete.filter((item) => {
    if (!pointTypeFilter(item)) return false
    return item.text.toLowerCase().includes(search)
  })
}

async function fetchById(id: string): Promise<AddressAutocompleteItem | null> {
  const address = addressStore.addressMap.get(id)
  if (!address) return null
  const item = addressStore.addressesForAutocomplete.find((i) => i.value === id)
  if (item) return item
  return {
    value: address._id,
    text: address.name,
    loading: address.isShipmentPlace,
    unloading: address.isDeliveryPlace,
    service: address.isService,
    partner: address.partner,
  }
}
</script>
