<template>
  <form-wrapper
    :loading="loading"
    :displayDeleteBtn="showDeleteBtn"
    @delete="deleteHandler"
  >
    <PartnerForm
      :item="item"
      :clientAgreements="allClientAgreements"
      @cancel="cancel"
      @submit="submit($event, false)"
      @save="submit($event, true)"
      @update:model-value-notifications="changeNotificationsHandler"
    />
  </form-wrapper>
</template>
<script>
import { computed, getCurrentInstance } from 'vue'
import { PartnerService as service } from '@/shared/services'
import { FormWrapper } from '@/shared/ui'
import { PartnerForm } from '@/entities/partner'
import { useAgreements } from '@/entities/agreement/useAgreements'

export default {
  name: 'PartnerDetails',
  components: {
    PartnerForm,
    FormWrapper,
  },
  props: {
    id: String,
  },

  setup(props) {
    const { allClientAgreements } = useAgreements()
    const { proxy } = getCurrentInstance()
    const showDeleteBtn = computed(
      () => !!props?.id && proxy.$store.getters.hasPermission('partner:delete')
    )
    return { allClientAgreements, showDeleteBtn }
  },
  data() {
    return {
      service: service,
      item: null,
      loading: false,

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
    async submit(val, saveOnly) {
      try {
        this.loading = true
        if (this.id) this.item = await this.service.updateOne(this.id, val)
        else this.item = await this.service.create(val)

        if (saveOnly && !this.id)
          this.$router.replace(`/profile/partners/${this.item._id}`)
        else if (!saveOnly) this.$router.go(-1)
      } catch (e) {
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
    changeNotificationsHandler(items) {
      this.item = {
        ...this.item,
        idleTruckNotifications: [...items],
      }
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
