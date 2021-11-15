<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-load-spinner v-if="loading" />
        <app-order-form
          v-else
          :order="item"
          :displayDeleteBtn="!!id"
          @cancel="cancel"
          @submit="submit"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import service from '../../services/order.service'
import AppOrderForm from '../../components/orderForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'

export default {
  name: 'DetailsOrder',
  components: {
    AppOrderForm,
    AppLoadSpinner,
  },
  mixins: [pageDetailsMixin],
  props: {
    truckId: String,
    startDate: String,
  },
  data() {
    return {
      service: service,
    }
  },
  created() {
    if (this.truckId && this.startDate) {
      this.item = {
        startPositionDate: this.startDate,
        confirmedCrew: {
          truck: this.truckId,
        },
        route: [
          {
            type: 'loading',
            plannedDate: this.startDate,
          },
          { type: 'unloading' },
        ],
      }
    }
  },
}
</script>
<style></style>
