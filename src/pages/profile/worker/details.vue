<template>
  <form-wrapper
    :loading="loading"
    :displayDeleteBtn="!!id && $store.getters.hasPermission('worker:delete')"
    @delete="deleteHandler"
  >
    <worker-form :item="worker" @cancel="cancel" @submit="submit" />
    <linked-user
      v-if="id"
      :worker="worker"
      @update-worker="updateWorkerHandler"
    />
  </form-wrapper>
</template>
<script lang="ts">
//@ts-nocheck
import { defineComponent } from 'vue'
import { ref } from 'vue'

import { WorkerForm } from '@/entities/worker'
import router from '@/router'
import { WorkerService } from '@/shared/services'
import { FormWrapper } from '@/shared/ui'
import store from '@/store'
import { LinkedUser } from '@/widgets/worker'

export default defineComponent({
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
    const worker = ref({})
    const loading = ref(false)

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

    const submit = async (val) => {
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
})
</script>
<style></style>
