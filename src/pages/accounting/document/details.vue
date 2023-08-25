<template>
  <FormWrapper
    :loading="loading"
    :displayDeleteBtn="deleteAllowed"
    @delete="deleteHandler"
  >
    <DocumentForm :document="item" @cancel="cancel" @submit="submit" />
  </FormWrapper>
</template>
<script>
import store from '@/store'
import { computed } from 'vue'
import { DocumentForm } from '@/entities/document'
import { FormWrapper } from '@/shared/ui/index'
import { DocumentService } from '@/shared/services'

export default {
  name: 'DocumentDetails',
  components: {
    DocumentForm,
    FormWrapper,
  },
  props: {
    id: String,
  },
  setup(props) {
    const deleteAllowed = computed(() => {
      return props.id && store.getters.hasPermission('document:delete')
    })

    return {
      deleteAllowed,
    }
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
  data() {
    return {
      item: null,
      loading: false,
      tmpVal: null,
      error: {
        message: null,
        show: false,
      },
      service: DocumentService,
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
        this.loading = false
        this.tmpVal = null
        if (this.openInModal) this.$emit('submit', this.item._id)
        else this.$router.go(-1)
      } catch (e) {
        this.loading = false
        this.item = this.tmpVal
        if (e.response.status === 400 || e.response.status === 403) {
          this.error.message = e.response.data
          this.error.show = true
        }
      }
    },

    cancel() {
      if (this.openInModal) this.$emit('cancel')
      else this.$router.go(-1)
    },
    async deleteHandler() {
      try {
        this.loading = true
        await this.service.deleteById(this.id)
        this.loading = false
        this.$router.go(-1)
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
  },
}
</script>
<style></style>
