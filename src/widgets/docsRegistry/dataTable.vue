<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :loading="loading"
    height="70vh"
    dense
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
  </v-data-table>
</template>

<script>
import { ref } from 'vue'
import router from '@/router'

export default {
  name: 'DocsRegistryDataTable',
  model: {
    prop: 'settings',
    event: 'change',
  },
  props: {
    items: Array,
    settings: Object,
    headers: Array,
    loading: Boolean,
  },
  setup(props, ctx) {
    const listOptions = ref(props.settings?.listOptions || {})

    function dblClickRow(_event, { item }) {
      router.push(`docsRegistry/${item._id}`)
    }
    function updateListOptionsHandler(options) {
      ctx.emit('update:listOptions', { ...options })
    }

    // watch(
    //   listOptions,
    //   () => {
    //     ctx.emit(
    //       'change',
    //       Object.assign({}, props?.settings, {
    //         listOptions: listOptions?.value,
    //       })
    //     )
    //   }
    //   // { immediate: true }
    // )

    return {
      dblClickRow,
      listOptions,
      updateListOptionsHandler,
    }
  },
}
</script>
