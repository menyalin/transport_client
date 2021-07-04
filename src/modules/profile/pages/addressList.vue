<template>
  <v-container>
    <v-row>
      <v-col>
        <app-buttons-panel
          panelType="list"
          @submit="createAddress"
          @refresh="refresh"
          :disabledRefresh="!directoriesProfile"
        />
        <v-data-table
          :headers="headers"
          :items="addresses"
          :loading="loading"
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
  name: 'AddressList',
  components: {
    AppButtonsPanel,
  },
  data: () => ({
    headers: [
      { value: 'shortName', text: 'Сокращенный адрес' },
      { value: 'name', text: 'Адрес' },
      { value: 'note', text: 'Примечание' },
      { value: 'label', text: 'Метки' },
      { value: 'isShipmentPlace', text: 'Погрузка' },
      { value: 'isDeliveryPlace', text: 'Разгрузка' },
      { value: 'geo', text: 'Координаты' },
    ],
  }),
  methods: {
    createAddress() {
      this.$router.push({ name: 'createAddress' })
    },
    refresh() {
      this.$store.dispatch('getAddresses', true)
    },
  },
  computed: {
    ...mapGetters(['addresses', 'loading', 'directoriesProfile']),
  },
  created() {
    this.$store.dispatch('getAddresses')
  },
}
</script>
<style></style>
