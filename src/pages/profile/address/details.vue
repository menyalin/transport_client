<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="error.show" closable type="error"
 @change="toggleAlert">
          {{ error.message }}
        </v-alert>
        <AppLoadSpinner v-if="loading" />
        <AddressForm
          v-else
          :address="item"
          :partnerItems="partnerApi.allPartners"
          :partnerActions="partnerApi.actions"
          :displayDeleteBtn="!!id && $store.getters.hasPermission('address:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { watch, ref, getCurrentInstance } from 'vue'
import { AddressService } from '@/shared/services'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import { AddressForm } from '@/entities/address'
import { usePartners } from '@/entities/partner'
import { usePersistedFormState } from '@/shared/hooks/usePersistedFormState'

export default {
  name: 'AddressDetailsPage',
  components: {
    AddressForm,
    AppLoadSpinner,
  },
  props: {
    id: String,
    openInModal: { type: Boolean, default: false },
  },
  setup(props, ctx) {
    const { updatePrevFormValue } = usePersistedFormState()
    const { proxy } = getCurrentInstance()
    const { $router, $confirm, $store, $route } = proxy

    const item = ref(null)
    const tmpVal = ref(null)
    const error = ref({
      message: null,
      show: false,
    })
    const loading = ref(false)
    const partnerApi = usePartners()

    function toggleAlert() {
      error.value = {
        show: false,
        message: null,
      }
    }

    async function submit(val) {
      tmpVal.value = val
      try {
        loading.value = true
        if (props.id) {
          item.value = await AddressService.updateOne(props.id, val)
        } else item.value = await AddressService.create(val)
        tmpVal.value = null
        updatePrevFormValue($route, item.value._id)
        if (props.openInModal) ctx.emit('submit', item.value._id)
        else $router.go(-1)
      } catch (e) {
        item.value = tmpVal.value
        if (e.response.status === 400 || e.response.status === 403) {
          error.value.message = e.response.data
          error.value.show = true
        }
      } finally {
        loading.value = false
      }
    }

    function cancel() {
      if (props.openInModal) ctx.emit('cancel')
      else $router.go(-1)
    }
    async function deleteHandler() {
      const res = await $confirm('Вы действительно хотите удалить запись? ')
      if (res) {
        try {
          loading.value = true
          await AddressService.deleteById(props.id)
          $router.go(-1)
        } catch (e) {
          $store.commit('setError', e.message)
        } finally {
          loading.value = false
        }
      }
    }

    watch(
      () => props.id,
      async (newVal, oldVal) => {
        if (newVal && newVal !== oldVal) {
          loading.value = true
          item.value = await AddressService.getById(newVal)
          loading.value = false
        }
      },
      { immediate: true }
    )

    return {
      item,
      partnerApi,
      toggleAlert,
      submit,
      cancel,
      deleteHandler,
      error,
      loading,
    }
  },
}
</script>
<style></style>
