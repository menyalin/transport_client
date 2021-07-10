<template>
  <v-container>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю...</div>
        <app-driver-form
          v-else
          @cancel="cancel"
          :driver="driver"
          @submit="submit"
          displayDeleteBtn
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppDriverForm from '@/modules/profile/components/driverForm'
import driverService from '../../services/driver.service'
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

  methods: {
    async submit(val) {
      this.loading = true
      this.driver = await driverService.updateOne(this.id, val)
      this.loading = false
      this.$router.go(-1)
    },
    cancel() {
      this.$router.push({ name: 'DriverList' })
    },
    async deleteHandler() {
      this.loading = true
      await driverService.deleteById(this.id)
      this.loading = false
      this.$router.go(-1)
    },
  },
  async created() {
    this.loading = true
    this.driver = await driverService.getById(this.id)
    this.loading = false
  },
}
</script>
<style></style>
