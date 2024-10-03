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

import { FormWrapper } from '@/shared/ui'
import { PartnerForm } from '@/entities/partner'
import { IdleTruckNotifications as IdleTruckNotificationsWidget } from '@/widgets/idleTruckNotifications'
import { usePersistedFormState } from '@/shared/hooks/usePersistedFormState'

export default {
  name: 'PartnerDetails',
  components: {
    PartnerForm,
    FormWrapper,
    IdleTruckNotificationsWidget,
  },
  props: {
    id: String,
  },
  setup() {
    const { updatePrevFormValue } = usePersistedFormState()
    return {
      updatePrevFormValue,
    }
  },
  data() {
    return {
      service: service,
      item: null,
      loading: false,
      tmpVal: null,
      error: {
        message: null,
        show: false,
      },
    }
  },
  methods: {
    toggleAlert() {
      this.error = {
        show: false,
        message: null,
      }
    },
    async submit(val) {
      this.tmpVal = val
      try {
        this.loading = true
        if (this.id) {
          this.item = await this.service.updateOne(this.id, val)
        } else this.item = await this.service.create(val)
        this.tmpVal = null
        this.updatePrevFormValue(this.$route, this.item._id)
        this.$router.go(-1)
      } catch (e) {
        this.item = this.tmpVal
        if (e.response.status === 400 || e.response.status === 403) {
          this.error.message = e.response.data
          this.error.show = true
        }
      } finally {
        this.loading = false
      }
    },
    cancel() {
      this.$router.go(-1)
    },
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
  watch: {
    id: {
      immediate: true,
      handler: async function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.loading = true
          this.item = await this.service.getById(newVal)
          this.loading = false
        }
      },
    },
  },
}
</script>
<style></style>
