<template>
  <div class="my-2">
    <div class="text-h6">
      Клиенты:
      <div
        v-if="!clientList || !clientList.length"
        class="text-caption pl-6 my-2"
      >
        нет данных
      </div>
      <v-list v-else>
        <v-list-item v-for="item in clientList" :key="item">
          <v-list-item-content>
            <v-list-item-title>
              {{
                partnersMap.has(item)
                  ? partnersMap.get(item).name
                  : 'запись удалена'
              }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon small color="error" @click="deleteClient(item)">
              mdi-delete
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <app-partner-autocomplete
        v-if="!isVisibleBtn"
        onlyClients
        @change="addClient"
      />
      <v-btn v-else small text color="primary" @click="showAutocomplete">
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
  props: {
    clientList: {
      type: Array,
    },
  },
  data() {
    return {
      selectedClients: [],
      isVisibleBtn: true,
    }
  },
  computed: {
    partnersMap() {
      return this.$store.getters.partnersMap
    },
  },
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

    addClient(val) {
      if (val && !this.selectedClients.includes(val)) {
        this.selectedClients.push(val)
        this.$emit('change', this.selectedClients)
      }
      this.isVisibleBtn = true
    },
    async deleteClient(id) {
      if (!id) return null
      const res = await this.$confirm('Вы уверены? ')
      if (!res) return null
      this.selectedClients = this.selectedClients.filter((item) => item !== id)
      this.$emit('change', this.selectedClients)
    },
  },
}
</script>
<style></style>
