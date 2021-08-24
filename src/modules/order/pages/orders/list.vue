<template>
  <div>
    <app-buttons-panel
      panel-type="list"
      :disabled-refresh="!directoriesProfile"
      @submit="create"
      @refresh="refresh"
    />
    <div class="filter-wrapper">
      <app-date-time-input
        hidePrependIcon
        hideTimeInput
        label="Начало периода"
      />
      <app-date-time-input
        hidePrependIcon
        hideTimeInput
        label="Конец периода"
      />
    </div>
    <div class="table-wrapper">
      <v-data-table
        :headers="headers"
        dense
        fixed-header
        height="72vh"
        :footer-props="{
          'items-per-page-options': [50, 100, 200],
        }"
        :loading="loading"
      />
    </div>
  </div>
</template>
<script>
import AppDateTimeInput from '@/modules/common/components/dateTimeInput'
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'

export default {
  name: 'ListOrder',
  components: {
    AppDateTimeInput,
    AppButtonsPanel,
  },
  data: () => ({
    loading: false,
    headers: [],
  }),
  computed: {
    ...mapGetters(['directoriesProfile']),
  },
  methods: {
    create() {
      this.$router.push({ name: 'CreateOrder' })
    },
    refresh() {
      console.log('refresh')
    },
  },
}
</script>
<style scoped>
.filter-wrapper {
  display: flex;
  flex-direction: row;
}
.filter-wrapper > * {
  padding: 0px 10px;
  width: 150px;
}
</style>
