<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="
      !!id && $store.getters.hasPermission('docsRegistry:delete')
    "
  >
    <docs-registry-form :item="item" @cancel="cancel" @submit="submit" />
  </form-wrapper>
</template>

<script>
import { watch, ref } from 'vue'
import router from '@/router'
import store from '@/store'
import { DocsRegistryService as service } from '@/shared/services'
import { FormWrapper, LoadSpinner } from '@/shared/ui'
import { DocsRegistryForm } from '@/modules/accounting/components/docsRegistry'

export default {
  name: 'DocsRegistryDetail',
  components: {
    DocsRegistryForm,
    FormWrapper,
    LoadSpinner,
  },
  props: {
    id: String,
  },
  setup(props) {
    let loading = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    const item = ref({})

    async function getItem() {
      if (!props.id) return null
      try {
        loading.value = true
        const res = await service.getById(props.id)
        item.value = res
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
    async function deleteHandler() {
      try {
        if (props.id) {
          loading.value = true
          await service.deleteById(props.id)
          router.push('/accounting/docsRegistry')
          loading.value = false
        } else return null
      } catch (e) {
        loading.value = false
        showError.value = true
        errorMessage.value = e.response.data
        store.commit('setError', e.message)
      }
    }
    watch(() => props.id, getItem, { immediate: true, deep: true })
    return { item, loading, showError, errorMessage, submit, deleteHandler }
  },

  methods: {
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style></style>
