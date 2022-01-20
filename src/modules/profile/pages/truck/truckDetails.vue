<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">
          Загружаю...
        </div>
        <app-driver-form
          v-else
          :truck="truck"
          display-delete-btn
          @cancel="cancel"
          @submit="submit"
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
  name: 'TruckDetails',
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
  async created() {
    this.loading = true
    this.truck = await service.getById(this.id)
    this.loading = false
  },

  methods: {
    async submit(val) {
      try {
        this.loading = true
        const data = await service.updateOne(this.id, val)
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
        await service.deleteById(this.id)
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style></style>
