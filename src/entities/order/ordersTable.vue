<template>
  <v-data-table-server
    v-model="selected"
    :v-bind="$attrs"
    :headers="headers"
    :loading="loading"
    :items="preparedItems"
    v-model:items-per-page="options.itemsPerPage"
    v-model:page="options.page"
    fixed-header
    height="65vh"
    :items-length="statisticData && !!statisticData.count ? statisticData.count : 0"
    @update:options="updateListOptionsHandler"
    @dblclick:row="dblClickRow"
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
      <v-checkbox-btn
        :model-value="item.docsState ? item.docsState.getted : false"
        :disabled="!!item.docs && !!item.docs.length"
        color="primary"
        @update:model-value="setDocStateStatus($event, item._id)"
      />
    </template>
    <template #[`footer.prepend`] v-if="statisticData && statisticData.count">
      <OrderListFooterDetails
        :total="statisticData.count"
        :accepted="statisticData.acceptedDocs"
        :needFix="statisticData.needFixDocs"
        :onCheck="statisticData.onCheckDocs"
        :missing="statisticData.missingDocs"
      />
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn size="small" @click="$emit('openDocsDialog', item[itemIdField])">
        <v-icon size="small"> mdi-file-document-multiple </v-icon>
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
<script setup>
import { computed } from 'vue'
import { OrderService } from '@/shared/services'
import { OrderListFooterDetails } from '@/shared/ui'
import { useStore } from 'vuex'
import { useAddressStore } from '@/entities/address'
import { useRouter } from 'vue-router'
const addressStore = useAddressStore()

defineOptions({ name: 'OrdersTable' })
const selected = defineModel({ type: Array })
const options = defineModel('options', { type: Object })

const props = defineProps({
  headers: { type: Array, required: true },
  loading: { type: Boolean, required: true },
  items: Array,
  count: Number,
  statisticData: Object,

  itemIdField: {
    type: String,
    default: '_id',
  },
  carrierItemsMap: {
    type: Map,
    required: true,
  },
})

const emits = defineEmits(['addItem', 'update:options', 'openDocsDialog'])

const vuexStore = useStore()
const router = useRouter()

const orderAnalyticTypeMap = computed(() => vuexStore.getters.orderAnalyticTypesMap)

const partnersMap = computed(() => vuexStore.getters.partnersMap)

const trucksMap = computed(() => vuexStore.getters.trucksMap)

function getStatusText(status) {
  return vuexStore.getters.orderStatusesMap.get(status) || ' --- '
}

function updateListOptionsHandler(value) {
  emits('update:options', value)
}

function dblClickRow(_, { item }) {
  if (item) router.push(`/orders/${item[props.itemIdField]}`)
}

async function setDocStateStatus(val, id) {
  await OrderService.setDocState(id, val)
}

function isNotAccepted(doc) {
  return doc.status !== 'accepted'
}

function getOrderDocStatus(docs, isGetted) {
  if (!isGetted && (!docs || !docs.length)) return { text: 'Не получены', fontColor: 'red' }
  else if (isGetted && (!docs || !docs.length)) return { text: 'На проверке', fontColor: 'blue' }
  else if (isGetted && docs.some(isNotAccepted))
    return { text: 'На исправлении', fontColor: 'orange' }
  else return { text: 'Приняты', fontColor: 'green' }
}

function addItem(itemId) {
  emits('addItem', itemId)
}

const preparedItems = computed(() => {
  if (!props.items || props.items.length === 0) return []

  return props.items.map((order) => ({
    ...order,
    driver: vuexStore.getters.driversMap.get(order.confirmedCrew?.driver)?.fullName || null,
    tk:
      order.confirmedCrew?.tkName && props.carrierItemsMap.has(order.confirmedCrew.tkName)
        ? props.carrierItemsMap.get(order.confirmedCrew.tkName).name
        : '-',
    docStatus: getOrderDocStatus(order.docs, order.docsState?.getted),
    plannedDate: order?.route[0] ? new Date(order.route[0]?.plannedDate).toLocaleString() : null,
    loadingZones: order._loadingZones?.map((i) => i.name).join(', ') || null,
    loadingPoints:
      order.route
        .filter((p) => p.type === 'loading')
        .map((p) => addressStore.addressMap.get(p.address)?.shortName) || null,
    unloadingPoints:
      order.route
        .filter((p) => p.type === 'unloading')
        .map((p) => addressStore.addressMap.get(p.address)?.shortName) || null,
  }))
})
</script>
