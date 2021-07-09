<template>
  <v-container>
    <v-row>
      <v-col>
        <app-buttons-panel
          panelType="list"
          @submit="create"
          @refresh="refresh"
          :disabledRefresh="!directoriesProfile"
        />
        <v-data-table
          :headers="headers"
          :items="trucks"
          :loading="loading"
          @dblclick:row="dblClickRow"
          dense
          :footer-props="{
            'items-per-page-options': [50, 100, 200],
          }"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import AppButtonsPanel from '@/modules/common/components/buttonsPanel'
import { mapGetters } from 'vuex'
export default {
  name: 'TruckList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    headers: [
      { value: 'name', text: 'Имя' },
      { value: 'model', text: 'model' },
      { value: 'type', text: 'Тип' },
    ],
  }),
  methods: {
    create() {
      this.$router.push({ name: 'TruckCreate' })
    },
    refresh() {
      this.$store.dispatch('getTrucks', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`trucks/${item._id}`)
    },
  },
  computed: {
    ...mapGetters(['trucks', 'loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getTrucks')
  },
}
</script>
<style></style>
