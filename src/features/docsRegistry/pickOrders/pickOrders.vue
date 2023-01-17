<template>
  <v-card elevation="2" outlined class="ma-5">
    <v-card-actions>
      <v-btn @click="cancelHandler" class="ma-2">Закрыть</v-btn>
      <v-btn @click="addToRegistryHandler" class="ma-2" color="primary"
        >Добавить в опись</v-btn
      >
    </v-card-actions>

    <v-card-title>
      Подобрать рейсы для описи № {{ docsRegistryId }}
    </v-card-title>
    <v-card-text>
      <pick-orders-settings />
    </v-card-text>
  </v-card>
</template>
<script>
import { PickOrdersSettings } from '@/entities/docsRegistry'
import { useListData } from './model.js'
export default {
  name: 'PickOrdersFeature',
  components: { PickOrdersSettings },
  props: {
    client: String,
    docsRegistryId: {
      type: String,
      required: true,
    },
  },
  setup({ client, docsRegistryId }, ctx) {
    const { loading } = useListData({ client, docsRegistryId })
    function cancelHandler() {
      ctx.emit('cancel')
    }

    function addToRegistryHandler() {
      console.log('add to registry')
    }
    return {
      cancelHandler,
      addToRegistryHandler,
      loading,
    }
  },
}
</script>
