<template>
  <FormWrapper :loading="loading" @delete="deleteHandler" :displayDeleteBtn="showDeleteBtn">
    <PartnerForm
      :item="item"
      :clientAgreements="allClientAgreements"
      @cancel="cancel"
      @submit="submit($event, false)"
      @save="submit($event, true)"
      @changeNotifications="changeNotificationsHandler"
    />
  </FormWrapper>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import * as api from '@/entities/partner/api'
import { usePartnerStore } from '@/entities/partner'
import { FormWrapper } from '@/shared/ui'
import { PartnerForm } from '@/features/partner'
import { useAgreements } from '@/entities/agreement/useAgreements'
import { useReturnContextPage } from '@/shared/composables/useReturnContextPage'

defineOptions({ name: 'PartnerDetails' })

const props = defineProps({
  id: String,
})

const store = useStore()
const { allClientAgreements } = useAgreements()
const partnerStore = usePartnerStore()

const partnerService = {
  getById: api.getById,
  async create(body) {
    const item = await api.create(body)
    partnerStore.addPartnerLocally(item)
    return item
  },
  async updateOne(id, body) {
    const item = await api.updateById(id, body)
    partnerStore.updatePartnerLocally(item)
    return item
  },
  async deleteById(id) {
    await api.deleteById(id)
    partnerStore.deletePartnerLocally(id)
  },
}

const { item, loading, submit, cancel, deleteHandler } = useReturnContextPage(
  partnerService,
  () => props.id,
  {
    returnContextField: 'newPartnerId',
    returnContextClearField: 'clearedPartner',
    detailsRouteName: 'PartnerDetails',
  }
)

const showDeleteBtn = computed(() => !!props?.id && store.getters.hasPermission('partner:delete'))

function changeNotificationsHandler(items) {
  item.value = {
    ...item.value,
    idleTruckNotifications: [...items],
  }
}
</script>
<style></style>
