<template>
  <FormWrapper :loading="loading" @delete="deleteHandler" :displayDeleteBtn="showDeleteBtn">
    <TariffContractForm
      :item="item"
      :agreements="agreementItems"
      @cancel="cancelHandler"
      @submit="submitHandler"
    />
  </FormWrapper>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { FormWrapper } from '@/shared/ui'
import { TariffContractForm, useTariffContract } from '@/entities/tariff_contract'
import { useAgreements } from '@/entities/agreement'

defineOptions({ name: 'TariffContractDetail' })

const props = defineProps({
  id: String,
})

const router = useRouter()
const store = useStore()

const item = ref({})
const loading = ref(false)
const showDeleteBtn = computed(() => {
  return !!props?.id && store.getters.hasPermission('tariffContract:delete')
})
const { allClientAgreements: agreementItems } = useAgreements()
const { getById, create, updateOne, deleteById } = useTariffContract()

async function submitHandler(formState) {
  try {
    let res
    loading.value = true
    const itemId = props.id ? props.id : item.value?._id
    if (itemId) {
      res = await updateOne(itemId, formState)
      item.value = { ...item.value, ...res }
      router.push({ name: 'TariffContractList' })
    } else {
      res = await create(formState)
      router.replace({
        name: 'TariffContractDetails',
        params: { id: res._id },
      })
    }
  } catch (e) {
    store.commit('setError', e.message)
    console.log('submit error! ', e.message)
  } finally {
    loading.value = false
  }
}

async function getItem() {
  if (!props.id) return
  try {
    loading.value = true
    item.value = await getById(props.id)
  } catch (e) {
    store.commit('setError', e.message)
  } finally {
    loading.value = false
  }
}

async function deleteHandler() {
  if (!item.value._id) return
  try {
    loading.value = true
    await deleteById(item.value._id)
    router.push({ name: 'TariffContractList' })
  } catch (e) {
    store.commit('setError', e.message)
    console.error('Ошибка удаления контракта: ', e)
  } finally {
    loading.value = false
  }
}

function cancelHandler() {
  router.go(-1)
}

watch(
  () => props.id,
  (id) => {
    if (id) getItem()
  },
  { immediate: true }
)
</script>

<style></style>
