a
<template>
  <FormWrapper :loading="loading" :displayDeleteBtn="showDeleteBtn" @delete="deleteHandler">
    <TariffContractForm :item="item" :agreements="agreementItems" @cancel="cancelHandler" @submit="submitHandler" />
  </FormWrapper>
</template>
<script>
import { computed, watch, ref } from 'vue'
import store from '@/store'
import router from '@/router'
import { FormWrapper } from '@/shared/ui'
import { TariffContractForm, useTariffContract } from '@/entities/tariff_contract'
import { useAgreements } from '@/entities/agreement'
export default {
  name: 'TariffContractDetail',
  components: {
    FormWrapper,
    TariffContractForm,
  },
  props: {
    id: String,
  },

  setup(props) {
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
    watch(
      () => props.id,
      async id => {
        if (id) {
          try {
            loading.value = true
            item.value = await getById(id)
          } catch (e) {
            store.commit('setError', e.message)
          } finally {
            loading.value = false
          }
        }
      },
      { immediate: true, deep: true }
    )

    return {
      item,
      loading,
      showDeleteBtn,
      agreementItems,
      submitHandler,
      deleteById,
    }
  },
  methods: {
    cancelHandler() {
      this.$router.go(-1)
    },
    async deleteHandler() {
      try {
        if (!this.item._id) return
        await this.deleteById(this.item._id)
        this.$router.push({ name: 'TariffContractList' })
      } catch (e) {
        this.$store.commit('setError', e.message)
        console.error('Ошибка удаления контракта: ', e)
      }
    },
  },
}
</script>
