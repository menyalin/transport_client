<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-alert
          v-model="error.show"
          dismissible
          type="error"
          transition="scale-transition"
          @change="toggleAlert"
        >
          {{ error.message }}
        </v-alert>
        <app-load-spinner v-if="loading" />
        <app-order-form
          v-else
          :order="item"
          :displayDeleteBtn="
            !!id &&
              $store.getters.hasPermission('order:delete') &&
              item.state.status === 'needGet'
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
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import service from '../../services/order.service'
import AppOrderForm from '../../components/orderForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'
import socket from '@/socket'

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
    if (this.id) {
      socket.on(`order:${this.id}:finalPriceUpdated`, ({ finalPrices }) => {
        this.item = Object.assign({}, this.item, { finalPrices })
      })
    }
    if (this.startDate) {
      this.item = {
        startPositionDate: this.startDate,
        confirmedCrew: {
          truck: this.truckId,
        },
        route: [
          {
            type: 'loading',
            plannedDate: new Date(this.startDate).toISOString(),
          },
          { type: 'unloading' },
        ],
      }
    }
  },
}
</script>
<style></style>
