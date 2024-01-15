<template>
  <v-data-table
    v-model="selected"
    :headers="headers"
    checkbox-color="primary"
    item-key="_id"
    show-select
    :items="items"
    :loading="loading"
    height="70vh"
    dense
    :server-items-length="totalCount"
    fixed-header
    :footer-props="{
      'items-per-page-options': [50, 100, 200],
    }"
    :options="settings.listOptions"
    @update:options="updateListOptionsHandler"
    @dblclick:row="dblClickRow"
  >
    <template #[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>

    <template #[`item.sendDate`]="{ item }">
      {{ item.sendDate ? new Date(item.sendDate).toLocaleDateString() : null }}
    </template>

    <template #[`item.total.priceWOVat`]="{ item }">
      {{ moneyFormatter(item.total.priceWOVat) }}
    </template>

    <template #[`item.vatSum`]="{ item }">
      {{ moneyFormatter(item.total.price - item.total.priceWOVat) }}
    </template>

    <template #[`item.total.price`]="{ item }">
      {{ moneyFormatter(item.total.price) }}
    </template>

    <template #[`item.note`]="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 200px">
        {{ item.note }}
      </span>
    </template>
    <template #footer.prepend>
      <PaymentInvoiceListAnalitics :data="analiticsData" />
    </template>
  </v-data-table>
</template>

<script>
import { ref, computed, watch } from 'vue'
import router from '@/router'
import { moneyFormatter } from '@/shared/utils'
import PaymentInvoiceListAnalitics from './listAnalitics.vue'
import useHistorySettings from '@/shared/hooks/useHistorySettings'
export default {
  name: 'PaymentInvoicesDataTable',
  components: { PaymentInvoiceListAnalitics },
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    items: Array,
    totalCount: Number,
    routesCount: {
      type: Number,
      default: 0,
    },
    total: Object,
    settings: Object,
    headers: Array,
    loading: Boolean,
  },
  setup(props, ctx) {
    const selected = useHistorySettings([], 'selectedInvoicesInList')
    const listOptions = ref(props.settings?.listOptions || {})

    function dblClickRow(_event, { item }) {
      router.push(`paymentInvoice/${item._id}`)
    }
    function updateListOptionsHandler(options) {
      ctx.emit('update:listOptions', { ...options })
    }
    const selectedIds = computed(() => {
      return selected.value.map((i) => i._id)
    })

    const existedIds = computed(() => {
      if (!Array.isArray(props.items)) return []
      return props.items.map((i) => i._id)
    })

    const selectedStatictics = computed(() => {
      const selectedData = props.items
        .filter((i) => selectedIds.value.includes(i._id))
        .reduce(
          (res, item) => ({
            routesCount: res.routesCount + item.count || 0,
            sum: res.sum + item.total?.price || 0,
            sumWOVat: res.sumWOVat + item.total?.priceWOVat || 0,
          }),
          { routesCount: 0, sum: 0, sumWOVat: 0 }
        )
      return {
        count: selectedIds.value.length || 0,
        routesCount: selectedData.routesCount,
        totalSum: selectedData.sum,
        totalSumWOVat: selectedData.sumWOVat,
      }
    })

    const analiticsData = computed(() => {
      if (selectedIds.value.length > 0) return selectedStatictics.value
      else
        return {
          count: props.totalCount || 0,
          routesCount: props.routesCount || 0,
          totalSum: props.total?.sum || 0,
          totalSumWOVat: props.total?.sumWOVat || 0,
        }
    })

    watch(
      () => props.items,
      (val) => {
        if (!val || !val.length) selected.value = []
        else if (!selected.value.length) return
        else
          selected.value = selected.value.filter((i) =>
            existedIds.value.includes(i._id)
          )
      }
    )
    return {
      selected,
      dblClickRow,
      listOptions,
      updateListOptionsHandler,
      moneyFormatter,
      analiticsData,
      selectedIds,
    }
  },
}
</script>
