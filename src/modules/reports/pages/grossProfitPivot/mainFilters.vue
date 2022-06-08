<template>
  <div class="main-filter-wrapper">
    <h5>Основной отбор</h5>
    <div class="filter-row mt-3">
      <v-select
        v-model="tmpFilters.clients.cond"
        label="Сравнение"
        :items="condItems"
        dense
        outlined
        hide-details
        :style="{ 'max-width': '180px' }"
      />
      <v-autocomplete
        v-model="tmpFilters.clients.values"
        label="Клиенты"
        :items="clients"
        item-value="_id"
        item-text="name"
        multiple
        clearable
        dense
        outlined
        hide-details
        :style="{ 'max-width': '400px' }"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'MainFilters',
  model: {
    prop: 'filters',
    event: 'change',
  },
  props: {
    filters: { type: Object },
  },
  data() {
    return {
      condItems: [
        { value: 'in', text: 'Содержит' },
        { value: 'notIn', text: 'Не содержит' },
      ],
      tmpFilters: {
        clients: {
          values: [],
          cond: 'in',
        },
      },
    }
  },
  computed: {
    clients() {
      return this.$store.getters.partners
        .filter((i) => i.isClient)
        .sort((a, b) => a.name - b.name)
    },
  },
  watch: {
    filters: {
      immediate: true,
      deep: true,
      handler: function (val) {
        this.tmpFilters = val
      },
    },

    tmpFilters: {
      deep: true,
      handler: function (val) {
        this.$emit('change', val)
      },
    },
  },
}
</script>
<style scoped>
.filter-row {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
