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
import { WORKERS } from '@/constants/queryKeys'
import { useQuery, useMutation } from 'vue-query'
import { ref, computed } from '@vue/composition-api'
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
    const { data: worker, isLoading: loading } = useQuery([WORKERS, id], () => service.getById(id), { enabled: !!id, staleTime: 10000 })
    const formItem = computed(() => !!tmpVal.value ? tmpVal.value : worker.value) 

    const createWorkerMutation = useMutation((val) => service.create(val), {
      onMutate: (val) => {
        tmpVal.value = val
      },
      onSuccess: () => {
        router.go(-1)
      }
    })

    const updateWorkerMutation = useMutation(({ id, val }) => service.updateOne(id, val), {
      onMutate: (val) => {
        tmpVal.value = val
      },
      onSuccess: () => {
        router.go(-1)
      }
    })

    const submit = async(val) => {
      try {
        if (id) await updateWorkerMutation.mutateAsync({id, val})
        else
        await createWorkerMutation.mutateAsync(val)
      } catch (e) {
        store.commit('setError', e)
      }
    }

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
