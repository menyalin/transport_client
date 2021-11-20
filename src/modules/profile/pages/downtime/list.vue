<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          @submit="create"
          @refresh="refresh"
        />
        <v-data-table
          :headers="headers"
          :items="downtimes"
          :loading="loading"
          height="72vh"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
          @dblclick:row="dblClickRow"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'
export default {
  name: 'DowntimeList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    headers: [
      { value: '_id', text: 'id' },
      { value: 'title', text: 'title' },
    ],
  }),
  computed: {
    ...mapGetters(['downtimes', 'loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getDowntimes')
  },
  methods: {
    create() {
      this.$router.push({ name: 'DowntimeCreate' })
    },
    refresh() {
      this.$store.dispatch('getDowntimes', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`downtimes/${item._id}`)
    },
  },
}
</script>
<style></style>
