<template>
  <v-data-table-server
    :headers="headers"
    :items="items"
    :loading="loading"
    height="70vh"
    fixed-header
    :items-per-page-options="[50, 100, 200]"
    v-model:options="settings.listOptions"
    :items-length="totalCount"
    @dblclick:row="dblClickRow"
  >
    <template #[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>
    <template #[`item.note`]="{ item }">
      <span class="d-inline-block text-truncate" style="max-width: 200px">
        {{ item.note }}
      </span>
    </template>
  </v-data-table-server>
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
    totalCount: Number,
    settings: Object,
    headers: Array,
    loading: Boolean,
  },
  setup(props, _ctx) {
    const listOptions = ref(props.settings?.listOptions || {})

    function dblClickRow(_event, { item }) {
      router.push(`docsRegistry/${item._id}`)
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
    }
  },
}
</script>
