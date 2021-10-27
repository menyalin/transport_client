<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <div v-if="loading">
          Загружаю...
        </div>
        <app-order-form
          v-else
          :order="order"
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
import service from '../../services/order.service'
import AppOrderForm from '../../components/orderForm'
export default {
  name: 'DetailsOrder',
  components: {
    AppOrderForm,
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
      order: null,
    }
  },
  async created() {
    this.loading = true
    this.order = await service.getById(this.id)
    this.loading = false
  },

  methods: {
    async submit(val) {
      this.loading = true
      this.order = await service.updateOne({ id: this.id, body: val })
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
        await service.deleteById(this.id)
        this.loading = false
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style></style>
