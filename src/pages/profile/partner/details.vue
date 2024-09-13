<template>
  <form-wrapper
    :loading="loading"
    :displayDeleteBtn="
      !!id && $store.getters.hasPermission('docsRegistry:delete')
    "
    @delete="deleteHandler"
  >
    <PartnerForm
      :partner="item"
      @cancel="cancel"
      @submit="submit"
      @update-partner="updatePartnerHandler"
    />
    <IdleTruckNotificationsWidget
      :partner="item"
      @update-partner="updatePartnerHandler"
    />
  </form-wrapper>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'

import { PartnerForm } from '@/entities/partner'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { PartnerService as service } from '@/shared/services'
import { FormWrapper } from '@/shared/ui'
import { IdleTruckNotifications as IdleTruckNotificationsWidget } from '@/widgets/idleTruckNotifications'

export default defineComponent({
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
})
</script>
<style></style>
