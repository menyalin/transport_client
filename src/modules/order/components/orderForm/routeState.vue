<template>
  <div>
    <div>
      <BlockTitle>{{ title }}</BlockTitle>
    </div>
    <div class="state-block">
      <div>
        <v-radio-group
          :value="params.status"
          mandatory
          :readonly="readonly"
          @change="change($event, 'status')"
        >
          <v-radio
            v-for="status in orderStatuses"
            :key="status.value"
            :label="status.text"
            :disabled="disabledStatus(status)"
            :value="status.value"
          />
        </v-radio-group>
      </div>
      <div>
        <v-checkbox
          :value="params.driverNotified"
          :readonly="readonly"
          label="Водитель оповещен"
          class="pt-0 mt-1"
          :disabled="!enableConfirm || disabledNotification"
          hide-details
          @change="change($event, 'driverNotified')"
        />
        <v-checkbox
          :value="params.clientNotified"
          label="Клиент оповещен"
          :readonly="readonly"
          class="pt-0 mt-1"
          :disabled="!enableConfirm || disabledNotification"
          hide-details
          @change="change($event, 'clientNotified')"
        />
        <v-checkbox
          :value="params.warning"
          label="На контроле"
          :readonly="readonly"
          class="pt-0 mt-3 mb-2"
          hide-details
          @change="change($event, 'warning')"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { BlockTitle } from '@/entities/order'
export default {
  name: 'RouteState',
  components: {
    BlockTitle,
  },
  model: {
    prop: 'routeState',
    event: 'change',
  },
  props: {
    routeState: Object,
    title: String,
    enableConfirm: Boolean,
    routeCompleted: Boolean,
    enableRefuse: Boolean,
    isExistFirstArrivalDate: Boolean,
    isValidGrade: Boolean,
    readonly: Boolean,
  },
  data() {
    return {
      params: {
        status: 'needGet',
        warning: false,
        driverNotified: false,
        clientNotified: false,
      },
    }
  },
  computed: {
    ...mapGetters([]),
    orderStatuses() {
      return this.$store.getters.orderStatuses
    },
    disabledNotification() {
      return !['getted'].includes(this.params.status)
    },
  },
  watch: {
    routeState: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.$nextTick(() => {
            this.params.status = val.status
            this.params.warning = val.warning
            this.params.driverNotified = val.driverNotified
            this.params.clientNotified = val.clientNotified
          })
        }
      },
    },
  },
  methods: {
    change(val, field) {
      this.params[field] = val
      this.$emit('change', this.params)
    },
    disabledStatus(status) {
      if (this.params.status === 'needGet' && this.enableRefuse)
        return ![
          'needGet',
          'getted',
          'notСonfirmedByClient',
          'weRefused',
        ].includes(status.value)
      if (this.params.status === 'needGet' && !this.enableRefuse)
        return !['needGet', 'getted'].includes(status.value)
      if (
        this.params.status === 'getted' &&
        !this.params.driverNotified &&
        !this.params.clientNotified &&
        this.enableRefuse
      )
        return !['needGet', 'getted', 'weRefused', 'clientRefused'].includes(
          status.value
        )
      if (
        this.params.status === 'getted' &&
        !this.params.driverNotified &&
        !this.params.clientNotified &&
        !this.enableRefuse
      )
        return !['needGet', 'getted'].includes(status.value)

      if (
        this.params.status === 'getted' &&
        this.params.driverNotified &&
        this.params.clientNotified
      )
        return !['getted', 'inProgress'].includes(status.value)

      if (
        this.params.status === 'inProgress' &&
        !this.routeCompleted &&
        !this.isExistFirstArrivalDate
      )
        return !['inProgress', 'getted'].includes(status.value)

      if (
        this.params.status === 'inProgress' &&
        !this.routeCompleted &&
        this.isExistFirstArrivalDate
      )
        return !['inProgress'].includes(status.value)

      if (
        this.params.status === 'inProgress' &&
        this.routeCompleted &&
        !this.isValidGrade
      )
        return !['inProgress'].includes(status.value)

      if (
        this.params.status === 'inProgress' &&
        this.routeCompleted &&
        this.isValidGrade
      )
        return !['completed', 'inProgress'].includes(status.value)

      if (this.params.status === 'completed')
        return !['completed', 'inProgress'].includes(status.value)

      if (this.params.status === 'weRefused')
        return !['getted', 'weRefused'].includes(status.value)

      if (this.params.status === 'clientRefused')
        return !['getted', 'clientRefused'].includes(status.value)

      if (this.params.status === 'notСonfirmedByClient')
        return !['needGet', 'getted', 'notСonfirmedByClient'].includes(
          status.value
        )
      return true
    },
  },
}
</script>
<style scoped>
.state-block {
  display: grid;
  grid-template-columns: 300px;
}
</style>
