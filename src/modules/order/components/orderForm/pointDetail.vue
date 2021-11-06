<template>
  <div class="pa-3">
    <v-select
      v-model="tmpPoint.type"
      :items="pointTypes"
      dense
      hide-details
      outlined
      @change="change"
    />
    <app-address-autocomplete
      v-model="tmpPoint.address"
      :pointType="tmpPoint.type"
      :disabled="!tmpPoint.type"
      dense
      outlined
      hide-details
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AppAddressAutocomplete from '@/modules/common/components/addressAutocomplete'

export default {
  name: 'PointDetail',
  components: {
    AppAddressAutocomplete,
  },
  props: {
    point: {
      type: Object,
    },
  },
  data() {
    return {
      tmpPoint: {
        type: null,
        address: null,
      },
    }
  },
  computed: {
    ...mapGetters(['pointTypes']),
  },
  watch: {
    // tmpPoint: {
    //   deep: true,
    //   handler: function (val) {
    //     console.log('change point', val)
    //   },
    // },

    point: {
      immediate: true,
      handler: function (val) {
        if (!!val) {
          this.setFields(val)
        }
      },
    },
  },

  methods: {
    setFields(point) {
      this.tmpPoint = point
    },
    change() {
      this.$emit('changePoint', { ...this.tmpPoint })
    },
  },
}
</script>
<style></style>
