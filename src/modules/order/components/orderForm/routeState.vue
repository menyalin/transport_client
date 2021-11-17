<template>
  <div>
    <div>
      <app-block-title>{{ title }}</app-block-title>
    </div>
    <div class="state-block">
      <div>
        <v-radio-group
          :value="params.status"
          mandatory
          @change="change($event, 'status')"
        >
          <v-radio
            v-for="status in orderStatuses"
            :key="status.value"
            :label="status.text"
            :value="status.value"
          />
        </v-radio-group>
      </div>
      <div>
        <v-checkbox
          :value="params.driverNotified"
          label="Водитель оповещен"
          class="pt-0 mt-1"
          :disabled="!enableConfirm"
          hide-details
          @change="change($event, 'driverNotified')"
        />
        <v-checkbox
          :value="params.clientNotified"
          label="Клиент оповещен"
          class="pt-0 mt-1"
          :disabled="!enableConfirm"
          hide-details
          @change="change($event, 'clientNotified')"
        />
        <v-checkbox
          :value="params.warning"
          label="На контроле"
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
import AppBlockTitle from './blockTitle.vue'
export default {
  name: 'RouteState',
  components: {
    AppBlockTitle,
  },
  model: {
    prop: 'routeState',
    event: 'change',
  },
  props: {
    routeState: Object,
    title: String,
    enableConfirm: Boolean,
  },
  data() {
    return {
      params: {
        status: null,
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
  },
}
</script>
<style scoped>
.state-block {
  display: grid;
  grid-template-columns: 300px;
}
</style>
