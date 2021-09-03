<template>
  <div class="mb-6">
    <div class="text-subtitle">
      Водители:
      <div
        v-if="!driverList || !driverList.length"
        class="text-caption pl-6 my-2"
      >
        нет данных
      </div>
      <v-list
        v-else
        dense
      >
        <v-list-item
          v-for="id in driverList"
          :key="id"
        >
          <v-list-item-title>
            {{ driversMap.get(id).fullName }}
          </v-list-item-title>
          <v-list-item-action>
            <v-icon
              small
              color="error"
              @click="deleteDriver(id)"
            >
              mdi-delete
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-autocomplete
        v-if="!isVisibleBtn"
        :items="driversForSelect"
        item-text="fullName"
        item-value="_id"
        @change="changeDriver"
      />
      <v-btn
        v-else
        small
        text
        color="primary"
        @click="addDriver"
      >
        Добавить водителя
      </v-btn>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AllowedDrivers',
  model: {
    prop: 'driverList',
    event: 'change',
  },
  props: {
    driverList: {
      type: Array,
    },
    tkName: {
      type: [String, Object],
      required: true,
    },
  },
  data() {
    return {
      selectedDrivers: [],
      isVisibleBtn: true,
    }
  },
  computed: {
    driversMap() {
      return this.$store.getters.driversMap
    },
    tkNameId() {
      if (!!this.tkName && typeof this.tkName === 'string') return this.tkName
      else return this.tkName._id
    },
    driversForSelect() {
      return this.$store.getters.driversForSelect(this.tkNameId)
    },
  },
  watch: {
    driverList: {
      immediate: true,
      handler: function (val) {
        if (!!val && val.length) this.selectedDrivers = val
      },
    },
  },
  methods: {
    addDriver() {
      this.isVisibleBtn = false
    },
    changeDriver(val) {
      if (val && this.selectedDrivers.findIndex((i) => i === val) === -1) {
        this.selectedDrivers.push(val)
        this.$emit('change', this.selectedDrivers)
      }
      this.isVisibleBtn = true
    },
    deleteDriver(id) {
      if (!id) return
      this.selectedDrivers = this.selectedDrivers.filter((item) => item !== id)
      this.$emit('change', this.selectedDrivers)
    },
  },
}
</script>
<style></style>
