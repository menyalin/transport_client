<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю...</div>
        <truck-form
          v-else
          :truck="truck"
          :displayDeleteBtn="$store.getters.hasPermission('truck:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { TruckService } from '@/shared/services'
import { TruckForm } from '@/entities/truck'

export default {
  name: 'TruckDetails',
  components: {
    TruckForm,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      truck: null,
    }
  },
  async created() {
    this.loading = true
    this.truck = await TruckService.getById(this.id)
    this.loading = false
  },

  methods: {
    async submit(val) {
      try {
        this.loading = true
        const data = await TruckService.updateOne(this.id, val)
        this.loading = false
        if (data) {
          this.truck = data
          this.$router.go(-1)
        }
      } catch (e) {
        this.loading = false
      }
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
        await TruckService.deleteById(this.id)
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style></style>
