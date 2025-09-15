<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert v-model="showError" type="error" closable>
          {{ errorMessage }}
        </v-alert>
        <load-spinner v-if="loading" />
        <FineForm
          v-else
          :item="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('fine:delete')
          "
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
          @fine-number-updated="checkFine"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { FineForm } from '@/entities/fine'
import { LoadSpinner } from '@/shared/ui'
import { FineService } from '@/shared/services'
import router from '@/router'
import store from '@/store'
import { watch, ref } from 'vue'

export default {
  name: 'FineDetails',
  components: {
    FineForm,
    LoadSpinner,
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
        item.value = await FineService.getById(props.id)
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }

    const submit = async (formState) => {
      try {
        if (props.id) await FineService.updateOne(props.id, formState)
        else await FineService.create(formState)
        router.push('/profile/fines')
      } catch (e) {
        showError.value = true
        errorMessage.value = e.response.data

        store.commit('setError', e.message)
      }
    }

    async function checkFine(event) {
      const fineNumber = event.target.value
      if (!fineNumber || fineNumber === item?.value?.number) return null
      const existedFine = await FineService.getByNumber(fineNumber)
      if (existedFine) {
        showError.value = true
        errorMessage.value = `Штраф с номером ${existedFine.number} уже есть. id штрафа: ${existedFine._id}`
      } else {
        showError.value = false
        errorMessage.value = ''
      }
    }

    watch(_id, getItem, { immediate: true })

    return { item, loading, showError, errorMessage, submit, checkFine }
  },

  methods: {
    cancel() {
      this.$router.go(-1)
    },

    async deleteHandler() {
      const res = await this.$dialog.confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        try {
          await FineService.deleteById(this.id)
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
