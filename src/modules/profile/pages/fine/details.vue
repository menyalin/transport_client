<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-form
          v-else
          :item="item"
          :displayDeleteBtn="
            !!id && $store.getters.hasPermission('fine:delete')
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
import AppForm from '@/modules/profile/components/fineForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import service from '../../services/fine.service'
import { useQuery } from 'vue-query'
import { FINES } from '@/constants/queryKeys'
import router from '@/router'
import store from '@/store'

export default {
  name: 'FineDetails',
  components: {
    AppForm,
    AppLoadSpinner,
  },
  props: {
    id: String,
  },
  setup({ id }) {
    const { data: item, isLoading: loading } = useQuery([FINES, id], () => service.getById(id), {enabled: !!id, staleTime: Infinity} )
    const submit = async (formState) => {
      try {
        let res 
        if (id) res = await service.updateOne(id, formState)
        else res = await service.create(formState)
        router.push('/profile/fines')
      } catch (e) {
        store.commit('setError', e.message)
      }
    }



    return { item, loading, submit }
  },

  methods: {
    cancel() {
      this.$router.go(-1)
    },

    async deleteHandler() {
      const res = await this.$confirm('Вы действительно хотите удалить запись? ')
            if (res) {
        try {
          await service.deleteById(this.id)
          this.$router.go(-1)
        } catch (e) {
          this.$store.commit('setError', e.message)
        }
      }
    },
  }
}
</script>
<style></style>
