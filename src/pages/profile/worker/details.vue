<template>
  <FormWrapper
    :loading="loading"
    :displayDeleteBtn="!!id && $store.getters.hasPermission('worker:delete')"
    @delete="deleteHandler"
  >
    <WorkerForm :item="worker" @cancel="cancel" @submit="submit" />
    <LinkedUser v-if="id" :worker="worker" @updateWorker="updateWorkerHandler" />
  </FormWrapper>
</template>
<script>
import { ref } from 'vue'
import store from '@/store'
import router from '@/router'
import { FormWrapper } from '@/shared/ui'
import { WorkerService } from '@/shared/services'
import { WorkerForm } from '@/entities/worker'
import { LinkedUser } from '@/widgets/worker'

export default {
  name: 'WorkerDetails',
  components: {
    FormWrapper,
    WorkerForm,
    LinkedUser,
  },
  props: {
    id: String,
  },
  setup(props) {
    let worker = ref({})
    let loading = ref(false)

    async function getWorker() {
      if (!props.id) return null
      try {
        loading.value = true
        worker.value = await WorkerService.getById(props.id)
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }

    function updateWorkerHandler(updatedWorker) {
      worker.value = updatedWorker
    }

    const submit = async val => {
      try {
        if (props.id) await WorkerService.updateOne(props.id, val)
        else await WorkerService.create(val)
        router.go(-1)
      } catch (e) {
        store.commit('setError', e)
      }
    }
    getWorker()
    return { submit, loading, worker, updateWorkerHandler }
  },

  methods: {
    cancel() {
      this.$router.go(-1)
    },

    async deleteHandler() {
      const res = await this.$confirm('Вы действительно хотите удалить запись? ')
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
