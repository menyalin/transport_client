<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="
      !!id && $store.getters.hasPermission('docsRegistry:delete')
    "
  >
    <PartnerForm
      :partner="item"
      @cancel="cancel"
      @submit="submit"
      @updatePartner="updatePartnerHandler"
    />
    <IdleTruckNotificationsWidget
      :partner="item"
      @updatePartner="updatePartnerHandler"
    />
  </form-wrapper>
</template>
<script>
import { PartnerService as service } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { FormWrapper } from '@/shared/ui'
import { PartnerForm } from '@/entities/partner'
import { IdleTruckNotifications as IdleTruckNotificationsWidget } from '@/widgets/idleTruckNotifications'

export default {
  name: 'PartnerDetails',
  components: {
    PartnerForm,
    FormWrapper,
    IdleTruckNotificationsWidget,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: service,
    }
  },
  methods: {
    async updatePartnerHandler(updatedItem) {
      this.item = Object.assign({}, updatedItem)
    },
    async deleteHandler() {
      try {
        this.loading = true
        await this.service.deleteById(this.id)
        this.loading = false
        this.$router.push('/profile/partners')
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
  },
}
</script>
<style></style>
