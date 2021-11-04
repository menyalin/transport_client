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
          :items="partners"
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
  name: 'TkNameList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    headers: [
      { value: 'name', text: 'Наименование' },
      { value: 'inn', text: 'ИНН' },
    ],
  }),
  computed: {
    ...mapGetters(['partners', 'loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getPartners')
  },
  methods: {
    create() {
      this.$router.push({ name: 'PartnerCreate' })
    },
    refresh() {
      this.$store.dispatch('getPartners', true)
    },
    dblClickRow(_, { item }) {
      this.$router.push(`partners/${item._id}`)
    },
  },
}
</script>
<style></style>
