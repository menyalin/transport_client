<template>
  <div class="block-wrapper">
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
    <place-item
      v-for="place of places"
      :key="place._id"
      :value="place"
      @edit="editPlaceHandler"
      @delete="deletePlaceHandler"
    />
    <v-dialog v-model="showDialog" max-width="1200" persistent>
      <place-for-transfer-docs-form
        ref="placeForm"
        :item="editableItem"
        :partnerId="partnerId"
        @submit="formSubmitHandler"
        @cancel="formCancelHandler"
      />
    </v-dialog>
  </div>
</template>

<script>
import store from '@/store'
import { ref } from 'vue'
import PlaceItem from './placeItem.vue'
import PlaceForTransferDocsForm from './placeForTransferDocsForm.vue'
import { PartnerService } from '@/shared/services'

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
  setup(props, ctx) {
    const placeForm = ref(null) // ref на компонент формы
    const showDialog = ref(false)
    const editableItem = ref({})

    function addPlaceHandler() {
      showDialog.value = true
    }

    async function formSubmitHandler(formState) {
      let updatedPartner
      if (!props.partnerId || !formState) return null
      try {
        if (formState._id) {
          updatedPartner = await PartnerService.updatePlaceForTransferDocs(
            props.partnerId,
            formState._id,
            formState
          )
        } else {
          updatedPartner = await PartnerService.addPlaceForTransferDocs(
            props.partnerId,
            formState
          )
        }
        ctx.emit('change', updatedPartner.placesForTransferDocs)
        placeForm.value.clear()
        showDialog.value = false
      } catch (e) {
        store.commit('setError', e)
      }
    }

    function formCancelHandler() {
      showDialog.value = false
      editableItem.value = {}
    }

    async function editPlaceHandler(placeId) {
      const editablePlace = props.places.find((i) => placeId === i._id)
      if (!editablePlace) return null
      editableItem.value = { ...editablePlace }
      showDialog.value = true
    }

    async function deletePlaceHandler(placeId) {
      if (!props.partnerId || !placeId) return null

      try {
        const updatedPartner = await PartnerService.deletePlaceForTransferDocs(
          props.partnerId,
          placeId
        )
        ctx.emit('change', updatedPartner.placesForTransferDocs)
      } catch (e) {
        store.commit('setError', e)
      }
    }

    return {
      showDialog,
      editableItem,
      addPlaceHandler,
      formSubmitHandler,
      formCancelHandler,
      editPlaceHandler,
      deletePlaceHandler,
      placeForm,
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
