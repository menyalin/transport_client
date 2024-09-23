<template>
  <v-data-table
    :items="filteredItems"
    :headers="headers"
    :itemsPerPage="-1"
    :search="listSettings.searchStr"
  >
    <template #top>
      <div class="list-settings">
        <v-select
          label="Состояние"
          :items="isActiveComparatorItems"
          v-model="listSettings.isActive"
          :style="{ 'max-width': '250px' }"
        />
        <v-text-field
          v-model="listSettings.searchStr"
          label="Поиск"
          :style="{ 'max-width': '350px' }"
        />
      </div>
    </template>

    <template #[`item.usePlannedDate`]="{ item }">
      <v-icon v-if="item.usePlannedDate" color="green">mdi-check</v-icon>
      <v-icon v-else color="black">mdi-minus</v-icon>
    </template>
    <template #[`item.isActive`]="{ item }">
      <div
        @click="switchStatus(item._id, item.isActive)"
        :style="{ cursor: 'pointer' }"
      >
        <v-icon v-if="item.isActive" color="green">mdi-check</v-icon>
        <v-icon v-else color="black">mdi-minus</v-icon>
      </div>
    </template>
    <template #[`item.active`]="{ item }">
      <div :style="{ display: 'flex', alignItems: 'center', gap: '15px' }">
        <v-icon small color="green" @click="editHandler(item._id)">
          mdi-pencil
        </v-icon>
        <v-icon small color="red" @click="removeItem(item._id)">
          mdi-delete
        </v-icon>
      </div>
    </template>
  </v-data-table>
</template>
<script>
import { useListData } from './model'

import { headers } from './listHeaders'

export default {
  name: 'NotificationListFeature',
  props: {
    partnerId: String,
    items: {
      type: Array,
    },
  },
  setup(props, ctx) {
    const {
      deleteHandler,
      editHandler,
      switchStatusHandler,
      filteredItems,
      isActiveComparatorItems,
      listSettings,
    } = useListData(props, ctx)
    return {
      headers,
      deleteHandler,
      editHandler,
      switchStatusHandler,
      filteredItems,
      isActiveComparatorItems,
      listSettings,
    }
  },
  methods: {
    async switchStatus(id, currentStatus) {
      if (!currentStatus) this.switchStatusHandler(id)
      else {
        const res = await this.$confirm(
          'Уверены? Выключение уведомления отменит созданные задачи'
        )
        if (!res) return
        this.switchStatusHandler(id)
      }
    },
    async removeItem(id) {
      const res = await this.$confirm('Вы уверены?')
      if (res) this.deleteHandler(id)
    },
  },
}
</script>
<style scoped>
.notification_list_wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: flex-start;
}
.list-settings {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
}
</style>
