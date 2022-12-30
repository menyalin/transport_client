<template>
  <div class="block-wrapper">
    <h5 class="ml-3">Площадки приема первичных документов</h5>
    <v-alert v-if="!partnerId" type="info">
      Добавление площадок возможно только после сохранения партнера
    </v-alert>
    <v-btn
      v-else
      small
      color="primary"
      :style="{ maxWidth: '200px' }"
      @click="addPlaceHandler"
    >
      Добавить площадку
    </v-btn>
    <place-item v-for="place of places" :key="place._id" :value="place" />
    <v-dialog v-model="showDialog" max-width="1200" persistent>
      <place-for-transfer-docs-form
        :partnerId="partnerId"
        @submit="formSubmitHandler"
        @cancel="formCancelHandler"
      />
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue'
import PlaceItem from './placeItem.vue'
import { PlaceForTransferDocsForm } from '@/widgets'

export default {
  components: { PlaceItem, PlaceForTransferDocsForm },
  name: 'PlacesForTransferDocs',
  model: {
    prop: 'places',
    event: 'change',
  },
  props: {
    partnerId: String,
    places: Array,
  },
  setup() {
    const showDialog = ref(true)
    const mockPlaces = [
      {
        _id: 1,
        title: 'БИКОМ',
        address: '61b759ad30a28a9af8a7b0c4',
        allowedLoadingPoints: [
          '61b759ad30a28a9af8a7b0c4',
          '61e7f19c87579a0c2af03fe5',
          '61b7508c30a28a9af8a7b034',
        ],
        contacts:
          'Строка с контактной информацией. можно выводить в печатную форму',
        note: 'Комментарий к площадке',
      },
    ]
    function addPlaceHandler() {
      showDialog.value = true
    }

    function formSubmitHandler() {}
    function formCancelHandler() {
      showDialog.value = false
    }
    return {
      showDialog,
      addPlaceHandler,
      formSubmitHandler,
      formCancelHandler,
      places: mockPlaces,
    }
  },
}
</script>

<style scoped>
.block-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}
</style>
