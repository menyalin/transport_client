<template>
  <v-data-table
    :headers="headers"
    dense
    :loading="loading"
    :items="items"
    fixed-header
    height="65vh"
    multi-sort
    :serverItemsLength="statisticData.count"
    :footer-props="{
      'items-per-page-options': [50, 100, 200],
    }"
    :options="listOptions"
    @update:options="updateListOptionsHandler"
    @dblclick:row="dblClickRow"
  >
    <template #[`item.state.status`]="{ item }">
      {{ getStatusText(item.state.status) }}
    </template>

    <template #[`item.truck`]="{ item }">
      {{
        !!item.confirmedCrew &&
        !!item.confirmedCrew.truck &&
        trucksMap.has(item.confirmedCrew.truck)
          ? trucksMap.get(item.confirmedCrew.truck).regNum
          : '-'
      }}
    </template>
    <template #[`item.trailer`]="{ item }">
      {{
        !!item.confirmedCrew &&
        !!item.confirmedCrew.trailer &&
        trucksMap.has(item.confirmedCrew.trailer)
          ? trucksMap.get(item.confirmedCrew.trailer).regNum
          : ''
      }}
    </template>
    <template #[`item.client.client`]="{ item }">
      {{
        !!item.client && partnersMap.has(item.client.client)
          ? partnersMap.get(item.client.client).name
          : '-'
      }}
    </template>
    <template #[`item.analytics.type`]="{ item }">
      {{
        !!item.analytics &&
        !!item.analytics.type &&
        orderAnalyticTypeMap.has(item.analytics.type)
          ? orderAnalyticTypeMap.get(item.analytics.type)
          : ''
      }}
    </template>
    <template #[`item.docStatus`]="{ item }">
      <b :style="{ color: item.docStatus.fontColor }">
        {{ item.docStatus.text }}
      </b>
    </template>
    <template #[`item.docsGetted`]="{ item }">
      <v-simple-checkbox
        :value="item.docsState ? item.docsState.getted : false"
        :disabled="!!item.docs && !!item.docs.length"
        color="primary"
        @input="setDocStateStatus($event, item._id)"
      />
    </template>
    <template #footer.prepend>
      <order-list-footer-details
        :total="statisticData.count"
        :accepted="statisticData.acceptedDocs"
        :needFix="statisticData.needFixDocs"
        :onCheck="statisticData.onCheckDocs"
        :missing="statisticData.missingDocs"
      />
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn
        color="primary"
        icon
        small
        dark
        @click="$emit('openDocsDialog', item._id)"
      >
        <v-icon small> mdi-file-document-multiple </v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import store from '@/store'
import router from '@/router'
import { computed } from 'vue'
import { OrderService } from '@/shared/services'
import { OrderListFooterDetails } from '@/shared/ui'

export default {
  name: 'OrdersTable',
  components: {
    OrderListFooterDetails,
  },
  props: {
    headers: { type: Array, required: true },
    loading: { type: Boolean, required: true },
    items: Array,
    count: Number,
    statisticData: Object,
    listOptions: Object,
  },
  setup(_props, ctx) {
    const orderAnalyticTypeMap = computed(
      () => store.getters.orderAnalyticTypesMap
    )

    const partnersMap = computed(() => store.getters.partnersMap)

    const trucksMap = computed(() => store.getters.trucksMap)

    function getStatusText(status) {
      return store.getters.orderStatusesMap.get(status) || ' --- '
    }

    function dblClickRow(_, { item }) {
      if (item) router.push(`/orders/${item._id}`)
    }

    function updateListOptionsHandler(options) {
      ctx.emit('update:listOptions', { ...options })
    }

    async function setDocStateStatus(val, id) {
      await OrderService.setDocState(id, val)
    }

    return {
      orderAnalyticTypeMap,
      dblClickRow,
      partnersMap,
      trucksMap,
      updateListOptionsHandler,
      getStatusText,
      setDocStateStatus,
    }
  },
}
</script>
