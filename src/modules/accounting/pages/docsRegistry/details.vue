<template>
  <form-wrapper>
    <docs-registry-form
      :item="item"
      :displayDeleteBtn="
        !!id && $store.getters.hasPermission('docsRegistry:delete')
      "
      @cancel="cancel"
      @submit="submit"
      @delete="deleteHandler"
    />
  </form-wrapper>
</template>

<script>
import { DocsRegistryForm } from '@/modules/accounting/components/docsRegistry'
import { DocsRegistryService as service } from '@/shared/services'
import { FormWrapper } from '@/shared/ui'
import router from '@/router'
import store from '@/store'
import { watch, ref } from 'vue'
export default {
  name: 'DocsRegistryDetail',
  components: {
    DocsRegistryForm,
    FormWrapper,
  },
  props: {
    id: String,
  },
  setup(props) {
    const _id = ref(props.id)
    let loading = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    let item = ref({})

    async function getItem() {
      if (!props.id) return null
      try {
        loading.value = true
        item.value = await service.getById(props.id)
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }

    const submit = async (formState) => {
      try {
        if (props.id) await service.updateOne(props.id, formState)
        else await service.create(formState)
        router.push('/accounting/docsRegistry')
      } catch (e) {
        showError.value = true
        errorMessage.value = e.response.data

        store.commit('setError', e.message)
      }
    }

    getItem()
    watch(_id, getItem)

    return { item, loading, showError, errorMessage, submit }
  },

  methods: {
    cancel() {
      this.$router.go(-1)
    },

    async deleteHandler() {
      const res = await this.$confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        try {
          await service.deleteById(this.id)
          this.$router.go(-1)
        } catch (e) {
          this.$store.commit('setError', e.message)
        }
      }
    },
  },
}
</script>

<style></style>
