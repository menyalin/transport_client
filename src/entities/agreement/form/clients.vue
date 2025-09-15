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
          <v-list-item-title>
            {{
              partnersMap.has(item)
                ? partnersMap.get(item).name
                : 'запись недоступна'
            }}
          </v-list-item-title>
          
          <v-list-item-action>
            <v-icon size="small" color="error" @click="deleteClient(item)">
              mdi-delete
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-autocomplete
        v-if="!isVisibleBtn"
        :items="clientItems"
        onlyClients
        @update:model-value="addClient"
      />
      <v-btn v-else size="small" variant="text" color="primary" @click="showAutocomplete">
        Добавить клиента
      </v-btn>
    </div>
  </div>
</template>
<script>
import { computed } from 'vue'

import store from '@/store/index'

export default {
  name: 'AgreementClientList',
  model: {
    prop: 'clientList',
    event: 'change',
  },
  props: {
    clientList: {
      type: Array,
    },
  },
  setup() {
    const clientItems = computed(() => {
      return store.getters.partners
        .filter((i) => i.isClient)
        .map((i) => ({ value: i._id, text: i.name }))
    })
    return { clientItems }
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
      const res = await this.$dialog.confirm('Вы уверены? ')
      if (!res) return null
      this.selectedClients = this.selectedClients.filter((item) => item !== id)
      this.$emit('change', this.selectedClients)
    },
  },
}
</script>
<style></style>
