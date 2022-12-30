<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="
      !!id && $store.getters.hasPermission('docsRegistry:delete')
    "
  >
    <app-partner-form :partner="item" @cancel="cancel" @submit="submit" />
  </form-wrapper>
</template>
<script>
import AppPartnerForm from '@/modules/profile/components/partnerForm'
import { PartnerService as service } from '@/shared/services'
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { FormWrapper } from '@/shared/ui'

export default {
  name: 'PartnerDetails',
  components: {
    AppPartnerForm,
    FormWrapper,
  },
  mixins: [pageDetailsMixin],
  data() {
    return {
      service: service,
    }
  },
  methods: {
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
