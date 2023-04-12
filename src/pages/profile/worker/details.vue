<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <load-spinner v-if="loading" />
        <worker-form
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
import { WorkerForm } from '@/entities/worker'
import { LoadSpinner } from '@/shared/ui'
import { WorkerService } from '@/shared/services'
import { ref, computed } from 'vue'
import store from '@/store'
import router from '@/router'

export default {
  name: 'WorkerDetails',
  components: {
    WorkerForm,
    LoadSpinner,
  },
  props: {
    id: String,
  },
  setup() {
    const { id } = router.currentRoute.params
    let tmpVal = ref()
    let loading = ref(false)
    let worker = ref({})

    async function getWorker() {
      if (!id) return null
      try {
        loading.value = true
        worker.value = await WorkerService.getById(id)
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }

    const formItem = computed(() =>
      tmpVal.value ? tmpVal.value : worker.value
    )

    const submit = async (val) => {
      try {
        tmpVal.value = val
        if (id) await WorkerService.updateOne(id, val)
        else await WorkerService.create(val)
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
          await WorkerService.deleteById(this.id)
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
