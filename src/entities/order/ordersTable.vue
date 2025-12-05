<template>
  <v-data-table-server
    :modelValue="currentSelected"
    :headers="headers"
    color="primary"
    :loading="loading"
    :items="preparedItems"
    :showSelect="showSelect"
    itemKey="_id"
    fixedHeader
    checkboxColor="primary"
    height="65vh"
    multiSort
    :itemsLength="statisticData && !!statisticData.count ? statisticData.count : undefined"
    :footerProps="{
      'items-per-page-options': [50, 100, 200],
    }"
    :options="listOptions"
    @update:options="updateListOptionsHandler"
    @dblclick:row="dblClickRow"
    @update:model-value="selectHandler"
  >
    <template #[`item.state.status`]="{ item }">
      {{ getStatusText(item.state.status) }}
    </template>
    <template #[`item.addItemColumn`]="{ item }">
      <v-icon
        v-if="item.isSelectable"
        size="small"
        color="primary"
        :disabled="!item.isSelectable"
        :style="{ cursor: 'pointer' }"
        @click="addItem(item._id)"
      >
        mdi-arrow-up-left
      </v-icon>
    </template>

    <template #[`item.truck`]="{ item }">
      {{
        !!item.confirmedCrew && !!item.confirmedCrew.truck && trucksMap.has(item.confirmedCrew.truck)
          ? trucksMap.get(item.confirmedCrew.truck).regNum
          : '-'
      }}
    </template>
    <template #[`item.trailer`]="{ item }">
      {{
        !!item.confirmedCrew && !!item.confirmedCrew.trailer && trucksMap.has(item.confirmedCrew.trailer)
          ? trucksMap.get(item.confirmedCrew.trailer).regNum
          : ''
      }}
    </template>
    <template #[`item.client.client`]="{ item }">
      {{ !!item.client && partnersMap.has(item.client.client) ? partnersMap.get(item.client.client).name : '-' }}
    </template>
    <template #[`item.analytics.type`]="{ item }">
      {{
        !!item.analytics && !!item.analytics.type && orderAnalyticTypeMap.has(item.analytics.type)
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
      <v-checkbox
        :modelValue="item.docsState ? item.docsState.getted : false"
        :disabled="!!item.docs && !!item.docs.length"
        color="primary"
        hideDetails
        @update:model-value="setDocStateStatus($event, item._id)"
      />
    </template>
    <template v-if="statisticData && statisticData.count" #[`footer.prepend`]>
      <OrderListFooterDetails
        :total="statisticData.count"
        :accepted="statisticData.acceptedDocs"
        :needFix="statisticData.needFixDocs"
        :onCheck="statisticData.onCheckDocs"
        :missing="statisticData.missingDocs"
      />
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn color="primary" icon size="small" @click="$emit('openDocsDialog', item[itemIdField])">
        <v-icon size="small">mdi-file-document-multiple</v-icon>
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
  </v-data-table-server>
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
      modelValue: {
        type: Array,
        default: () => [],
      },
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
    emits: ['update:modelValue', 'change', 'update:listOptions', 'openDocsDialog'],
    setup(props, ctx) {
      const orderAnalyticTypeMap = computed(() => store.getters.orderAnalyticTypesMap)

      const partnersMap = computed(() => store.getters.partnersMap)

      const trucksMap = computed(() => store.getters.trucksMap)

      // Используем modelValue если доступно, иначе selected
      const currentSelected = computed(() => props.modelValue || props.selected || [])

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
        ctx.emit('update:modelValue', selectedItems)
      }
      function getOrderDocStatus(docs, isGetted) {
        if (!isGetted && (!docs || !docs.length)) return { text: 'Не получены', fontColor: 'red' }
        else if (isGetted && (!docs || !docs.length)) return { text: 'На проверке', fontColor: 'blue' }
        else if (isGetted && docs.some(isNotAccepted)) return { text: 'На исправлении', fontColor: 'orange' }
        else return { text: 'Приняты', fontColor: 'green' }
      }

      function addItem(itemId) {
        ctx.emit('addItem', itemId)
      }

      const preparedItems = computed(() => {
        if (!props.items || props.items.length === 0) return []

        return props.items.map(order => ({
          ...order,
          driver: store.getters.driversMap.get(order.confirmedCrew?.driver)?.fullName || null,
          tk:
            order.confirmedCrew?.tkName && store.getters.tkNamesMap.has(order.confirmedCrew.tkName)
              ? store.getters.tkNamesMap.get(order.confirmedCrew.tkName).name
              : '-',
          docStatus: getOrderDocStatus(order.docs, order.docsState?.getted),
          plannedDate: order?.route[0] ? new Date(order.route[0]?.plannedDate).toLocaleString() : null,
          loadingZones: order._loadingZones?.map(i => i.name).join(', ') || null,
          loadingPoints:
            order.route
              .filter(p => p.type === 'loading')
              .map(p => store.getters.addressMap.get(p.address)?.shortName) || null,
          unloadingPoints:
            order.route
              .filter(p => p.type === 'unloading')
              .map(p => store.getters.addressMap.get(p.address)?.shortName) || null,
        }))
      })

      return {
        orderAnalyticTypeMap,
        dblClickRow,
        partnersMap,
        trucksMap,
        currentSelected,
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
