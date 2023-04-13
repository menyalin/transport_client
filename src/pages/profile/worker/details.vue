<template>
  <form-wrapper
    :loading="loading"
    @delete="deleteHandler"
    :displayDeleteBtn="!!id && $store.getters.hasPermission('worker:delete')"
  >
    <worker-form
      :item="item"
      @cancel="cancel"
      @submit="submit"
      @delete="deleteHandler"
    />
    <linked-user v-if="id" :worker="item" />
  </form-wrapper>
</template>
<script>
import { ref, computed } from 'vue'
import store from '@/store'
import router from '@/router'
import { LoadSpinner, FormWrapper } from '@/shared/ui'
import { WorkerService } from '@/shared/services'
import { WorkerForm } from '@/entities/worker'
import { LinkedUser } from '@/widgets/worker'

export default {
  name: 'WorkerDetails',
  components: {
    FormWrapper,
    WorkerForm,
    LoadSpinner,
    LinkedUser,
  },
  props: {
    id: String,
  },
  setup(props) {
    let tmpVal = ref()
    let loading = ref(false)
    let worker = ref({})

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

    const item = computed(() => (tmpVal.value ? tmpVal.value : worker.value))

    const submit = async (val) => {
      try {
        tmpVal.value = val
        if (props.id) await WorkerService.updateOne(props.id, val)
        else await WorkerService.create(val)
        router.go(-1)
      } catch (e) {
        store.commit('setError', e)
      }
    }
    getWorker()
    return { submit, loading, tmpVal, item }
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
