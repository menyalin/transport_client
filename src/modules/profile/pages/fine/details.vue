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
import router from '@/router'
import store from '@/store'
import { watch, ref } from 'vue'

export default {
  name: 'FineDetails',
  components: {
    AppForm,
    AppLoadSpinner,
  },
  props: {
    id: String,
  },
  setup(props) {
    const _id = ref(props.id)
    let loading = ref(false)
    let item = ref()

    async function getItem() {
      if (!props.id) return null
      try {
        loading.value = true
        item.value = await service.getById(props.id)
        loading.value = false
      } catch (e) {
        loading.value = false
        store.commit('setError', e.message)
      }
    }

    const submit = async (formState) => {
      try {
        if (props.id) await service.updateOne(props.id, formState)
        else await service.create(formState)
        router.push('/profile/fines')
      } catch (e) {
        store.commit('setError', e.message)
      }
    }

    getItem()
    watch(_id, getItem)

    return { item, loading, submit }
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
