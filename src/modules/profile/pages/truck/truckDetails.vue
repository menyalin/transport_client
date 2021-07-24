<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">Загружаю...</div>
        <app-driver-form
          v-else
          @cancel="cancel"
          :truck="truck"
          @submit="submit"
          displayDeleteBtn
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppDriverForm from '@/modules/profile/components/truckForm'
import service from '../../services/truck.service'
export default {
  name: 'truckDetails',
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
      truck: null,
    }
  },

  methods: {
    async submit(val) {
      try {
        this.loading = true
        this.truck = await service.updateOne(this.id, val)
        this.loading = false
        this.$router.go(-1)
      } catch (e) {
        this.loading = false
        this.$store.commit('setError', e.message)
      }
    },
    cancel() {
      this.$router.push({ name: 'TruckList' })
    },
    async deleteHandler() {
      this.loading = true
      await service.deleteById(this.id)
      this.loading = false
      this.$router.go(-1)
    },
  },
  async created() {
    this.loading = true
    this.truck = await service.getById(this.id)
    this.loading = false
  },
}
</script>
<style></style>
