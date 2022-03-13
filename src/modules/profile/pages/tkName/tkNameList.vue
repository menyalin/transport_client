<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <app-buttons-panel
          panel-type="list"
          :disabled-refresh="!directoriesProfile"
          :disabledSubmit="!$store.getters.hasPermission('tkName:write')"
          @submit="create"
          @refresh="refresh"
        />
        <v-data-table
          :headers="headers"
          :items="tkNames"
          :loading="loading"
          fixed-header
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
  name: 'TkNameList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    headers: [{ value: 'name', text: 'Перевозчики' }],
  }),
  computed: {
    ...mapGetters(['tkNames', 'loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getTkNames')
  },
  methods: {
    create() {
      this.$router.push({ name: 'TkNameCreate' })
    },
    refresh() {
      this.$store.dispatch('getTkNames', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`tk_names/${item._id}`)
    },
  },
}
</script>
<style></style>
