<template>
  <div class="mb-6">
    <div class="text-subtitle">
      Клиенты:
      <div
        v-if="!clientList || !clientList.length"
        class="text-caption pl-6 my-2"
      >
        нет данных
      </div>
      <v-list v-else>
        <v-list-item
          v-for="item in clientList"
          :key="item"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{
                partnersMap.has(item)
                  ? driversMap.get(item).name
                  : 'запись удалена'
              }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon
              small
              color="error"
              @click="deleteDriver(item)"
            >
              mdi-delete
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <app-partner-autocomplete
        v-if="!isVisibleBtn"
        @change="addPartner"
      />
      <v-btn
        v-else
        small
        text
        color="primary"
        @click="showAutocomplete"
      >
        Добавить клиента
      </v-btn>
    </div>
  </div>
</template>
<script>
import AppPartnerAutocomplete from '@/modules/common/components/partnerAutocomplete'

export default {
  name: 'AgreementClientList',
  components: {
    AppPartnerAutocomplete,
  },
  model: {
    prop: 'clientList',
    event: 'change',
  },
  props: {},
  data() {
    return {
      selectedClients: [],
      isVisibleBtn: true,
    }
  },
  computed: {},
  watch: {
    clientList: {
      immediate: true,
      handler: function (val) {
        if (!!val && val.length) this.selectedClients = val
      },
    },
  },
  methods: {
    showAutocomplete() {
      this.isVisibleBtn = false
    },

    addPartner(val) {
      if (
        val &&
        this.selectedDrivers.findIndex((i) => i.driver === val) === -1
      ) {
        this.selectedDrivers.push({ driver: val, isPermanent: false })
        this.$emit('change', this.selectedDrivers)
      }
      this.isVisibleBtn = true
    },
    async deletePartner(id) {
      if (!id) return null
      const res = await this.$confirm('Вы уверены? ')
      if (!res) return null
      this.selectedPartners = this.selectedPartners.filter(
        (item) => item !== id
      )
      this.$emit('change', this.selectedPartners)
    },
  },
}
</script>
<style></style>
