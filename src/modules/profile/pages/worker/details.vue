<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-form
          v-else
          :item="formItem"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('worker:delete')
          "
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppForm from '@/modules/profile/components/workerForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/worker.service'
import { ref, computed, reactive } from 'vue'
import store from '@/store'
import router from '@/router'

export default {
  name: 'WorkerDetails',
  components: {
    AppForm,
    AppLoadSpinner,
  },
  props: {
    id: String,
  },
  setup() {
    const { id } = router.currentRoute.params
    let tmpVal = ref()
    let loading = ref(false)
    let worker = reactive({})
    async function getWorker() {
      if (!id) return null
      try {
        loading.value = true
        worker = await service.getById(id)
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }

    const formItem = computed(() => (tmpVal.value ? tmpVal.value : worker))

    const submit = async (val) => {
      try {
        tmpVal.value = val
        if (id) await service.updateOne(id, val)
        else await service.create(val)
        router.go(-1)
      } catch (e) {
        store.commit('setError', e)
      }
    }
    getWorker()
    return { submit, loading, tmpVal, formItem }
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
