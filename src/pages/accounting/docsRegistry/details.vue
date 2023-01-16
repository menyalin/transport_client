<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="
      !!id && $store.getters.hasPermission('docsRegistry:delete')
    "
  >
    <docs-registry-form
      :item="item"
      @cancel="cancel"
      @submit="submit"
      @save="submit($event, true)"
      @pickOrders="pickOrdersHandler"
    />
    <v-dialog
      v-if="item._id"
      v-model="showPickOrderDialog"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <pick-orders
        :docsRegistryId="item._id"
        @cancel="showPickOrderDialog = false"
      />
    </v-dialog>
  </form-wrapper>
</template>

<script>
import { watch, ref } from 'vue'
import router from '@/router'
import store from '@/store'
import { DocsRegistryService } from '@/shared/services'
import { FormWrapper } from '@/shared/ui'
import { DocsRegistryForm } from '@/entities/docsRegistry'
import { PickOrders } from '@/features/docsRegistry'

export default {
  name: 'DocsRegistryDetail',
  components: {
    DocsRegistryForm,
    FormWrapper,
    PickOrders,
  },
  props: {
    id: String,
  },
  setup(props) {
    let loading = ref(false)
    const showError = ref(false)
    const errorMessage = ref('')
    const item = ref({})
    const showPickOrderDialog = ref(false)
    function pickOrdersHandler() {
      showPickOrderDialog.value = true
    }

    async function getItem() {
      if (!props.id) return null
      try {
        loading.value = true
        const res = await DocsRegistryService.getById(props.id)
        item.value = res
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }

    const submit = async (formState, saveOnly) => {
      let updatedItem
      const itemId = props.id ? props.id : item.value?._id
      try {
        if (itemId) {
          updatedItem = await DocsRegistryService.updateOne(itemId, formState)
        } else {
          updatedItem = await DocsRegistryService.create(formState)
        }
        if (!saveOnly) router.push('/accounting/docsRegistry')
        else {
          item.value = updatedItem
        }
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
          await DocsRegistryService.deleteById(props.id)
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

    return {
      item,
      loading,
      showError,
      errorMessage,
      submit,
      deleteHandler,
      pickOrdersHandler,
      showPickOrderDialog,
    }
  },

  methods: {
    cancel() {
      this.$router.go(-1)
    },
  },
}
</script>

<style></style>
