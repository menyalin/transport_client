<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю...</div>
        <CrewForm
          v-else
          :crew="crew"
          :carrierItems="carrierStore.carriers"
          :displayDeleteBtn="$store.getters.hasPermission('crew:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { CrewService } from '@/shared/services'
import { CrewForm } from '@/entities/crew'
import { useCarrierStore } from '@/entities/carrier/useCarrierStore'
export default {
  name: 'CrewDetails',
  components: {
    CrewForm,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup() {
    const carrierStore = useCarrierStore()
    return {
      carrierStore,
    }
  },
  data() {
    return {
      loading: false,
      crew: null,
    }
  },
  async created() {
    this.loading = true
    this.crew = await CrewService.getById({ id: this.id, forEdit: true })
    this.loading = false
  },

  methods: {
    async submit(val) {
      this.loading = true
      this.crew = await CrewService.updateOne(this.id, val)
      this.loading = false
      this.$router.go(-1)
    },
    cancel() {
      this.$router.go(-1)
    },
    async deleteHandler() {
      const res = await this.$confirm(
        'Вы действительно хотите удалить запись? '
      )
      if (res) {
        this.loading = true
        await CrewService.deleteById(this.id)
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style></style>
