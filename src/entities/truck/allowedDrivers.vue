<template>
  <div class="mb-6">
    <div class="text-subtitle">
      Водители:
      <div v-if="!driverList || !driverList.length" class="text-caption pl-6 my-2">нет данных</div>
      <v-list v-else>
        <v-list-item v-for="item in driverList" :key="item.driver">
          <template #prepend>
            <v-avatar :style="{ cursor: 'pointer' }" @click="changeDriverState(item)">
              <v-icon v-if="item.isPermanent" color="green">mdi-account-lock-outline</v-icon>
              <v-icon v-else color="orange">mdi-account-clock-outline</v-icon>
            </v-avatar>
          </template>

          <v-list-item-title>
            {{ driversMap.has(item.driver) ? driversMap.get(item.driver).fullName : 'запись удалена' }}
          </v-list-item-title>

          <v-list-item-action>
            <v-icon size="small" color="error" @click="deleteDriver(item.driver)">mdi-delete</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-autocomplete
        v-if="!isVisibleBtn"
        :items="driversForSelect"
        itemTitle="fullName"
        itemValue="_id"
        @update:model-value="changeDriver"
      />
      <v-btn
v-else
size="small" variant="text" color="primary"
@click="addDriver"
>Добавить водителя</v-btn>
    </div>
  </div>
</template>
<script>
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
    async changeDriverState(driver) {
      const res = await this.$confirm('Вы уверены? ')
      if (res) driver.isPermanent = !driver.isPermanent
    },
    changeDriver(val) {
      if (val && this.selectedDrivers.findIndex(i => i.driver === val) === -1) {
        this.selectedDrivers.push({ driver: val, isPermanent: false })
        this.$emit('change', this.selectedDrivers)
      }
      this.isVisibleBtn = true
    },
    async deleteDriver(id) {
      if (!id) return null
      const res = await this.$confirm('Вы уверены? ')
      if (!res) return null
      this.selectedDrivers = this.selectedDrivers.filter(item => item.driver !== id)
      this.$emit('change', this.selectedDrivers)
    },
  },
}
</script>
<style></style>
