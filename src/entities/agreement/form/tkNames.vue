<template>
  <div class="my-2">
    <div class="text-h6">
      Перевозчики:
      <div v-if="!list || !list.length" class="text-caption pl-6 my-2">
        нет данных
      </div>
      <v-list v-else>
        <v-list-item v-for="item in list" :key="item">
          <v-list-item-content>
            <v-list-item-title>
              {{
                itemsMap.has(item) ? itemsMap.get(item).name : 'запись удалена'
              }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon small color="error" @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-select
        v-if="!isVisibleBtn"
        label="Перевозчик"
        :items="itemsForSelect"
        @change="addItem"
      />
      <v-btn v-else small text color="primary" @click="showAutocomplete">
        Добавить перевозчика
      </v-btn>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AgreementTkNameList',

  model: {
    prop: 'list',
    event: 'change',
  },
  props: {
    list: {
      type: Array,
    },
  },
  data() {
    return {
      selectedItems: [],
      isVisibleBtn: true,
    }
  },
  computed: {
    itemsMap() {
      return this.$store.getters.tkNamesMap
    },
    itemsForSelect() {
      return this.$store.getters.tkNamesForSelect.filter((i) => i.outsource)
    },
  },
  watch: {
    list: {
      immediate: true,
      handler: function (val) {
        if (!!val && val.length) this.selectedItems = val
      },
    },
  },
  methods: {
    showAutocomplete() {
      this.isVisibleBtn = false
    },

    addItem(val) {
      if (val && !this.selectedItems.includes(val)) {
        this.selectedItems.push(val)
        this.$emit('change', this.selectedItems)
      }
      this.isVisibleBtn = true
    },
    async deleteItem(id) {
      if (!id) return null
      const res = await this.$confirm('Вы уверены? ')
      if (!res) return null
      this.selectedItems = this.selectedItems.filter((item) => item !== id)
      this.$emit('change', this.selectedItems)
    },
  },
}
</script>
<style scoped></style>
