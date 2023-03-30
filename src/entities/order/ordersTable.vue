<template>
  <v-data-table
    :value="selected"
    :headers="headers"
    dense
    color="primary"
    :loading="loading"
    :items="preparedItems"
    :showSelect="showSelect"
    item-key="_id"
    fixed-header
    checkbox-color="primary"
    height="65vh"
    multi-sort
    :serverItemsLength="
      statisticData && !!statisticData.count ? statisticData.count : undefined
    "
    :footer-props="{
      'items-per-page-options': [50, 100, 200],
    }"
    :options="listOptions"
    @update:options="updateListOptionsHandler"
    @dblclick:row="dblClickRow"
    @input="selectHandler"
  >
    <template #[`item.state.status`]="{ item }">
      {{ getStatusText(item.state.status) }}
    </template>
    <template #[`item.addItemColumn`]="{ item }">
      <v-icon
        v-if="item.isSelectable"
        small
        color="primary"
        :disabled="!item.isSelectable"
        @click="addItem(item._id)"
        :style="{ cursor: 'pointer' }"
      >
        mdi-arrow-up-left
      </v-icon>
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
      <b
        :style="{
          color: item.docStatus.fontColor ? item.docStatus.fontColor : null,
        }"
      >
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
    <template #footer.prepend v-if="statisticData && statisticData.count">
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
    <template #[`item.total.price`]="{ item }">
      {{ new Intl.NumberFormat().format(item.total.price) }}
    </template>
    <template #[`item.total.priceWOVat`]="{ item }">
      {{ new Intl.NumberFormat().format(item.total.priceWOVat) }}
    </template>
    <template #[`item.total.sumVat`]="{ item }">
      {{ new Intl.NumberFormat().format(item.total.sumVat) }}
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
  model: {
    prop: 'selected',
    event: 'change',
  },
  props: {
    selected: Array,
    showSelect: {
      type: Boolean,
      default: false,
    },
    headers: { type: Array, required: true },
    loading: { type: Boolean, required: true },
    items: Array,
    count: Number,
    statisticData: Object,
    listOptions: Object,
    itemIdField: {
      type: String,
      default: '_id',
    },
  },
  setup(props, ctx) {
    const orderAnalyticTypeMap = computed(
      () => store.getters.orderAnalyticTypesMap
    )

    const partnersMap = computed(() => store.getters.partnersMap)

    const trucksMap = computed(() => store.getters.trucksMap)

    function getStatusText(status) {
      return store.getters.orderStatusesMap.get(status) || ' --- '
    }

    function dblClickRow(_, { item }) {
      if (item) router.push(`/orders/${item[props.itemIdField]}`)
    }

    function updateListOptionsHandler(options) {
      ctx.emit('update:listOptions', { ...options })
    }

    async function setDocStateStatus(val, id) {
      await OrderService.setDocState(id, val)
    }

    function isNotAccepted(doc) {
      return doc.status !== 'accepted'
    }
    function selectHandler(selectedItems) {
      ctx.emit('change', selectedItems)
    }
    function getOrderDocStatus(docs, isGetted) {
      if (!isGetted && (!docs || !docs.length))
        return { text: 'Не получены', fontColor: 'red' }
      else if (isGetted && (!docs || !docs.length))
        return { text: 'На проверке', fontColor: 'blue' }
      else if (isGetted && docs.some(isNotAccepted))
        return { text: 'На исправлении', fontColor: 'orange' }
      else return { text: 'Приняты', fontColor: 'green' }
    }

    function addItem(itemId) {
      ctx.emit('addItem', itemId)
    }

    const preparedItems = computed(() => {
      if (!props.items || props.items.length === 0) return []

      return props.items.map((order) => ({
        ...order,
        driver:
          store.getters.driversMap.get(order.confirmedCrew?.driver)?.fullName ||
          null,
        tk:
          order.confirmedCrew?.tkName &&
          store.getters.tkNamesMap.has(order.confirmedCrew.tkName)
            ? store.getters.tkNamesMap.get(order.confirmedCrew.tkName).name
            : '-',
        docStatus: getOrderDocStatus(order.docs, order.docsState?.getted),
        plannedDate: order?.route[0]
          ? new Date(order.route[0]?.plannedDate).toLocaleString()
          : null,
        loadingZones:
          order._loadingZones?.map((i) => i.name).join(', ') || null,
        loadingPoints:
          order.route
            .filter((p) => p.type === 'loading')
            .map((p) => store.getters.addressMap.get(p.address)?.shortName) ||
          null,
        unloadingPoints:
          order.route
            .filter((p) => p.type === 'unloading')
            .map((p) => store.getters.addressMap.get(p.address)?.shortName) ||
          null,
      }))
    })

    return {
      orderAnalyticTypeMap,
      dblClickRow,
      partnersMap,
      trucksMap,
      updateListOptionsHandler,
      getStatusText,
      setDocStateStatus,
      preparedItems,
      selectHandler,
      addItem,
    }
  },
}
</script>
