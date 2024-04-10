a
<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="showDeleteBtn"
  >
    <TariffContractForm
      :item="item"
      :agreements="agreementItems"
      @cancel="cancelHandler"
      @submit="submitHandler"
    />
  </form-wrapper>
</template>
<script>
import { onMounted, ref } from 'vue'
import store from '@/store'
import router from '@/router'
import { FormWrapper } from '@/shared/ui'
import {
  TariffContractForm,
  useTariffContract,
} from '@/entities/tariff_contract'
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
    const showDeleteBtn = ref(true)
    const { allClientAgreements: agreementItems } = useAgreements()
    const { getById, create, updateOne, deleteById } = useTariffContract()

    async function submitHandler(formState) {
      try {
        let res
        loading.value = true
        if (props.id) {
          res = await updateOne(props.id, formState)
          item.value = { ...item.value, ...res }
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

    onMounted(async () => {
      if (props.id) {
        try {
          loading.value = true
          item.value = await getById(props.id)
        } catch (e) {
          store.commit('setError', e.message)
        } finally {
          loading.value = false
        }
      }
    })

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
