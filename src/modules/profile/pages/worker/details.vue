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
import { ref, computed, reactive } from '@vue/composition-api'
import store from '@/store'
import router from '@/router'

export default {
  name: 'WorkerDetails',
  components: {
    AppForm,
    AppLoadSpinner,
  },
  setup() {
    const { id } = router.currentRoute.params
    const tmpVal = ref()
    const loading = ref(false)
    const worker = reactive({})

    async function getWorker() {
      if (!id) return null
      try {
        loading.value = true
        worker = await service.getById(id)
        loading.value = false
      } catch(e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }

    const formItem = computed(() => !!tmpVal.value ? tmpVal.value : worker.value) 

    const submit = async(val) => {
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
    return { submit, loading, id, tmpVal, formItem, }
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
          this.loading = true
          await service.deleteById(this.id)
          this.loading = false
          this.$router.go(-1)
        } catch (e) {
          this.loading = false
          this.$store.commit('setError', e.message)
        }
      }
    },
  },
}
</script>
<style></style>
