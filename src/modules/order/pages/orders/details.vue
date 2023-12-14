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
          :displayDeleteBtn="showDeleteBtn"
          :loading="loading"
          @cancel="cancel"
          @submit="submit($event)"
          @save="submit($event, true)"
          @delete="deleteHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import pageDetailsMixin from '@/modules/common/mixins/pageDetailsMixin'
import { OrderService } from '@/shared/services'
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
      service: OrderService,
    }
  },
  computed: {
    showDeleteBtn() {
      return (
        !!this.id &&
        this.$store.getters.hasPermission('order:delete') &&
        this.item?.state?.status === 'needGet'
      )
    },
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
  methods: {
    async submit(val, saveOnly) {
      this.tmpVal = val
      try {
        this.loading = true
        if (this.id) {
          this.item = await this.service.updateOne(this.id, val)
        } else this.item = await this.service.create(val)
        this.loading = false
        this.tmpVal = null
        if (this.openInModal) this.$emit('submit', this.item._id)
        else if (!saveOnly) this.$router.go(-1)
      } catch (e) {
        this.loading = false
        this.item = this.tmpVal
        if (e.response.status === 400 || e.response.status === 403) {
          this.error.message = e.response.data
          this.error.show = true
        }
      }
    },
  },
}
</script>
<style></style>
