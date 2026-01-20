<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю...</div>
        <CarrierForm
          v-else
          :item="carrier"
          :loading="loading || agreementsLoading"
          :displayDeleteBtn="$store.getters.hasPermission('carrier:delete')"
          :agreementItems="agreementItems"
          @cancel="cancelHandler"
          @submit="submitHandler"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { CarrierForm, useCarrierStore } from '@/entities/carrier'
import { useCarrierAgreements } from '@/entities/carrierAgreement'

export default {
  name: 'CarrierPage',
  components: {
    CarrierForm,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { proxy } = getCurrentInstance()
    const carrierStore = useCarrierStore()
    const carrier = ref(null)
    const { items: agreementItems, loading: agreementsLoading } =
      useCarrierAgreements()

    async function submitHandler(val) {
      carrier.value = await carrierStore.updateOne(props.id, val)
      proxy.$router.go(-1)
    }

    async function cancelHandler() {
      proxy.$router.push({ name: 'CarrierList' })
    }

    async function deleteHandler() {
      if (!props.id) return
      const res = confirm('Вы действительно хотите удалить запись? ')
      if (!res) return
      await carrierStore.deleteOne(props.id)
      proxy.$router.push({ name: 'CarrierList' })
    }

    onMounted(async () => {
      if (props.id) {
        carrier.value = await carrierStore.getById(props.id)
      }
    })

    return {
      agreementsLoading,
      agreementItems,
      carrier,
      loading: carrierStore.loading,
      submitHandler,
      cancelHandler,
      deleteHandler,
    }
  },
}
</script>
<style></style>
