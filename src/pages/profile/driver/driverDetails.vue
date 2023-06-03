<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю...</div>
        <app-driver-form
          v-else
          :driver="driver"
          :displayDeleteBtn="$store.getters.hasPermission('driver:delete')"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppDriverForm from '@/modules/profile/components/driverForm'
import { DriverService } from '@/shared/services'
export default {
  name: 'DriverDetails',
  components: {
    AppDriverForm,
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
      driver: null,
    }
  },
  async created() {
    this.loading = true
    this.driver = await DriverService.getById(this.id)
    this.loading = false
  },

  methods: {
    async submit(val) {
      this.loading = true
      this.driver = await DriverService.updateOne(this.id, val)
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
        await DriverService.deleteById(this.id)
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style></style>
