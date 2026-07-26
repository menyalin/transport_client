<template>
  <div class="block-wrapper">
    <v-alert v-if="!partnerId" type="info">
      Добавление площадок возможно только после сохранения партнера
    </v-alert>
    <v-btn
      v-else
      size="small"
      color="primary"
      :style="{ maxWidth: '200px' }"
      @click="addPlaceHandler"
    >
      Добавить площадку
    </v-btn>
    <PlaceItem
      v-for="place of places"
      :key="place._id"
      :value="place"
      @edit="editPlaceHandler"
      @delete="deletePlaceHandler"
    />
    <v-dialog
      :model-value="showDialog"
      @update:model-value="showDialog = $event"
      max-width="1200"
      persistent
    >
      <PlaceForTransferDocsForm
        ref="placeForm"
        :item="editableItem"
        :partnerId="partnerId"
        @submit="formSubmitHandler"
        @cancel="formCancelHandler"
      />
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import store from '@/store'
import PlaceItem from './placeItem.vue'
import PlaceForTransferDocsForm from './placeForTransferDocsForm.vue'
import { PartnerService } from '@/shared/services'

defineOptions({ name: 'PlacesForTransferDocs' })

const places = defineModel({ type: Array, default: () => [] })

const props = defineProps({
  partnerId: String,
})

const placeForm = ref(null)
const showDialog = ref(false)
const editableItem = ref({})

function addPlaceHandler() {
  showDialog.value = true
}

async function formSubmitHandler(formState) {
  if (!props.partnerId || !formState) return null
  try {
    let updatedPartner
    if (formState._id) {
      updatedPartner = await PartnerService.updatePlaceForTransferDocs(
        props.partnerId,
        formState._id,
        formState
      )
    } else {
      updatedPartner = await PartnerService.addPlaceForTransferDocs(props.partnerId, formState)
    }
    places.value = updatedPartner.placesForTransferDocs
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
  const editablePlace = places.value.find((i) => placeId === i._id)
  if (!editablePlace) return null
  editableItem.value = { ...editablePlace }
  showDialog.value = true
}

async function deletePlaceHandler(placeId) {
  if (!props.partnerId || !placeId) return null
  try {
    const updatedPartner = await PartnerService.deletePlaceForTransferDocs(props.partnerId, placeId)
    places.value = updatedPartner.placesForTransferDocs
  } catch (e) {
    store.commit('setError', e)
  }
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
