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
import socket from '@/socket'
import { OrderService } from '@/shared/services'
import AppOrderForm from '../../components/orderForm'
import AppLoadSpinner from '@/modules/common/components/appLoadSpinner'

export default {
  name: 'DetailsOrder',
  components: {
    AppOrderForm,
    AppLoadSpinner,
  },

  props: {
    id: String,
    truckId: String,
    startDate: String,
  },
  data() {
    return {
      service: OrderService,
      item: null,
      loading: false,
      tmpVal: null,
      error: {
        message: null,
        show: false,
      },
    }
  },
  watch: {
    id: {
      immediate: true,
      handler: async function (newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.loading = true
          this.item = await this.service.getById(newVal)
          this.loading = false
        }
      },
    },
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
    toggleAlert() {
      this.error = {
        show: false,
        message: null,
      }
    },
    async submit(val, saveOnly) {
      this.tmpVal = val
      try {
        this.loading = true
        if (this.item._id) {
          this.item = await this.service.updateOne(this.item._id, val)
        } else this.item = await this.service.create(val)
        this.loading = false
        this.tmpVal = null
        if (!saveOnly) this.$router.go(-1)
      } catch (e) {
        this.loading = false
        this.item = this.tmpVal
        if (e.response.status === 400 || e.response.status === 403) {
          this.error.message = e.response.data
          this.error.show = true
        }
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
        try {
          this.loading = true
          await this.service.deleteById(this.id)
          this.loading = false
          this.$router.go(-1)
        } catch (e) {
          this.loading = false
          this.$store.commit('setError', e.message)
        }
      }
    },
  },
}
</script>
<style></style>
