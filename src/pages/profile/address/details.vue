<template>
  <FormWrapper>
    <v-alert v-model="error.show" closable type="error" @change="toggleAlert">
      {{ error.message }}
    </v-alert>
    <LoadSpinner v-if="loading" />
    <AddressForm
      v-else
      :address="item"
      :partnerItems="partnerApi.allPartners"
      :displayDeleteBtn="!!id && $store.getters.hasPermission('address:delete')"
      :cityItems="cityItems || []"
      @cancel="cancel"
      @submit="submit"
      @delete="deleteHandler"
    />
  </FormWrapper>
</template>
<script setup>
import { watch, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { AddressService } from '@/shared/services'
import { LoadSpinner, FormWrapper } from '@/shared/ui'
import { AddressForm } from '@/entities/address'
import { usePartners } from '@/entities/partner'

defineOptions({ name: 'AddressDetailsPage' })

const props = defineProps({
  id: String,
  openInModal: Boolean,
})

const emit = defineEmits(['submit'])

const router = useRouter()
const store = useStore()

const item = ref(null)
const tmpVal = ref(null)
const error = ref({
  message: null,
  show: false,
})
const loading = ref(false)
const partnerApi = usePartners()

const cityItems = computed(() => {
  return store.getters.cities
    ?.map((i) => {
      return { title: i.name, value: i._id }
    })
    .sort((a, b) => a.title - b.title)
})

function toggleAlert() {
  error.value = {
    show: false,
    message: null,
  }
}

async function submit(val) {
  tmpVal.value = val
  try {
    loading.value = true
    if (props.id) {
      item.value = await AddressService.updateOne(props.id, val)
    } else item.value = await AddressService.create(val)
    tmpVal.value = null
    if (props.openInModal) emit('submit', item.value._id)
    else router.back()
  } catch (e) {
    item.value = tmpVal.value
    if (e.response.status === 400 || e.response.status === 403) {
      error.value.message = e.response.data
      error.value.show = true
    }
  } finally {
    loading.value = false
  }
}

function cancel() {
  router.back()
}

async function deleteHandler() {
  const res = confirm('Вы действительно хотите удалить запись? ')
  if (res) {
    try {
      loading.value = true
      await AddressService.deleteById(props.id)
      router.back()
    } catch (e) {
      store.commit('setError', e.message)
    } finally {
      loading.value = false
    }
  }
}

watch(
  () => props.id,
  async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      loading.value = true
      item.value = await AddressService.getById(newVal)
      loading.value = false
    }
  },
  { immediate: true }
)
</script>
<style></style>
